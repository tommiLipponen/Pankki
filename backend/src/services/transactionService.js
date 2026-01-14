const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Transaction Service
 * Handles all transaction operations with dual card mode support
 * DEBIT mode: balance cannot go negative
 * CREDIT mode: balance can go negative up to -creditLimit
 */

/**
 * Create a new transaction
 * @param {number} accountId - Account ID
 * @param {number} cardId - Card ID used for transaction
 * @param {string} transactionType - DEPOSIT, WITHDRAWAL, TRANSFER_IN, TRANSFER_OUT
 * @param {string} cardMode - DEBIT or CREDIT
 * @param {number} amount - Transaction amount (positive number)
 * @param {string} description - Optional transaction description
 */
async function createTransaction(accountId, cardId, transactionType, cardMode, amount, description = null) {
  try {
    // Fetch account with current balance and credit limit
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: { customer: true }
    });

    if (!account) {
      throw new Error('Account not found');
    }

    if (!account.isActive) {
      throw new Error('Account is not active');
    }

    // Verify card belongs to this account
    const card = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!card || card.accountId !== accountId) {
      throw new Error('Card does not belong to this account');
    }

    if (card.isLocked || !card.isActive) {
      throw new Error('Card is locked or inactive');
    }

    // Calculate new balance based on transaction type
    let newBalance = parseFloat(account.balance);
    const transactionAmount = parseFloat(amount);

    switch (transactionType) {
      case 'DEPOSIT':
      case 'TRANSFER_IN':
        newBalance += transactionAmount;
        break;
      case 'WITHDRAWAL':
      case 'TRANSFER_OUT':
        newBalance -= transactionAmount;
        break;
      default:
        throw new Error('Invalid transaction type');
    }

    // Validate balance based on card mode
    if (cardMode === 'DEBIT') {
      if (newBalance < 0) {
        throw new Error('Insufficient funds for DEBIT transaction');
      }
    } else if (cardMode === 'CREDIT') {
      const creditLimit = parseFloat(account.creditLimit);
      if (newBalance < -creditLimit) {
        throw new Error(`Insufficient credit. Limit: ${creditLimit}, New balance would be: ${newBalance}`);
      }
    } else {
      throw new Error('Invalid card mode');
    }

    // Create transaction and update account balance in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update account balance
      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: { balance: newBalance }
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          accountId,
          cardId,
          transactionType,
          cardMode,
          amount: transactionAmount,
          balanceAfter: newBalance,
          description
        },
        include: {
          account: {
            include: {
              customer: true
            }
          },
          card: true
        }
      });

      return transaction;
    });

    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all transactions for an account
 * @param {number} accountId - Account ID
 * @param {number} limit - Max number of transactions to return
 */
async function getTransactionsByAccount(accountId, limit = 50) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { accountId },
      include: {
        card: {
          select: {
            cardNumber: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return transactions;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all transactions for a specific card
 * @param {number} cardId - Card ID
 * @param {number} limit - Max number of transactions to return
 */
async function getTransactionsByCard(cardId, limit = 50) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { cardId },
      include: {
        account: {
          select: {
            accountNumber: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return transactions;
  } catch (error) {
    throw error;
  }
}

/**
 * Get a single transaction by ID
 * @param {number} id - Transaction ID
 */
async function getTransactionById(id) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        account: {
          include: {
            customer: true
          }
        },
        card: true
      }
    });

    return transaction;
  } catch (error) {
    throw error;
  }
}

/**
 * Transfer money between accounts
 * @param {number} fromAccountId - Source account ID
 * @param {number} toAccountId - Destination account ID
 * @param {number} cardId - Card ID used for transaction
 * @param {string} cardMode - DEBIT or CREDIT
 * @param {number} amount - Transfer amount
 * @param {string} description - Optional description
 */
async function transfer(fromAccountId, toAccountId, cardId, cardMode, amount, description = null) {
  try {
    if (fromAccountId === toAccountId) {
      throw new Error('Cannot transfer to the same account');
    }

    // Create both transactions in a single database transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create TRANSFER_OUT transaction (deduct from source)
      const outTransaction = await createTransaction(
        fromAccountId,
        cardId,
        'TRANSFER_OUT',
        cardMode,
        amount,
        description ? `Transfer out: ${description}` : 'Transfer out'
      );

      // Create TRANSFER_IN transaction (add to destination)
      const inTransaction = await createTransaction(
        toAccountId,
        cardId,
        'TRANSFER_IN',
        'DEBIT', // Receiving account always uses DEBIT mode
        amount,
        description ? `Transfer in: ${description}` : 'Transfer in'
      );

      return {
        outTransaction,
        inTransaction
      };
    });

    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTransaction,
  getTransactionsByAccount,
  getTransactionsByCard,
  getTransactionById,
  transfer
};

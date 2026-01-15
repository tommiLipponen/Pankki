// Transaction Controller
// HTTP request handling for transaction operations

const transactionService = require('../services/transactionService');

class TransactionController {
  // POST /api/transactions
  async createTransaction(req, res, next) {
    try {
      const { accountId, cardId, transactionType, cardMode, amount, description } = req.body;

      // Basic validation
      if (!accountId || !cardId || !transactionType || !cardMode || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: accountId, cardId, transactionType, cardMode, amount'
        });
      }

      // Validate transactionType
      const validTypes = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER_IN', 'TRANSFER_OUT'];
      if (!validTypes.includes(transactionType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid transactionType. Must be: DEPOSIT, WITHDRAWAL, TRANSFER_IN, or TRANSFER_OUT'
        });
      }

      // Validate cardMode
      const validModes = ['DEBIT', 'CREDIT'];
      if (!validModes.includes(cardMode)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid cardMode. Must be: DEBIT or CREDIT'
        });
      }

      // Validate amount
      if (isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number'
        });
      }

      const transaction = await transactionService.createTransaction(
        accountId,
        cardId,
        transactionType,
        cardMode,
        amount,
        description
      );

      res.status(201).json({
        success: true,
        data: transaction,
        message: 'Transaction created successfully'
      });
    } catch (error) {
      // Handle business logic errors from service
      if (error.message.includes('not found') || 
          error.message.includes('not active') ||
          error.message.includes('does not belong') ||
          error.message.includes('locked') ||
          error.message.includes('Insufficient')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  // GET /api/transactions/account/:accountId
  async getTransactionsByAccount(req, res, next) {
    try {
      const { accountId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;

      if (isNaN(accountId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid accountId'
        });
      }

      const transactions = await transactionService.getTransactionsByAccount(
        parseInt(accountId),
        limit
      );

      res.json({
        success: true,
        data: transactions,
        count: transactions.length
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/transactions/card/:cardId
  async getTransactionsByCard(req, res, next) {
    try {
      const { cardId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;

      if (isNaN(cardId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid cardId'
        });
      }

      const transactions = await transactionService.getTransactionsByCard(
        parseInt(cardId),
        limit
      );

      res.json({
        success: true,
        data: transactions,
        count: transactions.length
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/transactions/:id
  async getTransactionById(req, res, next) {
    try {
      const transaction = await transactionService.getTransactionById(
        parseInt(req.params.id)
      );

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/transactions/transfer
  async transfer(req, res, next) {
    try {
      const { fromAccountId, toAccountId, cardId, cardMode, amount, description } = req.body;

      // Basic validation
      if (!fromAccountId || !toAccountId || !cardId || !cardMode || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: fromAccountId, toAccountId, cardId, cardMode, amount'
        });
      }

      // Validate cardMode
      const validModes = ['DEBIT', 'CREDIT'];
      if (!validModes.includes(cardMode)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid cardMode. Must be: DEBIT or CREDIT'
        });
      }

      // Validate amount
      if (isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number'
        });
      }

      const result = await transactionService.transfer(
        fromAccountId,
        toAccountId,
        cardId,
        cardMode,
        amount,
        description
      );

      res.status(201).json({
        success: true,
        data: result,
        message: 'Transfer completed successfully'
      });
    } catch (error) {
      // Handle business logic errors
      if (error.message.includes('Cannot transfer') ||
          error.message.includes('not found') ||
          error.message.includes('not active') ||
          error.message.includes('does not belong') ||
          error.message.includes('locked') ||
          error.message.includes('Insufficient')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = new TransactionController();

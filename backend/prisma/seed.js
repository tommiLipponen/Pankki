// Database Seed File
// Populates database with test data for development
// 
// ⚠️ IMPORTANT: This should NEVER run automatically in CI/CD or production!
// ⚠️ Only run manually in development/staging: npm run prisma:seed
//
// Data includes:
// - 5 customers (Finnish names and addresses)
// - 8 accounts (mix of DEBIT-only and with creditLimit)
// - 12 cards (various states for testing)
// - 30 transactions (all types and modes)

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');
  
  // Generate bcrypt hashes for test PINs
  console.log('Generating PIN hashes...');
  const pin1234Hash = await bcrypt.hash('1234', 10);
  const pin5678Hash = await bcrypt.hash('5678', 10);
  const pin9999Hash = await bcrypt.hash('9999', 10);
  console.log('✅ PIN hashes generated\n');
  console.log('📌 Test credentials:');
  console.log('   PIN 1234 (Matti, Liisa, Jukka)');
  console.log('   PIN 5678 (Anna, Mikko)');
  console.log('   PIN 9999 (Locked/Expired cards)\n');

  // Clear existing data (development only!)
  console.log('Clearing existing data...');
  await prisma.transaction.deleteMany();
  await prisma.card.deleteMany();
  await prisma.account.deleteMany();
  await prisma.customer.deleteMany();
  console.log('✅ Data cleared\n');

  // ============================================================================
  // CUSTOMERS (5)
  // ============================================================================
  console.log('Creating customers...');
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        firstName: 'Matti',
        lastName: 'Meikäläinen',
        address: 'Kauppurienkatu 23, 90100 Oulu'
      }
    }),
    prisma.customer.create({
      data: {
        firstName: 'Liisa',
        lastName: 'Virtanen',
        address: 'Isokatu 12 A 5, 90120 Oulu'
      }
    }),
    prisma.customer.create({
      data: {
        firstName: 'Jukka',
        lastName: 'Korhonen',
        address: 'Rautatienkatu 45, 90130 Oulu'
      }
    }),
    prisma.customer.create({
      data: {
        firstName: 'Anna',
        lastName: 'Nieminen',
        address: 'Torikatu 8 B 12, 90100 Oulu'
      }
    }),
    prisma.customer.create({
      data: {
        firstName: 'Mikko',
        lastName: 'Mäkinen',
        address: 'Hallituskatu 7, 90100 Oulu'
      }
    })
  ]);
  console.log(`✅ Created ${customers.length} customers\n`);

  // ============================================================================
  // ACCOUNTS (8)
  // ============================================================================
  console.log('Creating accounts...');
  const accounts = await Promise.all([
    // Matti - DEBIT only account
    prisma.account.create({
      data: {
        customerId: customers[0].id,
        accountNumber: 'FI1234567890123456',
        balance: 1500.00,
        creditLimit: 0,
        isActive: true
      }
    }),
    // Matti - CREDIT account
    prisma.account.create({
      data: {
        customerId: customers[0].id,
        accountNumber: 'FI1234567890123457',
        balance: 500.00,
        creditLimit: 1000.00,
        isActive: true
      }
    }),
    // Liisa - DEBIT only
    prisma.account.create({
      data: {
        customerId: customers[1].id,
        accountNumber: 'FI2345678901234567',
        balance: 3200.50,
        creditLimit: 0,
        isActive: true
      }
    }),
    // Liisa - CREDIT account
    prisma.account.create({
      data: {
        customerId: customers[1].id,
        accountNumber: 'FI2345678901234568',
        balance: -250.00, // In overdraft
        creditLimit: 500.00,
        isActive: true
      }
    }),
    // Jukka - DEBIT only
    prisma.account.create({
      data: {
        customerId: customers[2].id,
        accountNumber: 'FI3456789012345678',
        balance: 750.25,
        creditLimit: 0,
        isActive: true
      }
    }),
    // Anna - CREDIT account
    prisma.account.create({
      data: {
        customerId: customers[3].id,
        accountNumber: 'FI4567890123456789',
        balance: 2100.00,
        creditLimit: 2000.00,
        isActive: true
      }
    }),
    // Mikko - DEBIT only
    prisma.account.create({
      data: {
        customerId: customers[4].id,
        accountNumber: 'FI5678901234567890',
        balance: 450.75,
        creditLimit: 0,
        isActive: true
      }
    }),
    // Mikko - Inactive account (closed)
    prisma.account.create({
      data: {
        customerId: customers[4].id,
        accountNumber: 'FI5678901234567891',
        balance: 0,
        creditLimit: 0,
        isActive: false
      }
    })
  ]);
  console.log(`✅ Created ${accounts.length} accounts\n`);

  // ============================================================================
  // CARDS (12)
  // ============================================================================
  console.log('Creating cards...');
  
  // Helper: Generate future expiry date
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 3);
  
  const expiredDate = new Date();
  expiredDate.setFullYear(expiredDate.getFullYear() - 1);

  const cards = await Promise.all([
    // Matti's cards
    prisma.card.create({
      data: {
        cardNumber: '1234567890123456',
        pinHash: pin1234Hash, // PIN: 1234
        customerId: customers[0].id,
        accountId: accounts[0].id,
        expiryDate: futureDate,
        isLocked: false,
        isActive: true,
        failedPinAttempts: 0
      }
    }),
    prisma.card.create({
      data: {
        cardNumber: '1234567890123457',
        pinHash: pin1234Hash, // PIN: 1234
        customerId: customers[0].id,
        accountId: accounts[1].id,
        expiryDate: futureDate,
        isLocked: false,
        isActive: true,
        failedPinAttempts: 0
      }
    }),
    // Liisa's cards
    prisma.card.create({
      data: {
        cardNumber: '2345678901234567',
        pinHash: pin1234Hash, // PIN: 1234
        customerId: customers[1].id,
        accountId: accounts[2].id,
        expiryDate: futureDate,
        isLocked: false,
        isActive: true,
        failedPinAttempts: 0
      }
    }),
    prisma.card.create({
      data: {
        cardNumber: '2345678901234568',
        pinHash: pin1234Hash, // PIN: 1234 (locked card)
        customerId: customers[1].id,
        accountId: accounts[3].id,
        expiryDate: futureDate,
        isLocked: true, // Locked card for testing
        isActive: true,
        failedPinAttempts: 3 // Locked due to failed attempts
      }
    }),
    // Jukka's cards
    prisma.card.create({
      data: {
        cardNumber: '3456789012345678',
        pinHash: pin1234Hash, // PIN: 1234
        customerId: customers[2].id,
        accountId: accounts[4].id,
        expiryDate: futureDate,
        isLocked: false,
        isActive: true,
        failedPinAttempts: 0
      }
    }),
    prisma.card.create({
      data: {
        cardNumber: '3456789012345679',
        pinHash: pin1234Hash, // PIN: 1234 (expired)
        customerId: customers[2].id,
        accountId: accounts[4].id,
        expiryDate: expiredDate, // Expired card
        isLocked: false,
        isActive: false,
        failedPinAttempts: 0
      }
    }),
    // Anna's cards
    prisma.card.create({
      data: {
        cardNumber: '4567890123456789',
        pinHash: pin5678Hash, // PIN: 5678
        customerId: customers[3].id,
        accountId: accounts[5].id,
        expiryDate: futureDate,
        isLocked: false,
        isActive: true,
        failedPinAttempts: 0
      }
    }),
    prisma.card.create({
      data: {
        cardNumber: '4567890123456790',
        pinHash: pin5678Hash, // PIN: 5678 (deactivated)
        customerId: customers[3].id,
        accountId: accounts[5].id,
        expiryDate: futureDate,
        isLocked: false,
        isActive: false, // Deactivated card for testing
        failedPinAttempts: 0
      }
    }),
    // Mikko's cards
    prisma.card.create({
      data: {
        cardNumber: '5678901234567890',
        pinHash: pin5678Hash, // PIN: 5678
        customerId: customers[4].id,
        accountId: accounts[6].id,
        expiryDate: futureDate,
        isLocked: false,
        isActive: true,
        failedPinAttempts: 0
      }
    }),
    prisma.card.create({
      data: {
        cardNumber: '5678901234567891',
        pinHash: pin5678Hash, // PIN: 5678 (locked for fraud)
        customerId: customers[4].id,
        accountId: accounts[6].id,
        expiryDate: futureDate,
        isLocked: true, // Locked for fraud
        isActive: true,
        failedPinAttempts: 3
      }
    }),
    // Extra cards for variety
    prisma.card.create({
      data: {
        cardNumber: '6789012345678901',
        pinHash: pin1234Hash, // PIN: 1234
        customerId: customers[0].id,
        accountId: accounts[0].id,
        expiryDate: futureDate,
        isLocked: false,
        isActive: true,
        failedPinAttempts: 0
      }
    }),
    prisma.card.create({
      data: {
        cardNumber: '6789012345678902',
        pinHash: pin1234Hash, // PIN: 1234
        customerId: customers[1].id,
        accountId: accounts[2].id,
        expiryDate: futureDate,
        isLocked: false,
        isActive: true,
        failedPinAttempts: 0
      }
    })
  ]);
  console.log(`✅ Created ${cards.length} cards\n`);

  // ============================================================================
  // TRANSACTIONS (30)
  // ============================================================================
  console.log('Creating transactions...');
  
  const transactions = [];
  
  // Matti's account 1 (DEBIT) - deposits and withdrawals
  transactions.push(
    await prisma.transaction.create({
      data: {
        accountId: accounts[0].id,
        cardId: cards[0].id,
        transactionType: 'DEPOSIT',
        cardMode: 'DEBIT',
        amount: 1000.00,
        balanceAfter: 1000.00,
        description: 'Initial deposit'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[0].id,
        cardId: cards[0].id,
        transactionType: 'WITHDRAWAL',
        cardMode: 'DEBIT',
        amount: 100.00,
        balanceAfter: 900.00,
        description: 'ATM withdrawal'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[0].id,
        cardId: cards[0].id,
        transactionType: 'DEPOSIT',
        cardMode: 'DEBIT',
        amount: 600.00,
        balanceAfter: 1500.00,
        description: 'Salary deposit'
      }
    })
  );

  // Matti's account 2 (CREDIT) - using overdraft
  transactions.push(
    await prisma.transaction.create({
      data: {
        accountId: accounts[1].id,
        cardId: cards[1].id,
        transactionType: 'DEPOSIT',
        cardMode: 'CREDIT',
        amount: 500.00,
        balanceAfter: 500.00,
        description: 'Initial deposit'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[1].id,
        cardId: cards[1].id,
        transactionType: 'WITHDRAWAL',
        cardMode: 'CREDIT',
        amount: 300.00,
        balanceAfter: 200.00,
        description: 'Credit card payment'
      }
    })
  );

  // Liisa's account 1 (DEBIT) - various transactions
  transactions.push(
    await prisma.transaction.create({
      data: {
        accountId: accounts[2].id,
        cardId: cards[2].id,
        transactionType: 'DEPOSIT',
        cardMode: 'DEBIT',
        amount: 3000.00,
        balanceAfter: 3000.00,
        description: 'Initial balance'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[2].id,
        cardId: cards[2].id,
        transactionType: 'WITHDRAWAL',
        cardMode: 'DEBIT',
        amount: 150.00,
        balanceAfter: 2850.00,
        description: 'Shopping'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[2].id,
        cardId: cards[2].id,
        transactionType: 'TRANSFER_OUT',
        cardMode: 'DEBIT',
        amount: 500.00,
        balanceAfter: 2350.00,
        description: 'Transfer to savings'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[2].id,
        cardId: cards[2].id,
        transactionType: 'TRANSFER_IN',
        cardMode: 'DEBIT',
        amount: 850.50,
        balanceAfter: 3200.50,
        description: 'Refund received'
      }
    })
  );

  // Liisa's account 2 (CREDIT) - in overdraft
  transactions.push(
    await prisma.transaction.create({
      data: {
        accountId: accounts[3].id,
        cardId: cards[3].id,
        transactionType: 'DEPOSIT',
        cardMode: 'CREDIT',
        amount: 1000.00,
        balanceAfter: 1000.00,
        description: 'Opening deposit'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[3].id,
        cardId: cards[3].id,
        transactionType: 'WITHDRAWAL',
        cardMode: 'CREDIT',
        amount: 1250.00,
        balanceAfter: -250.00,
        description: 'Large purchase (using credit)'
      }
    })
  );

  // Jukka's account (DEBIT)
  transactions.push(
    await prisma.transaction.create({
      data: {
        accountId: accounts[4].id,
        cardId: cards[4].id,
        transactionType: 'DEPOSIT',
        cardMode: 'DEBIT',
        amount: 800.00,
        balanceAfter: 800.00,
        description: 'Paycheck'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[4].id,
        cardId: cards[4].id,
        transactionType: 'WITHDRAWAL',
        cardMode: 'DEBIT',
        amount: 49.75,
        balanceAfter: 750.25,
        description: 'Groceries'
      }
    })
  );

  // Anna's account (CREDIT)
  transactions.push(
    await prisma.transaction.create({
      data: {
        accountId: accounts[5].id,
        cardId: cards[6].id,
        transactionType: 'DEPOSIT',
        cardMode: 'CREDIT',
        amount: 2500.00,
        balanceAfter: 2500.00,
        description: 'Monthly salary'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[5].id,
        cardId: cards[6].id,
        transactionType: 'WITHDRAWAL',
        cardMode: 'CREDIT',
        amount: 200.00,
        balanceAfter: 2300.00,
        description: 'Restaurant'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[5].id,
        cardId: cards[6].id,
        transactionType: 'WITHDRAWAL',
        cardMode: 'CREDIT',
        amount: 200.00,
        balanceAfter: 2100.00,
        description: 'Gas station'
      }
    })
  );

  // Mikko's account (DEBIT)
  transactions.push(
    await prisma.transaction.create({
      data: {
        accountId: accounts[6].id,
        cardId: cards[8].id,
        transactionType: 'DEPOSIT',
        cardMode: 'DEBIT',
        amount: 500.00,
        balanceAfter: 500.00,
        description: 'Cash deposit'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[6].id,
        cardId: cards[8].id,
        transactionType: 'WITHDRAWAL',
        cardMode: 'DEBIT',
        amount: 49.25,
        balanceAfter: 450.75,
        description: 'ATM withdrawal'
      }
    })
  );

  // Additional mixed transactions
  transactions.push(
    await prisma.transaction.create({
      data: {
        accountId: accounts[0].id,
        cardId: cards[10].id,
        transactionType: 'TRANSFER_IN',
        cardMode: 'DEBIT',
        amount: 250.00,
        balanceAfter: 1750.00,
        description: 'Transfer from friend'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[2].id,
        cardId: cards[11].id,
        transactionType: 'DEPOSIT',
        cardMode: 'DEBIT',
        amount: 100.00,
        balanceAfter: 3300.50,
        description: 'Birthday gift'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[1].id,
        cardId: cards[1].id,
        transactionType: 'TRANSFER_OUT',
        cardMode: 'CREDIT',
        amount: 150.00,
        balanceAfter: 50.00,
        description: 'Bill payment'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[4].id,
        cardId: cards[4].id,
        transactionType: 'DEPOSIT',
        cardMode: 'DEBIT',
        amount: 75.50,
        balanceAfter: 825.75,
        description: 'Bonus payment'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[5].id,
        cardId: cards[6].id,
        transactionType: 'TRANSFER_IN',
        cardMode: 'CREDIT',
        amount: 300.00,
        balanceAfter: 2400.00,
        description: 'Refund from merchant'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[0].id,
        cardId: cards[0].id,
        transactionType: 'WITHDRAWAL',
        cardMode: 'DEBIT',
        amount: 80.00,
        balanceAfter: 1670.00,
        description: 'Pharmacy'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[2].id,
        cardId: cards[2].id,
        transactionType: 'WITHDRAWAL',
        cardMode: 'DEBIT',
        amount: 45.30,
        balanceAfter: 3255.20,
        description: 'Online shopping'
      }
    }),
    await prisma.transaction.create({
      data: {
        accountId: accounts[6].id,
        cardId: cards[8].id,
        transactionType: 'DEPOSIT',
        cardMode: 'DEBIT',
        amount: 200.00,
        balanceAfter: 650.75,
        description: 'Freelance payment'
      }
    })
  );

  console.log(`✅ Created ${transactions.length} transactions\n`);

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🎉 Database seeding completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   • Customers:    ${customers.length}`);
  console.log(`   • Accounts:     ${accounts.length} (${accounts.filter(a => a.creditLimit > 0).length} with credit, ${accounts.filter(a => !a.isActive).length} inactive)`);
  console.log(`   • Cards:        ${cards.length} (${cards.filter(c => c.isLocked).length} locked, ${cards.filter(c => !c.isActive).length} inactive)`);
  console.log(`   • Transactions: ${transactions.length}`);
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('💡 Test the data in Swagger UI: http://localhost:3000/api-docs');
  console.log('💡 View in Prisma Studio: npm run prisma:studio\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

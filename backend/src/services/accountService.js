// Account Service
// Database operations for Account model using Prisma


const prisma = require('../config/database');

class AccountService {
    // Get all accounts
    async getAllAccounts() {
        return await prisma.account.findMany({
            orderBy: { id: 'asc' }
        });
    }

    // Get account by ID
    async getAccountById(id) {
        return await prisma.account.findUnique({
            where: { id: parseInt(id) }
        });
    }

    // Create new account
    async createAccount(data) {
        return await prisma.account.create({
            data: {
                customerId: data.customerId,
                accountNumber: data.accountNumber,
                balance: data.balance || 0.00,
                creditLimit: data.creditLimit || 0.00,
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        });
    }

    // Update account
    async updateAccount(id, data) {
        return await prisma.account.update({
            where: { id: parseInt(id) },
            data: {
                accountNumber: data.accountNumber,
                balance: data.balance,
                creditLimit: data.creditLimit,
                isActive: data.isActive
            }
        });
    }

    // Delete account
    async deleteAccount(id) {
        return await prisma.account.delete({
            where: { id: parseInt(id) }
        });
    }

}

module.exports = new AccountService();

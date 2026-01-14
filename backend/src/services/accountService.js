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
                username: data.username,
                email: data.email,
                passwordHash: data.passwordHash
            }
        });
    }

    // Update account
    async updateAccount(id, data) {
        return await prisma.account.update({
            where: { id: parseInt(id) },
            data: {
                username: data.username,
                email: data.email,
                passwordHash: data.passwordHash
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

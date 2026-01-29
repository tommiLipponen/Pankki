//Account Controller
// Http requests handling for account operations

const accountService = require('../services/accountService');

class AccountController {
    // GET /api/accounts
    async getAllAccounts(req, res, next) {
        try {
            const accounts = await accountService.getAllAccounts();
            res.json({
                success: true,
                data: accounts,

                count: accounts.length
            });
        } catch (error) {
            next(error);
        }
        }

    // GET /api/accounts/:id
    async getAccountById(req, res, next) {
        try {
            const account = await accountService.getAccountById(req.params.id);
            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: "Account not found"
                });
            }

            // Authorization: User can only access accounts belonging to their customer
            if (parseInt(req.user.customerId) !== parseInt(account.customerId)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: You can only access your own accounts"
                });
            }
            res.json({
                success: true,
                data: account
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/accounts
    async createAccount(req, res, next) {
        try {
            const { customerId, accountNumber, balance, creditLimit, isActive } = req.body;  
         
            // Basic validation
           if (!customerId || !accountNumber) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: customerId, accountNumber"
                });
           }

            const account = await accountService.createAccount(req.body);
        
            res.status(201).json({
                success: true,
                data: account,
                message: "Account created successfully"
            });

        } catch (error) {
            //Handle unique constraint violation for accountNumber
            
            if (error.code === 'P2002') {
                return res.status(409).json({
                    success: false,
                    message: "Account number already exists"
                });
            }
            next(error);
        }
    }

    // PUT /api/accounts/:id
    async updateAccount(req, res, next) {
        try {
            const {  accountNumber, balance, creditLimit, isActive } = req.body;

            // Atleast one field must be provided for update
            if (!accountNumber && balance === undefined && creditLimit === undefined && isActive === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "At least one field must be provided for update: accountNumber, balance, creditLimit, isActive"
                });
            }

            // First fetch the account to check ownership
            const existingAccount = await accountService.getAccountById(req.params.id);
            if (!existingAccount) {
                return res.status(404).json({
                    success: false,
                    message: "Account not found"
                });
            }

            // Authorization: User can only update accounts belonging to their customer
            if (parseInt(req.user.customerId) !== parseInt(existingAccount.customerId)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: You can only update your own accounts"
                });
            }

            const account = await accountService.updateAccount(req.params.id, req.body);

            res.json({
                success: true,
                data: account,
                message: "Account updated successfully"
            });
        } catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    message: "Account not found"
                });
            }
            if (error.code === 'P2002') {
                return res.status(409).json({
                    success: false,
                    message: "Account number already exists"
                });
            }

            next(error);
        }

    }

    // DELETE /api/accounts/:id
    async deleteAccount(req, res, next) {
        try {
            // First fetch the account to check ownership
            const existingAccount = await accountService.getAccountById(req.params.id);
            if (!existingAccount) {
                return res.status(404).json({
                    success: false,
                    message: "Account not found"
                });
            }

            // Authorization: User can only delete accounts belonging to their customer
            if (parseInt(req.user.customerId) !== parseInt(existingAccount.customerId)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: You can only delete your own accounts"
                });
            }

            await accountService.deleteAccount(req.params.id);
           
            res.json({
                success: true,
                message: "Account deleted successfully"
            });
        } catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    message: "Account not found"
                });
            }
            next(error);
        }

    }

}

module.exports = new AccountController();
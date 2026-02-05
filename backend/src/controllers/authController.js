
// Authentication Controller
// Handles HTTP requests for authentication operations
// Implements 2-step Finnish ATM authentication flow:
//   Step 1: Insert card (validates card exists and is usable)
//   Step 2: Verify PIN (authenticates user and generates JWT token)

const authService = require('../services/authService');

class AuthController {
  /**
   * POST /api/auth/insert-card
   * Step 1: Validates card and returns available modes
   * 
   * Request body:
   *   { "cardNumber": "1111222233334444" }
   * 
   * Success response (200):
   *   { 
   *     "success": true, 
   *     "data": { 
   *       "availableCardMode": ["DEBIT"] or ["DEBIT", "CREDIT"],
   *       "hasCredit": true/false,
   *       "cardId": 1
   *     } 
   *   }
   * 
   * Error responses:
   *   400 - Invalid card number format
   *   404 - Card not found/inactive/expired
   */
  async insertCard(req, res, next) {
    try {
      const { cardNumber } = req.body;

      // Validate required field
      if (!cardNumber) {
        return res.status(400).json({
          success: false,
          message: 'Card number is required'
        });
      }

      // Validate card number format (must be exactly 16 digits)
      // Finnish payment cards follow ISO/IEC 7812 standard
      if (!/^\d{16}$/.test(cardNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid card number format. Must be 16 digits.'
        });
      }

      const result = await authService.insertCard(cardNumber);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      // Handle specific authentication errors with appropriate HTTP status codes
      // 404 for card not found/inactive/expired (security: don't reveal which)
      if (error.message === 'Card not found' || 
          error.message === 'Card is inactive' || 
          error.message === 'Card is expired') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      // Pass unexpected errors to global error handler
      next(error);
    }
  }

  /**
   * POST /api/auth/verify-pin
   * Step 2: Verifies PIN and generates JWT token for authenticated session
   * 
   * Request body:
   *   { 
   *     "cardNumber": "1111222233334444",
   *     "pin": "1234",
   *     "cardMode": "DEBIT" or "CREDIT"
   *   }
   * 
   * Success response (200):
   *   { 
   *     "success": true, 
   *     "data": { 
   *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   *       "expiresIn": "60d",
   *       "customer": { "id": 1, "firstName": "Matti", "lastName": "Meikäläinen" },
   *       "account": { "id": 1, "accountNumber": "FI...", "balance": 1000.00, "creditLimit": null }
   *     } 
   *   }
   * 
   * Error responses:
   *   400 - Invalid format or CREDIT mode not available
   *   401 - Invalid card number or PIN (don't reveal which for security)
   * 
   * Security notes:
   *   - PIN is hashed with bcrypt in database (never stored plain text)
   *   - Failed attempts should be logged (implement in future with stored procedures)
   *   - Card locks after 3 failed attempts (implement in future)
   */
  async verifyPin(req, res, next) {
    try {
      const { cardNumber, pin, cardMode } = req.body;

      // Validate required fields
      if (!cardNumber || !pin || !cardMode) {
        return res.status(400).json({
          success: false,
          message: 'Card number, PIN, and card mode are required'
        });
      }

      // Validate card number format
      if (!/^\d{16}$/.test(cardNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid card number format. Must be 16 digits.'
        });
      }

      // Validate PIN format (must be exactly 4 digits)
      // Finnish ATM standard uses 4-digit PINs
      if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid PIN format. Must be 4 digits.'
        });
      }

      // Validate card mode (must be DEBIT or CREDIT)
      // CREDIT mode only available if account has creditLimit > 0
      if (!['DEBIT', 'CREDIT'].includes(cardMode)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid card mode. Must be DEBIT or CREDIT.'
        });
      }

      // Call service to verify PIN and generate JWT token
      // Token payload includes: cardId, customerId, accountId, cardMode
      const result = await authService.verifyPinAndGenerateToken(cardNumber, pin, cardMode);
      
      // Return token and user context to frontend
      // Frontend stores token in memory/localStorage and includes in Authorization header
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      // Handle authentication errors with appropriate HTTP status codes
      
      // 401 Unauthorized: Invalid credentials or locked card
      // Security: Don't reveal whether card or PIN was wrong (prevents enumeration attacks)
      // Note: Service throws dynamic messages like "Invalid PIN. 2 attempts remaining."
      if (error.message === 'Card not found' || 
          error.message.includes('Invalid PIN') ||
          error.message.includes('locked')) {
        return res.status(401).json({
          success: false,
          message: 'Invalid card number or PIN'
        });
      }
      
      // 400 Bad Request: Valid credentials but invalid card mode selection
      if (error.message === 'CREDIT mode is not available for this card') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      // Pass unexpected errors to global error handler
      next(error);
    }
  }
}

module.exports = new AuthController();

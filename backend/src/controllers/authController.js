
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

}

module.exports = new AuthController();

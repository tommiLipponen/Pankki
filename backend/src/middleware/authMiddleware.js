// Authentication Middleware
// Verifies JWT tokens and attaches user context to requests

const jwt = require('jsonwebtoken');

/**
Authenticate JWT token from Authorization header
Extracts and verifies Bearer token, attaches decoded payload to req.user
Token payload structure:
{
cardId: number,
customerId: number,
accountId: number,
cardMode: 'DEBIT' | 'CREDIT'
}
Usage in routes:
app.use('/api/accounts', authenticateToken, accountRoutes);
router.get('/:id', authenticateToken, controller.method);
Frontend must include header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
@param {Object} req - Express request object
@param {Object} res - Express response object
@param {Function} next - Express next middleware function
*/
function authenticateToken(req, res, next) {
    //Extract authorization header
    //Expect format: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Get token part

    //No token provided
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token is missing'
        });
    }

    //Verify token wiht JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            //Token is invalid, expired, or tampered with
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired access token'
                });
            }

            if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired access token'
                });
            }

            //Other JWT errors
            return res.status(403).json({
                success: false,
                message: 'Token verification failed'
            });
        }

        //Token is valid - attach user info to request
        //Controllers can access: req.user.cardId, req.user.customerId, req.user.accountId, req.user.cardMode
        req.user = decoded;

        //Continue to next middleware or controller
        next();
    });
}

module.exports = {
    authenticateToken
};
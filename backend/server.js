/**
 * Bank ATM API Server
 * Main entry point for the Express application
 */

require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const corsMiddleware = require('./src/middleware/cors');
const { apiLimiter } = require('./src/middleware/rateLimiter');
const { authenticateToken } = require('./src/middleware/authMiddleware');
const errorHandler = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/authRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const accountRoutes = require('./src/routes/accountRoutes');
const cardRoutes = require('./src/routes/cardRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy - Required for Azure App Service
// Allows Express to trust X-Forwarded-* headers from nginx proxy
// Enables correct client IP detection for rate limiting and logging
app.set('trust proxy', true);

// Middleware
app.use(corsMiddleware);
app.use(apiLimiter); // Rate limiting
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Bank ATM API Documentation'
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     description: Check if the API server is running
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// OpenAPI JSON specification for client code generation
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

// ========================================
// API ROUTES
// ========================================

// Public routes (no authentication required)
app.use('/api/auth', authRoutes); // Insert card & verify PIN

// Protected routes (JWT authentication required)
// Frontend must include: Authorization: Bearer <token>
app.use('/api/accounts', authenticateToken, accountRoutes);
app.use('/api/transactions', authenticateToken, transactionRoutes);
app.use('/api/cards', authenticateToken, cardRoutes);

// Semi-protected (optional - depends if you want admin-only access)
// For ATM frontend, customers endpoint is not needed
app.use('/api/customers', customerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server only if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: Connected to Azure MySQL`);
    console.log(`🔐 JWT Authentication: Enabled`);
  });
}

module.exports = app;

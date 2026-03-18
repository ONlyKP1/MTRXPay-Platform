/**
 * Express App Configuration
 * Separate from server.js to enable testing
 */

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MTRX Pay API Documentation'
}));

// Serve OpenAPI spec as JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use(routes);

// 404 handler (after routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;

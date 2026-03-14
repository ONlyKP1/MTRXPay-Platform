const express = require('express');
const cors = require('cors');
const { PORT } = require('./src/config/env');
const { connectDB } = require('./src/config/database');
const routes = require('./src/routes');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(routes);

// 404 handler (after routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const start = async () => {
  // Test database connection
  const dbConnected = await connectDB();

  app.listen(PORT, () => {
    console.log(`MTRX Pay API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Database: ${dbConnected ? 'connected' : 'not connected'}`);
  });
};

start();

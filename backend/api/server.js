const { PORT } = require('./src/config/env');
const { connectDB } = require('./src/config/database');
const app = require('./src/app');

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

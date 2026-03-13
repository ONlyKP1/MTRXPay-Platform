const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

router.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';

  try {
    await query('SELECT 1');
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'disconnected';
  }

  res.json({
    status: 'ok',
    database: dbStatus
  });
});

module.exports = router;

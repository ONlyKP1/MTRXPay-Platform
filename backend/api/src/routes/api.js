const express = require('express');
const router = express.Router();

router.get('/api', (req, res) => {
  res.json({
    service: 'MTRX Pay API',
    version: '0.1'
  });
});

module.exports = router;

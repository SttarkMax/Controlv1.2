// routes/api.js
const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Outras rotas aqui...

module.exports = router;
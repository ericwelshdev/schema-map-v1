const express = require('express');
const router = express.Router();
const { getAzureToken } = require('../controllers/aiAuthController');

router.post('/token', getAzureToken);

module.exports = router;
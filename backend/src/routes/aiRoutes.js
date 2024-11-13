const express = require('express');
const router = express.Router();
const { getCompletion } = require('../controllers/aiController');

router.post('/completions', getCompletion);

module.exports = router;

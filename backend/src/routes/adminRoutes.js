// backend/src/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { getAdminData } = require('../controllers/adminController');

// Admin Route
router.get('/data', auth, role(['admin']), getAdminData);

module.exports = router;

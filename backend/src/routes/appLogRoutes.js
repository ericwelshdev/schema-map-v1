const express = require('express');
const router = express.Router();
const appLogController = require('../controllers/appLogController');

// Create a new log entry
router.post('/', appLogController.create);

// Get all log entries
router.get('/', appLogController.getAll);

// Get log entry by ID
router.get('/:id', appLogController.getById);

// Update a log entry by ID
router.put('/:id', appLogController.update);

// Delete a log entry by ID
router.delete('/:id', appLogController.delete);

module.exports = router;

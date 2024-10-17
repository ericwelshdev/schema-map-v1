const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');

// Create a new UserRole
router.post('/', userRoleController.create);

// Get all UserRoles
router.get('/', userRoleController.getAll);

// Get a UserRole by id
router.get('/:id', userRoleController.getById);

// Update a UserRole by id
router.put('/:id', userRoleController.update);

// Delete a UserRole by id
router.delete('/:id', userRoleController.delete);

module.exports = router;

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create a new user
router.post('/users', userController.createUser);

// Get all users
router.get('/users', userController.getAllUsers);

// Get user by ID
router.get('/users/:id', userController.getUserById);

// Update user by ID
router.put('/users/:id', userController.updateUser);

// Delete user by ID
router.delete('/users/:id', userController.deleteUser);

module.exports = router;

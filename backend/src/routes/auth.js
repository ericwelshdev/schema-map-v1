// backend/src/routes/auth.js

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');

// Register Route with Validation
router.post(
  '/register',
  [
    body('first_nm')
      .notEmpty()
      .withMessage('First name is required.')
      .isLength({ min: 2 })
      .withMessage('First name must be at least 2 characters long.'),
    body('last_nm')
      .notEmpty()
      .withMessage('Last name is required.')
      .isLength({ min: 2 })
      .withMessage('Last name must be at least 2 characters long.'),
    body('email_add_txt')
      .isEmail()
      .withMessage('Please provide a valid email address.'),
    body('usr_nm')
      .notEmpty()
      .withMessage('Username is required.')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long.'),
    body('pswd_hash_txt')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.'),
  ],
  register
);

// Login Route with Validation
router.post(
  '/login',
  [
    body('email_add_txt')
      .isEmail()
      .withMessage('Please provide a valid email address.'),
    body('pswd_hash_txt')
      .notEmpty()
      .withMessage('Password is required.'),
  ],
  login
);

module.exports = router;

// backend/src/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Register a new user
exports.register = async (req, res, next) => {
  const {
    first_nm,
    last_nm,
    email_add_txt,
    usr_nm,
    pswd_hash_txt,
    oprtnl_stat_cd,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email_add_txt } });
    if (existingUser) {
      logger.warn(`Registration attempt with existing email: ${email_add_txt}`);
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pswd_hash_txt, salt);

    // Create the user
    const user = await User.create({
      first_nm,
      last_nm,
      email_add_txt,
      usr_nm,
      pswd_hash_txt: hashedPassword,
      oprtnl_stat_cd: oprtnl_stat_cd || null,
      cre_by_nm: 'system', // Or set based on authenticated user
      cre_ts: new Date(),
      updt_by_nm: 'system', // Or set based on authenticated user
      updt_ts: new Date(),
    });

    // Generate JWT token
    const payload = { user: { usr_id: user.usr_id, role: user.oprtnl_stat_cd || 'user' } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    logger.info(`New user registered: ${email_add_txt}`);
    res.status(201).json({ token });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    next(error);
  }
};

// Login a user
exports.login = async (req, res, next) => {
  const { email_add_txt, pswd_hash_txt } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email_add_txt } });
    if (!user) {
      logger.warn(`Login attempt with invalid email: ${email_add_txt}`);
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(pswd_hash_txt, user.pswd_hash_txt);
    if (!isMatch) {
      logger.warn(`Login attempt with invalid password for email: ${email_add_txt}`);
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Update last login timestamp
    user.last_login_ts = new Date();
    await user.save();

    // Generate JWT token
    const payload = { user: { usr_id: user.usr_id, role: user.oprtnl_stat_cd || 'user' } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    logger.info(`User logged in: ${email_add_txt}`);
    res.json({ token });
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`);
    next(error);
  }
};

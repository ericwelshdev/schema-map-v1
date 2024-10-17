// backend/src/middleware/auth.js

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    logger.warn('No token, authorization denied');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Expected format: 'Bearer <token>'
  if (!token) {
    logger.warn('Token missing, authorization denied');
    return res.status(401).json({ message: 'Token missing, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    logger.warn('Token is not valid');
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;

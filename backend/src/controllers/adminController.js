// backend/src/controllers/adminController.js

const logger = require('../utils/logger');

exports.getAdminData = async (req, res, next) => {
  try {
    // Fetch and process admin-specific data
    const adminData = {
      message: 'This is admin data',
      // Add more data as needed
    };

    logger.info(`Admin data accessed by user ID: ${req.user.id}`);
    res.json(adminData);
  } catch (error) {
    logger.error(`Get admin data error: ${error.message}`);
    next(error);
  }
};

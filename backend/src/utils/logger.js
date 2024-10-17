// backend/src/utils/logger.js

const { createLogger, format, transports } = require('winston');
const path = require('path');

// Ensure the logs directory exists or adjust the path as needed
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }), // Include stack trace
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, '../../logs/error.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, '../../logs/combined.log') }),
  ],
});

// If not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    ),
  }));
}

module.exports = logger;

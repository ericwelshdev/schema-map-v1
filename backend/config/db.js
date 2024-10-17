// backend/config/db.js

const { Sequelize } = require('sequelize');
require('dotenv').config();
const path = require('path');

// Determine DB dialect from environment
const dialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || path.join(__dirname, '..', process.env.DB_STORAGE),
    logging: false, // Disable logging; set to console.log to see SQL queries
  });
} else if (dialect === 'postgres') {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      port: process.env.DB_PORT || 5432,
      logging: false,
    }
  );
} else if (dialect === 'mysql') {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      port: process.env.DB_PORT || 3306,
      logging: false,
    }
  );
} else {
  throw new Error(`Unsupported DB dialect: ${dialect}`);
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`${dialect.toUpperCase()} connected...`);
    // Optionally sync models here or in app.js
  } catch (error) {
    console.error(`Unable to connect to the ${dialect.toUpperCase()} database:`, error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

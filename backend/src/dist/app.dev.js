"use strict";

// backend/src/app.js
var express = require('express');

var cors = require('cors');

var _require = require('../config/db'),
    connectDB = _require.connectDB,
    sequelize = _require.sequelize;

var authRoutes = require('./routes/auth');

var userRoutes = require('./routes/userRoutes');

var projectRoutes = require('./routes/projectRoutes');

var sourceRoutes = require('./routes/sourceRoutes');

var adminRoutes = require('./routes/adminRoutes');

var logger = require('./utils/logger');

var morgan = require('morgan'); // Import all model files


var AppLog = require('./models/AppLog');

var Project = require('./models/Project');

var User = require('./models/User');

var UserRole = require('./models/UserRole'); // data structure


var DataStructureAttributeGroup = require('./models/DataStructureAttributeGroup');

var DataStructureAttribute = require('./models/DataStructureAttribute'); // data structure associations


var DataStructureAttributeGroupAssociation = require('./models/DataStructureAttributeGroupAssociation');

var DataStructureAttributeAssociation = require('./models/DataStructureAttributeAssociation'); // data profile


var DataProfileAttributeGroupStat = require('./models/DataProfileAttributeGroupStat');

var DataProfileAttributeStat = require('./models/DataProfileAttributeStat'); // project to data structure association


var ProjectDataStructureAttributeGroupAssociation = require('./models/ProjectDataStructureAttributeGroupAssociation');

var ProjectDataStructureAttributeAssociation = require('./models/ProjectDataStructureAttributeAssociation');

var DataStructureAttributeGroupInstanceProfile = require('./models/DataStructureAttributeGroupInstanceProfile');

var DataAccessMechanismCharacteristic = require('./models/DataAccessMechanismCharacteristic');

var DataAccessMechanism = require('./models/DataAccessMechanism');

require('dotenv').config();

var app = express(); // Middleware

app.use(cors());
PORT = process.env.PORT || 5000;
app.use(express.json()); // HTTP request logging using morgan and winston

app.use(morgan('combined', {
  stream: {
    write: function write(message) {
      return logger.info(message.trim());
    }
  }
})); // Routes

app.use(function (req, res, next) {
  console.log('1. Request received in app.js');
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', function (req, res, next) {
  console.log('2. Request reaching /api/projects in app.js');
  next();
}, projectRoutes);
app.use('/api/sources', function (req, res, next) {
  console.log('2. Request reaching /api/sources in app.js');
  next();
}, sourceRoutes);
app.use('*', function (req, res) {
  console.log('Unmatched route:', req.originalUrl);
  res.status(404).send('Route not found');
}); // // Error Handling Middleware
// app.use((err, req, res, next) => {
//   logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
//   res.status(err.status || 500).json({ message: err.message });
// });
// Initialize models

var models = [// DataStructureAttributeGroup,
// DataStructureAttribute,
// DataStructureAttributeGroupAssociation,
// DataStructureAttributeAssociation,
// DataProfileAttributeGroupStat,
// DataProfileAttributeStat,
// ProjectDataStructureAttributeGroupAssociation,
// ProjectDataStructureAttributeAssociation,
// AppLog,
// Project,
// User,
// UserRole,
DataStructureAttributeGroupInstanceProfile, DataAccessMechanism, DataAccessMechanismCharacteristic]; // Proceed to set up associations if any

models.forEach(function (model) {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});
var overrideSchema = false; // Sync and start server

sequelize.sync({
  force: overrideSchema
}).then(function () {
  console.log("All database tables created successfully!");
  app.listen(PORT, function () {
    logger.info("Backend server running on port ".concat(PORT));
  });
})["catch"](function (error) {
  console.error('Error creating database tables:', error);
});
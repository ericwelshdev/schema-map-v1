// backend/src/app.js

const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('../config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const resourceAttributeRoutes = require('./routes/resourceAttributeRoutes');
const resourceGroupAssociationRoutes = require('./routes/resourceGroupAssociationRoutes');
const resourceAttributeAssociationRoutes = require('./routes/resourceAttributeAssociationRoutes');
const resourceProfileRoutes = require('./routes/resourceProfileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const logger = require('./utils/logger');
const morgan = require('morgan');

// Import all model files
const AppLog = require('./models/AppLog');
const Project = require('./models/Project');

const User = require('./models/User');

const UserRole = require('./models/UserRole');

// data structure
const DataStructureAttributeGroup = require('./models/DataStructureAttributeGroup');
const DataStructureAttribute = require('./models/DataStructureAttribute');

// data structure associations
const DataStructureAttributeGroupAssociation = require('./models/DataStructureAttributeGroupAssociation');
const DataStructureAttributeAssociation = require('./models/DataStructureAttributeAssociation');

// data profile
const DataProfileAttributeGroupStat = require('./models/DataProfileAttributeGroupStat');
const DataProfileAttributeStat = require('./models/DataProfileAttributeStat');
// project to data structure association
const ProjectDataStructureAttributeGroupAssociation = require('./models/ProjectDataStructureAttributeGroupAssociation');
const ProjectDataStructureAttributeAssociation = require('./models/ProjectDataStructureAttributeAssociation');

const DataStructureAttributeGroupInstanceProfile = require('./models/DataStructureAttributeGroupInstanceProfile');
const DataAccessMechanismCharacteristic = require('./models/DataAccessMechanismCharacteristic');
const DataAccessMechanism = require('./models/DataAccessMechanism');


require('dotenv').config();

const app = express();

// Middleware

app.use(cors());
PORT = process.env.PORT || 5000;
app.use(express.json());

// HTTP request logging using morgan and winston
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Routes
app.use((req, res, next) => {
  console.log('1. Request received in app.js');
  next();
});

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/projects', (req, res, next) => {
  console.log('2. Request reaching /api/projects in app.js');
  next();
}, projectRoutes);

app.use('/api/resources', (req, res, next) => {
  console.log('2. Request reaching /api/resources in app.js');
  next();
}, resourceRoutes);

app.use('/api/resource-attributes', (req, res, next) => {
  console.log('2. Request reaching /api/resource-attributes in app.js');
  next();
}, resourceAttributeRoutes);

app.use('/api/resource-associations', (req, res, next) => {
  console.log('2. Request reaching /api/resource-associations in app.js');
  next();
}, resourceGroupAssociationRoutes);

app.use('/api/resource-attribute-associations', (req, res, next) => {
  console.log('2. Request reaching /api/resource-attribute-associations in app.js');
  next();
}, resourceAttributeAssociationRoutes);

app.use('/api/resource-attribute-associations/bulk', (req, res, next) => {
  console.log('2. Request reaching /api/resource-attribute-associations/bulk in app.js');
  next();
}, resourceAttributeAssociationRoutes);

app.use('/api/resource-attributes/bulk', (req, res, next) => {
  console.log('2. Request reaching /api/resource-attributes/bulk in app.js');
  next();
}, resourceAttributeRoutes);

app.use('/api/resource-profiles', (req, res, next) => {
  console.log('2. Request reaching /api/resource-profiles in app.js');
  next();
}, resourceProfileRoutes);

app.use('*', (req, res) => {
  console.log('Unmatched route:', req.originalUrl);
  res.status(404).send('Route not found');
});


// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
//   res.status(err.status || 500).json({ message: err.message });
// });

// Initialize models
const models = [
  // DataStructureAttributeGroup,
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

  // DataStructureAttributeGroupInstanceProfile,
  // DataAccessMechanism,
  // DataAccessMechanismCharacteristic

];

// Proceed to set up associations if any
models.forEach(model => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

const overrideSchema = false
// Sync and start server
sequelize.sync({ force: overrideSchema })
  .then(() => {
    console.log("All database tables created successfully!");
    app.listen(PORT, () => {
      logger.info(`Backend server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error creating database tables:', error);
  });








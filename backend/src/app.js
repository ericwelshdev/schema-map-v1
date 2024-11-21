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
const aiRoutes = require('./routes/aiRoutes');
const aiAuthRoutes = require('./routes/aiAuth');
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
// const cors = require('cors');

// Add CORS configuration before routes
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.use(cors());
PORT = process.env.PORT || 5000;
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

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

app.use('/api/resources/bulk', (req, res, next) => {
  console.log('2. Request reaching /api/resources/bulk in app.js');
  next();
}, resourceRoutes);

app.use('/api/resource-attributes', (req, res, next) => {
  console.log('2. Request reaching /api/resource-attributes in app.js');
  next();
}, resourceAttributeRoutes);

app.use('/api/resource-attributes/group/:groupId', (req, res, next) => {
  console.log('Request reaching /api/resource-attributes/group/:groupId in app.js');
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

app.use('/api/resource-attribute-associations/group/:groupId', (req, res, next) => {
  console.log('Request reaching /api/resource-attribute-associations/group/:groupId in app.js');
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


app.use('/api/ai', (req, res, next) => {
  console.log('2. Request reaching /api/ai in app.js');
  console.log('AI route hit:', {
      method: req.method,
      path: req.path,
      body: req.body
  });
  next();
}, aiRoutes);


// app.use('/api/ai', (req, res, next) => {
//   console.log('2. Request reaching /api/ai in app.js');
//   console.log('AI Route Debug:', {
//     timestamp: new Date().toISOString(),
//     method: req.method,
//     path: req.path,
//     body: req.body,
//     headers: req.headers
//   })
//   next();
// }, aiRoutes);

// ;


// Move the catch-all route to the end
app.use('*', (req, res) => {
  console.log('Unmatched route:', req.originalUrl);
  res.status(404).send('Route not found');
});

// 
// app.use('/api/ai/suggest-mappings', (req, res, next) => {
//   console.log('2. Request reaching /api/ai/suggest-mappings in app.js');
//   next();
// }, aiTrainingRoutes);



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


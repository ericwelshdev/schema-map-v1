const express = require('express');
const router = express.Router();
const resourceAttributeAssociationController = require('../controllers/resourceAttributeAssociationController');

router.use((req, res, next) => {
    console.log('3. Request entered resourceAttributeAssociationRoutes');
    next();
  });

  
// Create a new resource
router.post('/', resourceAttributeAssociationController.create);

// bulk inserts for all rows 
router.post('/bulk', resourceAttributeAssociationController.bulkCreate);

// Get all resourceProfileController
router.get('/', (req, res, next) => {
    console.log('4. GET request received in resourceAttributeAssociationRoutes');
    next();
  }, resourceAttributeAssociationController.getAll);
  

// Get a resource by id
router.get('/:id', resourceAttributeAssociationController.getById);

// Update a resource by id
router.put('/:id', resourceAttributeAssociationController.update);

// Delete a resource by id
router.delete('/:id', resourceAttributeAssociationController.delete);

module.exports = router;
const express = require('express');
const router = express.Router();
const resourceGroupAssociationController = require('../controllers/resourceGroupAssociationController');

router.use((req, res, next) => {
    console.log('3. Request entered resourceGroupAssociationRoutes');
    next();
  });

  
// Create a new resource
router.post('/', resourceGroupAssociationController.create);

// bulk inserts for all rows 
router.post('/bulk', resourceGroupAssociationController.bulkCreate);

// Get all resourceProfileController
router.get('/', (req, res, next) => {
    console.log('4. GET request received in resourceGroupAssociationRoutes');
    next();
  }, resourceGroupAssociationController.getAll);
  

// Get a resource by id
router.get('/:id', resourceGroupAssociationController.getById);

// Update a resource by id
router.put('/:id', resourceGroupAssociationController.update);

// Delete a resource by id
router.delete('/:id', resourceGroupAssociationController.delete);

module.exports = router;
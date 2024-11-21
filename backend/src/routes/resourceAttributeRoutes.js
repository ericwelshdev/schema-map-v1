const express = require('express');
const router = express.Router();
const resourceAttributeController = require('../controllers/resourceAttributeController');

router.use((req, res, next) => {
    console.log('3. Request entered resourceAttributeController');
    next();
  });

  
// Create a new sourceAttribute
router.post('/', resourceAttributeController.create);

// bulk inserts for all rows 
router.post('/bulk', resourceAttributeController.bulkCreate);

// Get all sourceAttribute
router.get('/', (req, res, next) => {
    console.log('4. GET request received in resourceAttributeController');
    next();
  }, resourceAttributeController.getAll);
  

// Get a sourceAttribute by id
router.get('/:id', resourceAttributeController.getById);

// Update a sourceAttribute by id
router.put('/:id', resourceAttributeController.update);

// Delete a sourceAttribute by id
router.delete('/:id', resourceAttributeController.delete);

// Add this route with existing routes
router.get('/group/:id', resourceAttributeController.getByGroupId);


module.exports = router;
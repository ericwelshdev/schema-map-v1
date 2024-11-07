const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

router.use((req, res, next) => {
    console.log('3. Request entered resourceController');
    next();
  });

  
// Create a new resource
router.post('/', resourceController.create);

// bulk inserts for all rows 
router.post('/bulk', resourceController.bulkCreate);

// Get all resources
router.get('/', (req, res, next) => {
    console.log('4. GET request received in resourceController');
    next();
  }, resourceController.getAll);
  

// Get a resource by id
router.get('/:id', resourceController.getById);

// Update a resource by id
router.put('/:id', resourceController.update);

// Delete a resource by id
router.delete('/:id', resourceController.delete);

module.exports = router;
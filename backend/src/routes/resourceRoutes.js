const express = require('express');
const router = express.Router();
const sourceController = require('../controllers/sourceController');

router.use((req, res, next) => {
    console.log('3. Request entered sourceRoutes.js');
    next();
  });

  
// Create a new Source
router.post('/', sourceController.create);

// Get all Source
router.get('/', (req, res, next) => {
    console.log('4. GET request received in sourceRoutes');
    next();
  }, sourceController.getAll);
  

// Get a Source by id
router.get('/:id', sourceController.getById);

// Update a Source by id
router.put('/:id', sourceController.update);

// Delete a Source by id
router.delete('/:id', sourceController.delete);

module.exports = router;
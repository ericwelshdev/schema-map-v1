const express = require('express');
const router = express.Router();
const dataDictionarySourceController = require('../controllers/dataDictionarySourceController');

router.use((req, res, next) => {
    console.log('3. Request entered dataDictionarySourceController');
    next();
  });

  
// Create a new dataDictionarySource
router.post('/', dataDictionarySourceController.create);

// Get all dataDictionarySource
router.get('/', (req, res, next) => {
    console.log('4. GET request received in dataDictionarySourceController');
    next();
  }, dataDictionarySourceController.getAll);
  

// Get a dataDictionarySource by id
router.get('/:id', dataDictionarySourceController.getById);

// Update a dataDictionarySource by id
router.put('/:id', dataDictionarySourceController.update);

// Delete a dataDictionarySource by id
router.delete('/:id', dataDictionarySourceController.delete);

module.exports = router;
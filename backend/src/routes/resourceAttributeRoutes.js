const express = require('express');
const router = express.Router();
const sourceAttributeController = require('../controllers/sourceAttributeController');

router.use((req, res, next) => {
    console.log('3. Request entered sourceAttributeRoutes');
    next();
  });

  
// Create a new sourceAttribute
router.post('/', sourceAttributeController.create);

// bulk inserts for all rows 
router.post('/bulk', sourceAttributeController.bulkCreate);

// Get all sourceAttribute
router.get('/', (req, res, next) => {
    console.log('4. GET request received in sourceAttributeRoutes');
    next();
  }, sourceAttributeController.getAll);
  

// Get a sourceAttribute by id
router.get('/:id', sourceAttributeController.getById);

// Update a sourceAttribute by id
router.put('/:id', sourceAttributeController.update);

// Delete a sourceAttribute by id
router.delete('/:id', sourceAttributeController.delete);


module.exports = router;



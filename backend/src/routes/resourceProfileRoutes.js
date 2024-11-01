const express = require('express');
const router = express.Router();
const resourceProfileController = require('../controllers/resourceProfileController');

router.use((req, res, next) => {
    console.log('3. Request entered resourceProfileController');
    next();
  });

  
// Create a new resourceProfileController
router.post('/', resourceProfileController.create);

// bulk inserts for all rows 
router.post('/bulk', resourceProfileController.bulkCreate);

// Get all resourceProfileController
router.get('/', (req, res, next) => {
    console.log('4. GET request received in resourceProfileController');
    next();
  }, resourceProfileController.getAll);
  

// Get a resourceProfileController by id
router.get('/:id', resourceProfileController.getById);

// Update a resourceProfileController by id
router.put('/:id', resourceProfileController.update);

// Delete a resourceProfileController by id
router.delete('/:id', resourceProfileController.delete);


module.exports = router;
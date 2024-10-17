const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.use((req, res, next) => {
    console.log('3. Request entered projectRoutes.js');
    next();
  });

  
// Create a new Project
router.post('/', projectController.create);

// Get all Project
router.get('/', (req, res, next) => {
    console.log('4. GET request received in projectRoutes');
    next();
  }, projectController.getAll);
  

// Get a Project by id
router.get('/:id', projectController.getById);

// Update a Project by id
router.put('/:id', projectController.update);

// Delete a Project by id
router.delete('/:id', projectController.delete);

module.exports = router;
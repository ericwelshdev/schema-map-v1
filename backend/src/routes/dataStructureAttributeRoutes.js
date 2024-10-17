const express = require('express');
const router = express.Router();
const dataStructureAttributeController = require('../controllers/dataStructureAttributeController');

// Create
router.post('/', dataStructureAttributeController.create);

// Get All
router.get('/', dataStructureAttributeController.getAll);

// Get by ID
router.get('/:dsstrc_attr_id', dataStructureAttributeController.getById);

// Update
router.put('/:dsstrc_attr_id', dataStructureAttributeController.update);

// Delete
router.delete('/:dsstrc_attr_id', dataStructureAttributeController.delete);

module.exports = router;

const express = require('express');
const router = express.Router();
const associationController = require('../controllers/projectDataStructureAttributeAssociationController');

// Create a new project-data structure attribute association
router.post('/', associationController.create);

// Get all associations
router.get('/', associationController.getAll);

// Get an association by project ID, source data structure ID, and source data structure attribute ID
router.get('/:proj_id/:src_ds_id/:src_data_strc_def_attr_id', associationController.getById);

// Update an association by project ID and source data structure ID
router.put('/:proj_id/:src_ds_id/:src_data_strc_def_attr_id', associationController.update);

// Delete an association by project ID, source data structure ID, and source data structure attribute ID
router.delete('/:proj_id/:src_ds_id/:src_data_strc_def_attr_id', associationController.delete);

module.exports = router;

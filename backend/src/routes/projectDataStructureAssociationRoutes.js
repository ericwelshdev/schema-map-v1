const express = require('express');
const router = express.Router();
const associationController = require('../controllers/projectDataStructureAssociationController');

// Create a new project-data structure association
router.post('/', associationController.create);

// Get all associations
router.get('/', associationController.getAll);

// Get an association by project ID and data structure group ID
router.get('/:proj_id/:data_strc_attr_grp_id', associationController.getById);

// Update an association by project ID and data structure group ID
router.put('/:proj_id/:data_strc_attr_grp_id', associationController.update);

// Delete an association by project ID and data structure group ID
router.delete('/:proj_id/:data_strc_attr_grp_id', associationController.delete);

module.exports = router;

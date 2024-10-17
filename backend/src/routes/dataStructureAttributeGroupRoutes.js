const express = require('express');
const router = express.Router();
const dataStructureAttributeGroupController = require('../controllers/dataStructureAttributeGroupController');

// Create
router.post('/', dataStructureAttributeGroupController.create);

// Get All
router.get('/', dataStructureAttributeGroupController.getAll);

// Get by Primary Key
router.get('/:ds_id/:stdiz_abrvd_attr_grp_nm', dataStructureAttributeGroupController.getById);

// Update
router.put('/:ds_id/:stdiz_abrvd_attr_grp_nm', dataStructureAttributeGroupController.update);

// Delete
router.delete('/:ds_id/:stdiz_abrvd_attr_grp_nm', dataStructureAttributeGroupController.delete);

module.exports = router;

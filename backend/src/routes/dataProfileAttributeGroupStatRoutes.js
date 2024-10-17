const express = require('express');
const router = express.Router();
const dataProfileAttributeGroupStatController = require('../controllers/dataProfileAttributeGroupStatController');

// Create
router.post('/', dataProfileAttributeGroupStatController.create);

// Get All
router.get('/', dataProfileAttributeGroupStatController.getAll);

// Get by composite key (ds_id, proj_id, data_strc_attr_grp_id, stdiz_abrvd_attr_nm)
router.get('/:ds_id/:proj_id/:data_strc_attr_grp_id/:stdiz_abrvd_attr_nm', dataProfileAttributeGroupStatController.getById);

// Update
router.put('/:ds_id/:proj_id/:data_strc_attr_grp_id/:stdiz_abrvd_attr_nm', dataProfileAttributeGroupStatController.update);

// Delete
router.delete('/:ds_id/:proj_id/:data_strc_attr_grp_id/:stdiz_abrvd_attr_nm', dataProfileAttributeGroupStatController.delete);

module.exports = router;

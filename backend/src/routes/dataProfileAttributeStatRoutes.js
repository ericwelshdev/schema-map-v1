const express = require('express');
const router = express.Router();
const dataProfileAttributeStatController = require('../controllers/dataProfileAttributeStatController');

// Create
router.post('/', dataProfileAttributeStatController.create);

// Get All
router.get('/', dataProfileAttributeStatController.getAll);

// Get by composite key (ds_id, proj_id, data_strc_attr_id, stdiz_abrvd_attr_nm)
router.get('/:ds_id/:proj_id/:data_strc_attr_id/:stdiz_abrvd_attr_nm', dataProfileAttributeStatController.getById);

// Update
router.put('/:ds_id/:proj_id/:data_str

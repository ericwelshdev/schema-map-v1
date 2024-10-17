"use strict";

var express = require('express');

var router = express.Router();

var dataStructureAttributeGroupInstanceProfileController = require('../controllers/dataStructureAttributeGroupInstanceProfileController'); // Get all profiles


router.get('/', dataStructureAttributeGroupInstanceProfileController.getAllProfiles); // Get a single profile by id

router.get('/:id', dataStructureAttributeGroupInstanceProfileController.getProfileById); // Create a new profile

router.post('/', dataStructureAttributeGroupInstanceProfileController.createProfile); // Update a profile

router.put('/:id', dataStructureAttributeGroupInstanceProfileController.updateProfile); // Delete a profile

router["delete"]('/:id', dataStructureAttributeGroupInstanceProfileController.deleteProfile);
module.exports = router;
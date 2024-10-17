const express = require('express');
const router = express.Router();
const userRoleAssociationController = require('../controllers/userRoleAssociationController');

// Create a new UserRoleAssociation
router.post('/', userRoleAssociationController.create);

// Get all UserRoleAssociations
router.get('/', userRoleAssociationController.getAll);

// Get a UserRoleAssociation by usr_role_id and usr_id
router.get('/:usr_role_id/:usr_id', userRoleAssociationController.getById);

// Update a UserRoleAssociation by usr_role_id and usr_id
router.put('/:usr_role_id/:usr_id', userRoleAssociationController.update);

// Delete a UserRoleAssociation by usr_role_id and usr_id
router.delete('/:usr_role_id/:usr_id', userRoleAssociationController.delete);

module.exports = router;

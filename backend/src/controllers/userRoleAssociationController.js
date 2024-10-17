const UserRoleAssociation = require('../models/UserRoleAssociation');

// Create a new UserRoleAssociation
exports.create = async (req, res) => {
    try {
        const userRoleAssociation = await UserRoleAssociation.create(req.body);
        res.status(201).json(userRoleAssociation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all UserRoleAssociations
exports.getAll = async (req, res) => {
    try {
        const userRoleAssociations = await UserRoleAssociation.findAll();
        res.status(200).json(userRoleAssociations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a UserRoleAssociation by usr_role_id and usr_id
exports.getById = async (req, res) => {
    const { usr_role_id, usr_id } = req.params;
    try {
        const userRoleAssociation = await UserRoleAssociation.findOne({
            where: { usr_role_id, usr_id }
        });
        if (!userRoleAssociation) {
            return res.status(404).json({ error: 'UserRoleAssociation not found' });
        }
        res.status(200).json(userRoleAssociation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a UserRoleAssociation
exports.update = async (req, res) => {
    const { usr_role_id, usr_id } = req.params;
    try {
        const userRoleAssociation = await UserRoleAssociation.findOne({
            where: { usr_role_id, usr_id }
        });
        if (!userRoleAssociation) {
            return res.status(404).json({ error: 'UserRoleAssociation not found' });
        }
        await userRoleAssociation.update(req.body);
        res.status(200).json(userRoleAssociation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a UserRoleAssociation
exports.delete = async (req, res) => {
    const { usr_role_id, usr_id } = req.params;
    try {
        const userRoleAssociation = await UserRoleAssociation.findOne({
            where: { usr_role_id, usr_id }
        });
        if (!userRoleAssociation) {
            return res.status(404).json({ error: 'UserRoleAssociation not found' });
        }
        await userRoleAssociation.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

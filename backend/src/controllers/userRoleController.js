const UserRole = require('../models/UserRole');

// Create a new UserRole
exports.create = async (req, res) => {
    try {
        const userRole = await UserRole.create(req.body);
        res.status(201).json(userRole);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all UserRoles
exports.getAll = async (req, res) => {
    try {
        const userRoles = await UserRole.findAll();
        res.status(200).json(userRoles);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a UserRole by id
exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const userRole = await UserRole.findByPk(id);
        if (!userRole) {
            return res.status(404).json({ error: 'UserRole not found' });
        }
        res.status(200).json(userRole);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a UserRole
exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        const userRole = await UserRole.findByPk(id);
        if (!userRole) {
            return res.status(404).json({ error: 'UserRole not found' });
        }
        await userRole.update(req.body);
        res.status(200).json(userRole);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a UserRole
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const userRole = await UserRole.findByPk(id);
        if (!userRole) {
            return res.status(404).json({ error: 'UserRole not found' });
        }
        await userRole.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

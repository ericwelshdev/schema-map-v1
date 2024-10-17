const DataStructureAttribute = require('../models/DataStructureAttribute');

// Create a new DataStructureAttribute
exports.create = async (req, res) => {
    try {
        const data = await DataStructureAttribute.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all DataStructureAttributes
exports.getAll = async (req, res) => {
    try {
        const data = await DataStructureAttribute.findAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a DataStructureAttribute by ID
exports.getById = async (req, res) => {
    const { dsstrc_attr_id } = req.params;
    try {
        const data = await DataStructureAttribute.findOne({ where: { dsstrc_attr_id } });
        if (!data) {
            return res.status(404).json({ error: 'DataStructureAttribute not found' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a DataStructureAttribute
exports.update = async (req, res) => {
    const { dsstrc_attr_id } = req.params;
    try {
        const data = await DataStructureAttribute.findOne({ where: { dsstrc_attr_id } });
        if (!data) {
            return res.status(404).json({ error: 'DataStructureAttribute not found' });
        }
        await data.update(req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a DataStructureAttribute
exports.delete = async (req, res) => {
    const { dsstrc_attr_id } = req.params;
    try {
        const data = await DataStructureAttribute.findOne({ where: { dsstrc_attr_id } });
        if (!data) {
            return res.status(404).json({ error: 'DataStructureAttribute not found' });
        }
        await data.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

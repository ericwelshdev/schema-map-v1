const { Op } = require('sequelize');
const Source = require('../models/DataStructureAttribute');

// Create a new resource attributes
exports.create = async (req, res) => {
    try {
        const resource = await Source.create(req.body);
        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create a new resource attributes in bulk
exports.bulkCreate = async (req, res) => {
    try {
        // console.log('Received data for bulk create:', req.body);
        
        // ensure we have an array of attributes to create
        if (!Array.isArray(req.body)) {
            throw new Error('Expected an array of attributes');
        }

        const resources = await Source.bulkCreate(req.body, {
            returning: true
        });
        
        res.status(201).json(resources);
    } catch (error) {
        console.error('Bulk create error:', error);
        res.status(400).json({ error: error.message });
    }
};


  
// Get all resources attributes
exports.getAll = async (req, res) => {
    try {
        console.log('Executing SQL query:', Source.findAll().toString());
        const resources = await Source.findAll({
            where: {
                dsstrc_attr_grp_src_typ_cd: 'Source'
            }
        });
        console.log('7. SQL query result:', resources.toString());
        res.status(200).json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(400).json({ error: error.message });
    }
};
// Get resource attributes by ID
exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await Source.findByPk(id);
        if (!resource) {
            return res.status(404).json({ error: 'Source not found' });
        }
        res.status(200).json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a resource attributes
exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await Source.findByPk(id);
        if (!resource) {
            return res.status(404).json({ error: 'Source not found' });
        }
        await resource.update(req.body);
        res.status(200).json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a resource attributes
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await Source.findByPk(id);
        if (!resource) {
            return res.status(404).json({ error: 'Source not found' });
        }
        await resource.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

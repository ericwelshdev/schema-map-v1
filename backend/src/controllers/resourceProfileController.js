const { Op } = require('sequelize');
const resourceGroupProfile = require('../models/DataStructureAttributeGroupInstanceProfile');

// Create a new resourceGroupProfile
exports.create = async (req, res) => {
    try {
        const resource = await resourceGroupProfile.create({
            ...req.body,
            cre_ts: new Date(),
            updt_ts: new Date()
        }, {
            attributes: ['*'],
            returning: true
        });
        
        res.status(201).json(resource);
    } catch (error) {
        console.error('Create error:', error);
        res.status(400).json({ message: error.message });
    }
};

// bulk inserts for all rows
exports.bulkCreate = async (req, res) => {
    try {
        const resources = await resourceGroupProfile.bulkCreate(req.body);
        res.status(201).json(resources);
    } catch (error) {
        console.error('Bulk create error:', error);
        res.status(400).json({ message: error.message });
    }
};

// Rest of your existing controller methods
  
// Get all resourceGroupProfile
exports.getAll = async (req, res) => {
    try {
        console.log('Executing SQL query:', resourceGroupProfile.findAll().toString());
        const resources = await Source.findAll({
            where: {
                dsstrc_attr_grp_src_typ_cd: 'Source'
            }
        });
        console.log('7. SQL query result:', resources.toString());
        res.status(200).json(sources);
    } catch (error) {
        console.error('Error fetching resource Group Profile:', error);
        res.status(400).json({ error: error.message });
    }
};
// Get resourceGroupProfile by ID
exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await resourceGroupProfile.findByPk(id);
        if (!resource) {
            return res.status(404).json({ error: 'resource Group Profile not found' });
        }
        res.status(200).json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a resourceGroupProfile
exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await resourceGroupProfile.findByPk(id);
        if (!resource) {
            return res.status(404).json({ error: 'resource Group Profile not found' });
        }
        await resource.update(req.body);
        res.status(200).json(resource);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a resourceGroupProfile
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await resourceGroupProfile.findByPk(id);
        if (!resource) {
            return res.status(404).json({ error: 'resource Group Profile not found' });
        }
        await resource.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

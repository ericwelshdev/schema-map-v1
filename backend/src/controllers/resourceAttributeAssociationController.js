const { Op } = require('sequelize');
const SourceData = require('../models/DataStructureAttributeAssociation');

// Create a new resource attribute
exports.create = async (req, res) => {
    try {
        const resource = await SourceData.create({
            ...req.body,
            cre_ts: new Date(),
            updt_ts: new Date()
        });
        res.status(201).json(resource);
    } catch (error) {
        console.error('Create error:', error);
        res.status(400).json({
            error: {
                name: error.name,
                message: error.message,
                details: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message,
                    value: e.value
                })),
                sql: error.parent?.sql,
                code: error.parent?.code
            }
        });
    }
};

// Create new resource attributes in bulk
exports.bulkCreate = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            throw new Error('Expected an array of attributes');
        }

        const resources = await SourceData.bulkCreate(req.body, {
            returning: true
        });
        
        res.status(201).json(resources);
    } catch (error) {
        console.error('Bulk create error:', error);
        res.status(400).json({
            error: {
                name: error.name,
                message: error.message,
                details: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message,
                    value: e.value
                })),
                sql: error.parent?.sql,
                code: error.parent?.code
            }
        });
    }
};

// Fetch all resource attributes
exports.getAll = async (req, res) => {
    try {
        const resources = await SourceData.findAll();
        res.status(200).json(resources);
    } catch (error) {
        console.error('Fetch all error:', error);
        res.status(400).json({
            error: {
                name: error.name,
                message: error.message,
                details: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message
                }))
            }
        });
    }
};

// Fetch a specific resource attribute by ID
exports.getById = async (req, res) => {
    try {
        const resource = await SourceData.findByPk(req.params.id);
        if (!resource) {
            return res.status(404).json({ error: { message: 'Resource not found' } });
        }
        res.status(200).json(resource);
    } catch (error) {
        console.error('Fetch by ID error:', error);
        res.status(400).json({
            error: {
                name: error.name,
                message: error.message,
                details: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message
                }))
            }
        });
    }
};

// Update an existing resource attribute
exports.update = async (req, res) => {
    try {
        const resource = await SourceData.findByPk(req.params.id);
        if (!resource) {
            return res.status(404).json({ error: { message: 'Resource not found' } });
        }
        await resource.update(req.body);
        res.status(200).json(resource);
    } catch (error) {
        console.error('Update error:', error);
        res.status(400).json({
            error: {
                name: error.name,
                message: error.message,
                details: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message,
                    value: e.value
                })),
                sql: error.parent?.sql,
                code: error.parent?.code
            }
        });
    }
};

// Delete a resource attribute by ID
exports.delete = async (req, res) => {
    try {
        const resource = await SourceData.findByPk(req.params.id);
        if (!resource) {
            return res.status(404).json({ error: { message: 'Resource not found' } });
        }
        await resource.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Delete error:', error);
        res.status(400).json({
            error: {
                name: error.name,
                message: error.message,
                details: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message
                }))
            }
        });
    }
};

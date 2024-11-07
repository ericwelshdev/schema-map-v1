const { Op } = require('sequelize');
const resourceGroup = require('../models/DataStructureAttributeGroup');

// Create a new resourceGroup
exports.create = async (req, res) => {
    try {
        const resource = await resourceGroup.create({
            ...req.body,
            cre_ts: new Date(),
            updt_ts: new Date()
        }, {
            attributes: ['*'],
            returning: true
        });
        
        res.status(201).json(resource);
    } catch (error) {
        const errorResponse = {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                errors: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message,
                    value: e.value
                })),
                sql: error.parent?.sql,
                code: error.parent?.code
            }
        };
        console.log('Error details:', errorResponse);
        res.status(400).json(errorResponse);
    }
};
  

// bulk inserts for all rows
exports.bulkCreate = async (req, res) => {
    try {
        // console.log('Received request body:', req.body);
        if (!req.body || !Array.isArray(req.body)) {
            throw new Error('Invalid request format - expected array of groups');
        }
        const resources = await resourceGroup.bulkCreate(req.body);
        res.status(201).json(resources);
    } catch (error) {
        const errorResponse = {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                errors: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message,
                    value: e.value
                })),
                sql: error.parent?.sql,
                code: error.parent?.code
            }
        };
        console.log('Error details:', errorResponse);
        res.status(400).json(errorResponse);
    }
};
  
// Get all resourceGroups
exports.getAll = async (req, res) => {
    try {
        // console.log('Executing SQL query:', resourceGroup.findAll().toString());
        const resources = await resourceGroup.findAll();
        console.log('7. SQL query result:', resources.toString());
        res.status(200).json(resources);
    } catch (error) {
        const errorResponse = {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                errors: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message,
                    value: e.value
                })),
                sql: error.parent?.sql,
                code: error.parent?.code
            }
        };
        console.log('Error details:', errorResponse);
        res.status(400).json(errorResponse);
    }
};


// Get resource by ID
exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await resourceGroup.findByPk(id);
        if (!resource) {
            return res.status(404).json({ error: 'resourceGroup not found' });
        }
        res.status(200).json(resource);
    } catch (error) {
        const errorResponse = {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                errors: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message,
                    value: e.value
                })),
                sql: error.parent?.sql,
                code: error.parent?.code
            }
        };
        console.log('Error details:', errorResponse);
        res.status(400).json(errorResponse);
    }
};

// Update a resource
exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await resourceGroup.findByPk(id);
        if (!resource) {
            return res.status(404).json({ error: 'resourceGroup not found' });
        }
        await resource.update(req.body);
        res.status(200).json(resource);
    } catch (error) {
        const errorResponse = {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                errors: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message,
                    value: e.value
                })),
                sql: error.parent?.sql,
                code: error.parent?.code
            }
        };
        console.log('Error details:', errorResponse);
        res.status(400).json(errorResponse);
    }
};

// Delete a resource
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await resourceGroup.findByPk(id);
        if (!resource) {
            return res.status(404).json({ error: 'resourceGroup not found' });
        }
        await resource.destroy();
        res.status(204).send();
    } catch (error) {
        const errorResponse = {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                errors: error.errors?.map(e => ({
                    field: e.path,
                    type: e.type,
                    message: e.message,
                    value: e.value
                })),
                sql: error.parent?.sql,
                code: error.parent?.code
            }
        };
        console.log('Error details:', errorResponse);
        res.status(400).json(errorResponse);
    }
};

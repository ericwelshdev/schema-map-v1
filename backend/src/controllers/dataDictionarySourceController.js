const { Op } = require('sequelize');
const dataDictionarySource = require('../models/DataStructureAttributeGroup');

// Create a new source
exports.create = async (req, res) => {
    try {
        const source = await dataDictionarySource.create({
            ...req.body,
            cre_ts: new Date(),
            updt_ts: new Date()
        }, {
            attributes: ['*'],
            returning: true
        });
        
        res.status(201).json(source);
    } catch (error) {
        console.error('Create error:', error);
        res.status(400).json({ message: error.message });
    }
};
  
// Get all sources
exports.getAll = async (req, res) => {
    try {
        console.log('Executing SQL query:', dataDictionarySource.findAll().toString());
        const sources = await dataDictionarySource.findAll({
            where: {
                dsstrc_attr_grp_src_typ_cd: 'Data Dictionary'
            }
        });
        console.log('7. SQL query result:', sources.toString());
        res.status(200).json(sources);
    } catch (error) {
        console.error('Error fetching sources:', error);
        res.status(400).json({ error: error.message });
    }
};
// Get source by ID
exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const source = await dataDictionarySource.findByPk(id);
        if (!source) {
            return res.status(404).json({ error: 'dataDictionarySource not found' });
        }
        res.status(200).json(source);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a source
exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        const source = await dataDictionarySource.findByPk(id);
        if (!source) {
            return res.status(404).json({ error: 'dataDictionarySource not found' });
        }
        await source.update(req.body);
        res.status(200).json(source);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a source
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const source = await dataDictionarySource.findByPk(id);
        if (!source) {
            return res.status(404).json({ error: 'dataDictionarySource not found' });
        }
        await source.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

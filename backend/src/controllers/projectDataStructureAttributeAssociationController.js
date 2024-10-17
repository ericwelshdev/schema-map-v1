const ProjectDataStructureAttributeAssociation = require('../models/ProjectDataStructureAttributeAssociation');

// Create a new project-data structure attribute association
exports.create = async (req, res) => {
    try {
        const assoc = await ProjectDataStructureAttributeAssociation.create(req.body);
        res.status(201).json(assoc);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all associations
exports.getAll = async (req, res) => {
    try {
        const associations = await ProjectDataStructureAttributeAssociation.findAll();
        res.status(200).json(associations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get an association by project ID, source data structure ID, and source data structure attribute ID
exports.getById = async (req, res) => {
    const { proj_id, src_ds_id, src_data_strc_def_attr_id } = req.params;
    try {
        const association = await ProjectDataStructureAttributeAssociation.findOne({
            where: { proj_id, src_ds_id, src_data_strc_def_attr_id }
        });
        if (!association) {
            return res.status(404).json({ error: 'Association not found' });
        }
        res.status(200).json(association);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an association
exports.update = async (req, res) => {
    const { proj_id, src_ds_id, src_data_strc_def_attr_id } = req.params;
    try {
        const association = await ProjectDataStructureAttributeAssociation.findOne({
            where: { proj_id, src_ds_id, src_data_strc_def_attr_id }
        });
        if (!association) {
            return res.status(404).json({ error: 'Association not found' });
        }
        await association.update(req.body);
        res.status(200).json(association);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an association
exports.delete = async (req, res) => {
    const { proj_id, src_ds_id, src_data_strc_def_attr_id } = req.params;
    try {
        const association = await ProjectDataStructureAttributeAssociation.findOne({
            where: { proj_id, src_ds_id, src_data_strc_def_attr_id }
        });
        if (!association) {
            return res.status(404).json({ error: 'Association not found' });
        }
        await association.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

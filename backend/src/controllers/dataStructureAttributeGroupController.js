const DataStructureAttributeGroup = require('../models/DataStructureAttributeGroup');

// Create a new DataStructureAttributeGroup
exports.create = async (req, res) => {
    try {
        const data = await DataStructureAttributeGroup.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all DataStructureAttributeGroups
exports.getAll = async (req, res) => {
    try {
        const data = await DataStructureAttributeGroup.findAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a DataStructureAttributeGroup by primary key
exports.getById = async (req, res) => {
    const { ds_id, stdiz_abrvd_attr_grp_nm } = req.params;
    try {
        const data = await DataStructureAttributeGroup.findOne({ where: { ds_id, stdiz_abrvd_attr_grp_nm } });
        if (!data) {
            return res.status(404).json({ error: 'DataStructureAttributeGroup not found' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a DataStructureAttributeGroup
exports.update = async (req, res) => {
    const { ds_id, stdiz_abrvd_attr_grp_nm } = req.params;
    try {
        const data = await DataStructureAttributeGroup.findOne({ where: { ds_id, stdiz_abrvd_attr_grp_nm } });
        if (!data) {
            return res.status(404).json({ error: 'DataStructureAttributeGroup not found' });
        }
        await data.update(req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a DataStructureAttributeGroup
exports.delete = async (req, res) => {
    const { ds_id, stdiz_abrvd_attr_grp_nm } = req.params;
    try {
        const data = await DataStructureAttributeGroup.findOne({ where: { ds_id, stdiz_abrvd_attr_grp_nm } });
        if (!data) {
            return res.status(404).json({ error: 'DataStructureAttributeGroup not found' });
        }
        await data.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

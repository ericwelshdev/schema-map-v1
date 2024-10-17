const DataProfileAttributeGroupStat = require('../models/DataProfileAttributeGroupStat');

// Create a new DataProfileAttributeGroupStat
exports.create = async (req, res) => {
    try {
        const data = await DataProfileAttributeGroupStat.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all DataProfileAttributeGroupStats
exports.getAll = async (req, res) => {
    try {
        const data = await DataProfileAttributeGroupStat.findAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a DataProfileAttributeGroupStat by composite key
exports.getById = async (req, res) => {
    const { ds_id, proj_id, data_strc_attr_grp_id, stdiz_abrvd_attr_nm } = req.params;
    try {
        const data = await DataProfileAttributeGroupStat.findOne({
            where: { ds_id, proj_id, data_strc_attr_grp_id, stdiz_abrvd_attr_nm }
        });
        if (!data) {
            return res.status(404).json({ error: 'DataProfileAttributeGroupStat not found' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a DataProfileAttributeGroupStat
exports.update = async (req, res) => {
    const { ds_id, proj_id, data_strc_attr_grp_id, stdiz_abrvd_attr_nm } = req.params;
    try {
        const data = await DataProfileAttributeGroupStat.findOne({
            where: { ds_id, proj_id, data_strc_attr_grp_id, stdiz_abrvd_attr_nm }
        });
        if (!data) {
            return res.status(404).json({ error: 'DataProfileAttributeGroupStat not found' });
        }
        await data.update(req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a DataProfileAttributeGroupStat
exports.delete = async (req, res) => {
    const { ds_id, proj_id, data_strc_attr_grp_id, stdiz_abrvd_attr_nm } = req.params;
    try {
        const data = await DataProfileAttributeGroupStat.findOne({
            where: { ds_id, proj_id, data_strc_attr_grp_id, stdiz_abrvd_attr_nm }
        });
        if (!data) {
            return res.status(404).json({ error: 'DataProfileAttributeGroupStat not found' });
        }
        await data.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const DataProfileAttributeStat = require('../models/DataProfileAttributeStat');

// Create a new DataProfileAttributeStat
exports.create = async (req, res) => {
    try {
        const data = await DataProfileAttributeStat.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all DataProfileAttributeStats
exports.getAll = async (req, res) => {
    try {
        const data = await DataProfileAttributeStat.findAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a DataProfileAttributeStat by composite key
exports.getById = async (req, res) => {
    const { ds_id, proj_id, data_strc_attr_id, stdiz_abrvd_attr_nm } = req.params;
    try {
        const data = await DataProfileAttributeStat.findOne({
            where: { ds_id, proj_id, data_strc_attr_id, stdiz_abrvd_attr_nm }
        });
        if (!data) {
            return res.status(404).json({ error: 'DataProfileAttributeStat not found' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a DataProfileAttributeStat
exports.update = async (req, res) => {
    const { ds_id, proj_id, data_strc_attr_id, stdiz_abrvd_attr_nm } = req.params;
    try {
        const data = await DataProfileAttributeStat.findOne({
            where: { ds_id, proj_id, data_strc_attr_id, stdiz_abrvd_attr_nm }
        });
        if (!data) {
            return res.status(404).json({ error: 'DataProfileAttributeStat not found' });
        }
        await data.update(req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a DataProfileAttributeStat
exports.delete = async (req, res) => {
    const { ds_id, proj_id, data_strc_attr_id, stdiz_abrvd_attr_nm } = req.params;
    try {
        const data = await DataProfileAttributeStat.findOne({
            where: { ds_id, proj_id, data_strc_attr_id, stdiz_abrvd_attr_nm }
        });
        if (!data) {
            return res.status(404).json({ error: 'DataProfileAttributeStat not found' });
        }
        await data.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
   

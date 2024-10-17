const AppLog = require('../models/AppLog');

// Create a new log entry
exports.create = async (req, res) => {
    try {
        const appLog = await AppLog.create(req.body);
        res.status(201).json(appLog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all log entries
exports.getAll = async (req, res) => {
    try {
        const appLogs = await AppLog.findAll();
        res.status(200).json(appLogs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get log entry by ID
exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const appLog = await AppLog.findByPk(id);
        if (!appLog) {
            return res.status(404).json({ error: 'Log entry not found' });
        }
        res.status(200).json(appLog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a log entry
exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        const appLog = await AppLog.findByPk(id);
        if (!appLog) {
            return res.status(404).json({ error: 'Log entry not found' });
        }
        await appLog.update(req.body);
        res.status(200).json(appLog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a log entry
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const appLog = await AppLog.findByPk(id);
        if (!appLog) {
            return res.status(404).json({ error: 'Log entry not found' });
        }
        await appLog.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

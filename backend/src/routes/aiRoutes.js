
const express = require('express');
const router = express.Router();
const serviceRegistry = require('../services/aiServices/serviceRegistry');

router.post('/:serviceType/:action', async (req, res) => {
    try {
        const { serviceType, action } = req.params;
        const service = serviceRegistry.getService(serviceType);
        const result = await service.process(action, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

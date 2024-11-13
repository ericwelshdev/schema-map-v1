
const express = require('express');
const router = express.Router();
const ServiceController = require('../services/aiServices/serviceController');

router.post('/:serviceType/train', async (req, res) => {
    try {
        const result = await ServiceController.processRequest(
            req.params.serviceType,
            'train',
            req.body
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:serviceType/predict', async (req, res) => {
    try {
        const result = await ServiceController.processRequest(
            req.params.serviceType,
            'predict',
            req.body
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

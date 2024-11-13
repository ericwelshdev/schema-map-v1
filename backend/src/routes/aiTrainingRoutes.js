// backend/src/routes/aiTrainingRoutes.js
const express = require('express');
const router = express.Router();
const aiTrainingController = require('../controllers/aiTrainingController');

// Define routes with their corresponding controller functions
router.post('/process-training-data', aiTrainingController.processTrainingData);
router.post('/train-model', aiTrainingController.trainModel);
router.post('/suggest-mappings', (req, res, next) => {
    console.log('Suggest mappings route hit');
    next();
}, aiTrainingController.getMappingSuggestions);

module.exports = router;

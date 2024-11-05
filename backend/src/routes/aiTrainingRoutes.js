// backend/src/routes/aiTrainingRoutes.js
const express = require('express');
const router = express.Router();
const aiTrainingController = require('../controllers/aiTrainingController');

router.post('/train', aiTrainingController.trainModel);
router.post('/suggest-mappings', aiTrainingController.suggestMappings);
router.get('/models', aiTrainingController.getModels);
router.get('/model/:id', aiTrainingController.getModelById);

module.exports = router;

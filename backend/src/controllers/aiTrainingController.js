// backend/src/controllers/aiTrainingController.js
const MLServiceConnector = require('../services/mlServiceConnector');
const AITrainingModel = require('../models/AITrainingModel');

exports.trainModel = async (req, res) => {
    const mlService = new MLServiceConnector();
    try {
        const processedData = await mlService.processTrainingData(req.body);
        const modelResults = await mlService.trainModel(processedData);
        
        await AITrainingModel.create({
            model_data: modelResults.model,
            metrics: modelResults.metrics,
            training_status: 'completed'
        });

        res.status(200).json(modelResults);
    } catch (error) {
        res.status(400).json({
            error: {
                name: error.name,
                message: error.message
            }
        });
    }
};

exports.prepareTraining = async (req, res) => {
    const mlService = new MLServiceConnector();
    try {
        const { sources } = req.body;
        
        // Process and enrich the data before sending to ML service
        const enrichedData = sources.map(source => ({
            ...source,
            features: {
                textFeatures: extractTextFeatures(source),
                numericFeatures: extractNumericFeatures(source),
                metadataFeatures: extractMetadataFeatures(source)
            }
        }));

        const processedData = await mlService.processTrainingData(enrichedData);
        res.status(200).json(processedData);
    } catch (error) {
        console.error('Training preparation error:', error);
        res.status(400).json({
            error: {
                name: error.name,
                message: error.message,
                details: error.errors
            }
        });
    }
};

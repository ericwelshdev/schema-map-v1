// backend/src/routes/aiTrainingRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const aiTrainingController = require('../controllers/aiTrainingController');

// Log incoming requests
router.use((req, res, next) => {
    console.log('AI Training Route:', req.method, req.path);
    next();
});

// Define routes with their corresponding controller functions
router.post('/process-training-data', aiTrainingController.processTrainingData);
router.post('/train-model', aiTrainingController.trainModel);
router.post('/suggest-mappings', (req, res, next) => {
    console.log('Suggest mappings route hit');
    next();
}, aiTrainingController.getMappingSuggestions);

router.post('/completions', async (req, res) => {
    console.log('Received completion request:', req.body);
    console.log('Completions endpoint hit:', {
        timestamp: new Date().toISOString(),
        messages: req.body.messages
    });
    
    const { messages } = req.body;
    
    try {
        const response = await axios.post(
            `${process.env.AZURE_OPENAI_ENDPOINT}/deployments/${process.env.AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_API_VERSION}`,
            {
                messages,
                temperature: 0.3,
                max_tokens: 800,
                top_p: 0.95,
                frequency_penalty: 0,
                presence_penalty: 0,
                stop: null,
                user: 'schemamap_app'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.AZURE_API_KEY}`
                }
            }
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('AI completion error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get AI completion' });
    }
});

module.exports = router;

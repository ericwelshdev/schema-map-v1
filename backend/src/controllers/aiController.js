const axios = require('axios');
require('dotenv').config();
const { getAzureToken } = require('./aiAuthController');

const apiEndpoint = process.env.REACT_APP_AZURE_ENDPOINT;
const apiDeploymentName = process.env.REACT_APP_AZURE_DEPLOYMENT_NAME;
const apiVersion = process.env.REACT_APP_AZURE_API_VERSION;


const serviceRegistry = require('../services/aiServices/serviceRegistry');

const getCompletion = async (req, res) => {
    const { messages } = req.body;
    
    try {
        const token = await getAzureToken();
        
        const response = await axios({
            method: 'POST',
            url: `${process.env.REACT_APP_AZURE_ENDPOINT}/chat/completions`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'api-version': process.env.REACT_APP_AZURE_API_VERSION
            },
            data: {
                messages,
                model: process.env.REACT_APP_AZURE_DEPLOYMENT_NAME,
                temperature: 0.3,
                max_tokens: 800,
                top_p: 0.95,
                frequency_penalty: 0,
                presence_penalty: 0,
                stop: null
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('AI completion error:', error);
        res.status(500).json({ error: 'Failed to get AI completion', details: error.message });
    }
};module.exports = {
    getCompletion
};
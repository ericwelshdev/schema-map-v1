// backend/src/services/mlServiceConnector.js
const axios = require('axios');

class MLServiceConnector {
    constructor() {
        this.baseUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    }

    async processTrainingData(data) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/process-training-data`,
                data
            );
            return response.data;
        } catch (error) {
            throw new Error(`ML Service processing error: ${error.message}`);
        }
    }

    async trainModel(data) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/train-model`,
                data
            );
            return response.data;
        } catch (error) {
            throw new Error(`ML Service training error: ${error.message}`);
        }
    }

    async getMappingSuggestions(data) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/suggest-mappings`,
                data
            );
            return response.data;
        } catch (error) {
            throw new Error(`ML Service suggestion error: ${error.message}`);
        }
    }
}

module.exports = MLServiceConnector;

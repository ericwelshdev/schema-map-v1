const axios = require('axios');

class MLServiceConnector {
    constructor() {
        this.baseUrl = process.env.ML_SERVICE_URL || 'http://localhost:8001';
    }

    async trainSchemaClassifier(trainingData) {
        const response = await axios.post(`${this.baseUrl}/train`, {
            model_name: "schema_classifier",
            model_type: "string",
            training_data: trainingData
        });
        return response.data;
    }

    async classifyColumns(columnNames) {
        const response = await axios.post(`${this.baseUrl}/predict`, {
            model_name: "schema_classifier",
            texts: columnNames
        });
        return response.data;
    }
}

module.exports = new MLServiceConnector();
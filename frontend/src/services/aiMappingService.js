// frontend/src/services/aiMappingService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ai';

export const trainModel = async (sourceData) => {
    const response = await axios.post(`${API_URL}/train`, sourceData);
    return response.data;
};

export const getMappingSuggestions = async (sourceColumns, targetColumns) => {
    const response = await axios.post(`${API_URL}/suggest-mappings`, {
        source_columns: sourceColumns,
        target_columns: targetColumns
    });
    return response.data;
};
// frontend/src/services/aiMappingService.js
export const submitFeedbackBatch = async (feedbackBatch) => {
    try {
        const response = await axios.post(`${API_URL}/feedback/batch`, {
            feedback: feedbackBatch
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting feedback batch:', error);
        throw error;
    }
};

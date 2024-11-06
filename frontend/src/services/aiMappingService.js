// frontend/src/services/aiMappingService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const trainModel = async (sourceData) => {
    const response = await axios.post(`${API_URL}/ai/train`, sourceData);
    return response.data;
};

export const getMappingSuggestions = async (sourceColumns, targetColumns) => {
    const response = await axios.post(`${API_URL}/ai/suggest-mappings`, {
        source_columns: sourceColumns,
        target_columns: targetColumns
    });
    
    return response.data.mapping_suggestions;
};

// frontend/src/services/aiMappingService.js
export const submitFeedbackBatch = async (feedbackBatch) => {
    try {
        const response = await axios.post(`${API_URL}/ai/feedback/batch`, {
            feedback: feedbackBatch
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting feedback batch:', error);
        throw error;
    }
};

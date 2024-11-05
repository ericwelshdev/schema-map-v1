// frontend/src/services/aiMappingService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const trainModel = async (sourceData) => {
    const response = await axios.post(`${API_URL}/ai/train`, sourceData);
    return response.data;
};

export const getMappingSuggestions = async (sourceColumns) => {
    const response = await axios.post(`${API_URL}/ai/suggest-mappings`, sourceColumns);
    return response.data;
};

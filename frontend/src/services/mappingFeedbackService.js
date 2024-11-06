import axios from 'axios';

// Ensure API_URL is defined, replace with your actual API endpoint
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";  

export const submitMappingFeedback = async (feedback) => {
    const response = await axios.post(`${API_URL}/ai/mapping-feedback`, feedback);
    return response.data;
};


import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ai';

export const analyzeSource = async (sourceData) => {
  const response = await axios.post(`${API_URL}/analyze-source`, sourceData);
  return response.data;
};

export const analyzeTarget = async (targetData) => {
  const response = await axios.post(`${API_URL}/analyze-target`, targetData);
  return response.data;
};

export const generateDataDictionary = async (data) => {
  const response = await axios.post(`${API_URL}/generate-data-dictionary`, data);
  return response.data;
};

export const profileData = async (data) => {
  const response = await axios.post(`${API_URL}/profile-data`, data);
  return response.data;
};

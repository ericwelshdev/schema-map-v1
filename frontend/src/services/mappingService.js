import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const mappingService = {
  async getSchemaSuggestions(sourceColumn, targetSchema) {
    const response = await axios.post(`${API_URL}/mapping/suggest`, {
      sourceColumn,
      targetSchema
    });
    return response.data;
  },

  async validateMapping(mapping) {
    const response = await axios.post(`${API_URL}/mapping/validate`, mapping);
    return response.data;
  },

  async saveMapping(mapping) {
    const response = await axios.post(`${API_URL}/mapping/save`, mapping);
    return response.data;
  }
};

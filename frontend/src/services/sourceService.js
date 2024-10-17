
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust this to match your backend URL

export const getSources = async () => {
  console.log('Sending request from sourceService', `${API_URL}/sources`);
  const response = await axios.get(`${API_URL}/sources`);
  console.log('Response received in sourceService:', `${API_URL}/sources` + response.data);
  return response.data;
};

export const deleteSource = async (id) => {
  await axios.delete(`${API_URL}/sources/${id}`);
};

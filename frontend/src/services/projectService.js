
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust this to match your backend URL

export const getProjects = async () => {
  console.log('Sending request from projectService', `${API_URL}/projects`);
  const response = await axios.get(`${API_URL}/projects`);
  console.log('Response received in projectService:', `${API_URL}/projects` + response.data);
  return response.data;
};

export const deleteProject = async (id) => {
  await axios.delete(`${API_URL}/projects/${id}`);
};

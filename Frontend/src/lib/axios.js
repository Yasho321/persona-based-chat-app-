import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://persona-based-chat-app.onrender.com/api/v1',
  withCredentials: true,
});
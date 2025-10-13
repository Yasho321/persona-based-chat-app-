import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://persona-based-chat-app-lmob.onrender.com/api/v1',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  // Only set header if cookies not working
  const storedToken = localStorage.getItem("authToken");
  if (storedToken) {
    config.headers.Authorization = `Bearer ${storedToken}`;
  }
  return config;
});

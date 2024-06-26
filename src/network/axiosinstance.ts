import axios from "axios";
export const API_URL = 'api/v1';
// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Bearer token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export {
    axios,
    axiosInstance
}
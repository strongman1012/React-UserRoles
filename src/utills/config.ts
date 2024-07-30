import axios from 'axios';

export const REACT_APP_SERVER_URL = "https://linkbudgettesting.azurewebsites.net";
export const LOCAL_SERVER_URL = "https://7cbe-89-187-161-220.ngrok-free.app";
export const API_VERSION = "v0";

export const apiClient = axios.create({
    baseURL: LOCAL_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

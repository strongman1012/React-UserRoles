import axios from 'axios';

const API_URL = 'https://your-api-url.com';

const apiClient = axios.create({
    baseURL: API_URL,
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

export const loginAPI = async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
};

export const registerAPI = async (userInfo: { email: string; password: string }) => {
    const response = await apiClient.post('/register', userInfo);
    return response.data;
};

export const fetchApp1Data = async () => {
    const response = await apiClient.get('/app1/data');
    return response.data;
};

export const fetchApp2Data = async () => {
    const response = await apiClient.get('/app2/data');
    return response.data;
};

// Extend this with more API functions as needed

import axios from 'axios';

export const LOCAL_SERVER_URL = `${process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:5000'}`;
//"https://react-userroles-backend.onrender.com/api/v0";
export const API_VERSION = "v0/";

export const apiClient = axios.create({
    baseURL: LOCAL_SERVER_URL + '/api/' + API_VERSION,
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

// msalConfig.js
export const msalConfig = {
    auth: {
        clientId: `${process.env.REACT_APP_AZURE_CLIENT_ID}`,
        authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID}`,
        redirectUri: LOCAL_SERVER_URL, // Your redirect URI after successful login
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
};

export const loginRequest = {
    scopes: ['openid', 'profile', 'email'], // Scopes for ID token
};

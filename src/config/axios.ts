import axios from 'axios';
import { REACT_APP_SERVER_URL } from '../utills/config';

// Define axios configuration
const axiosConfig = {
	baseURL: `${REACT_APP_SERVER_URL}/api/v0`,
	timeout: 30000
};

// Create an instance of axios using the defined configuration
const axiosInstance = axios.create(axiosConfig);

// Add response interceptor
axiosInstance && axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle network errors
		if (!error.response) {
			return Promise.reject('Network error occurred');
		}

		// Handle HTTP errors
		if (error.response.status === 401) {
			// Handle 401 Unauthorized error
			// You can redirect the user to the login page or perform other actions here
		}

		// For other HTTP errors, reject the promise with error response data
		return Promise.reject(error.response.data || 'Something went wrong');
	}
);

// Export the axios instance
export default axiosInstance;
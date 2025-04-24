import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5251',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true 
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            
            
            const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            throw new Error(errorMessage);
        } else if (error.request) {
            
            console.error('No response received:', error.request);
            throw new Error('No response from server. Please check if the server is running.');
        } else {
            
            console.error('Error setting up request:', error.message);
            throw new Error('Failed to make request. Please try again.');
        }
    }
);

export const registerUser = async (userData: {
    username: string;
    password: string;
}) => {
    try {
        const response = await apiClient.post('/api/User/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (userData: {
    username: string;
    password: string;
}) => {
    try {
        console.log('Login request data:', userData);
        const response = await apiClient.post('/api/User/login', userData);
        console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await apiClient.post('/api/User/logout');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default apiClient; 
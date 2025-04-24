import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5251',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
    (config) => {
        console.log('Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data,
        });
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers,
        });
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        if (error.response) {
            console.error('Error response:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            });
        }
        return Promise.reject(error);
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
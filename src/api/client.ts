import axios from 'axios';

// Ensure the base URL is properly formatted
const getBaseUrl = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5251';
    // Remove trailing slash if present
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

const apiClient = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
    (config) => {
        // Log request details without modifying the URL
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

export const deleteRoom = async (roomId: number) => {
    try {
        console.log(`Deleting room with ID: ${roomId}`);
        const response = await apiClient.post(`/api/Room/delete/${roomId}`);
        console.log(`Delete room response:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error deleting room ${roomId}:`, error);
        if (axios.isAxiosError(error)) {
            console.error('Response status:', error.response?.status);
            console.error('Response data:', error.response?.data);
        }
        throw error;
    }
};

// Add new API functions for payment and balance
export const createPaymentIntent = async (data: { amount: number; userId: number }) => {
    try {
        // Ensure amount is in cents (integer)
        const amount = Math.round(data.amount);
        console.log(`Creating payment intent: $${amount/100} (${amount} cents) for user ${data.userId}`);
        
        const response = await apiClient.post('/api/Payment/create-intent', {
            amount: amount,
            userId: data.userId
        });
        
        return response.data;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
};

export const confirmPayment = async (paymentIntentId: string) => {
    try {
        console.log(`Confirming payment intent: ${paymentIntentId}`);
        const response = await apiClient.post('/api/Payment/confirm', { 
            paymentIntentId: paymentIntentId 
        });
        return response.data;
    } catch (error) {
        console.error('Error confirming payment:', error);
        throw error;
    }
};

export const getUserBalance = async (userId: number) => {
    try {
        console.log(`Getting balance for user: ${userId}`);
        const response = await apiClient.get(`/api/Payment/balance/${userId}`);
        return response.data.balance;
    } catch (error) {
        console.error('Error getting user balance:', error);
        throw error;
    }
};

export default apiClient; 
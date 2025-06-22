import axios from 'axios';

const baseURL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: baseURL,
    headers:{
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

export const resgisterUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    }catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
}

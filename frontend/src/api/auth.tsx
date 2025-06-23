import axios from 'axios';

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

const baseURL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: baseURL,
    headers:{
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

export const resgisterUser = async (userData:any ) => {
    try {
        const response = await api.post<AuthResponse>('/auth/register', userData);
        return response.data;
    }catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

export const loginUser = async (credentials:any ) => {
    try {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
}

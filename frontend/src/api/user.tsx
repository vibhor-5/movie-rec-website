import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

export const getUserProfile= async (token:any) =>{
    try {
        const response = await api.get('/user/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}


import axios from 'axios';

const baseURL = process.env.BACKEND_API_URL || 'http://localhost:5000/';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

export const userPreferences = async (token, preferences) => {
    try {
        const response = await api.post('/user/preferences', preferences, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error saving user preferences:', error);
        throw error;
    }
}


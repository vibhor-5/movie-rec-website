import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/'; 
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});
interface User {
// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUserProfile = async (token: string) => {
  try {
    const response = await api.get('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (token: string, userData: any) => {
  try {
    const response = await api.put('/api/auth/profile', userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const changePassword = async (token: string, passwordData: any) => {
  try {
    const response = await api.put('/api/auth/change-password', passwordData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

import { useState, useCallback } from 'react';
import { loginUser,resgisterUser } from '../api/auth';

  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  // Check for existing token on initialization
  React.useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          setAuthState(prev => ({ ...prev, isLoading: true }));
          const profileData = await getUserProfile(token);
          if (profileData.success && profileData.user) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setAuthState({
              user: profileData.user,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            localStorage.removeItem('token');
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      }
    };

    initializeAuth();
  }, []);
  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const {user,token} = await loginUser({ email, password });
      if (!user || !token) {
        throw new Error('Login failed');
      }
      localStorage.setItem('token', token); // Store token in localStorage
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set token in axios headers
      setAuthState({
        user: user,
        isAuthenticated: true,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const {user,token} = await resgisterUser({ name, email, password });
      if (!user || !token) {
        throw new Error('Registration failed');
      }
      localStorage.setItem('token', token); // Store token in localStorage
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set token in axios headers
      
      setAuthState({
        user: user,
        isAuthenticated: true,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    register,
    logout
  };
}; 
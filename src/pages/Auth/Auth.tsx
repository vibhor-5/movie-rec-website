import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm';
import ToastNotifications, { Toast } from '../../components/common/ToastNotifications/ToastNotifications';
import styles from './Auth.module.css';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const navigate = useNavigate();
  const { login, register } = useAuthContext();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login(data.email, data.password);
      addToast({
        type: 'success',
        message: 'Successfully logged in!'
      });
      navigate('/');
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to login. Please try again.'
      });
    }
  };

  const handleRegister = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    try {
      await register(data.name, data.email, data.password);
      addToast({
        type: 'success',
        message: 'Successfully registered! Please login.'
      });
      setIsLogin(true);
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to register. Please try again.'
      });
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    try {
      // TODO: Implement social authentication
      console.log('Social auth attempt:', provider);
      
      addToast({
        type: 'info',
        message: `${provider} authentication coming soon!`
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Social authentication failed. Please try again.'
      });
    }
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            onSocialLogin={handleSocialAuth}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSocialRegister={handleSocialAuth}
          />
        )}
      </div>
      <ToastNotifications
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  );
};

export default Auth; 
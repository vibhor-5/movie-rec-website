import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import LoginForm from '../../components/auth/LoginForm/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm/RegisterForm';
import ToastNotifications, { Toast } from '../../components/common/ToastNotifications/ToastNotifications';
import styles from './Auth.module.css';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuthContext();

  const from = location.state?.from?.pathname || '/onboarding';

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const success = await login(data.email, data.password);
      if (success) {
        addToast({
          type: 'success',
          message: 'Successfully logged in!',
          duration: 3000
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to login. Please check your credentials.',
        duration: 5000
      });
    }
  };

  const handleRegister = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    try {
      const success = await register(data.name, data.email, data.password);
      if (success) {
        addToast({
          type: 'success',
          message: 'Account created successfully! Welcome aboard!',
          duration: 3000
        });
        navigate('/onboarding', { replace: true });
      }
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to create account. Please try again.',
        duration: 5000
      });
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    try {
      addToast({
        type: 'info',
        message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication coming soon!`,
        duration: 3000
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Social authentication failed. Please try again.',
        duration: 5000
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

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setToasts([]); // Clear any existing toasts when switching modes
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            onSocialLogin={handleSocialAuth}
            onToggleMode={toggleAuthMode}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSocialRegister={handleSocialAuth}
            onToggleMode={toggleAuthMode}
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
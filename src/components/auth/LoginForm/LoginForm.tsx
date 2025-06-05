import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../../common/Button/Button';
import styles from './LoginForm.module.css';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: (data: LoginFormData) => Promise<void>;
  onSocialLogin: (provider: 'google' | 'facebook') => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onSocialLogin
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await onLogin(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true);
      setError(null);
      await onSocialLogin(provider);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome Back</h2>
      <p className={styles.subtitle}>Sign in to continue</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={styles.input}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={styles.input}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          className={styles.submitButton}
        >
          Sign In
        </Button>
      </form>

      <div className={styles.divider}>
        <span>or continue with</span>
      </div>

      <div className={styles.socialButtons}>
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          className={styles.socialButton}
          disabled={isLoading}
        >
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('facebook')}
          className={styles.socialButton}
          disabled={isLoading}
        >
          Facebook
        </Button>
      </div>

      <p className={styles.signup}>
        Don't have an account?{' '}
        <button
          onClick={() => navigate('/register')}
          className={styles.signupLink}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginForm; 
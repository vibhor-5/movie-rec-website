import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../../common/Button/Button';
import styles from './RegisterForm.module.css';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegister: (data: RegisterFormData) => Promise<void>;
  onSocialRegister: (provider: 'google' | 'facebook') => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onSocialRegister
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await onRegister(data);
      navigate('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true);
      setError(null);
      await onSocialRegister(provider);
      navigate('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Account</h2>
      <p className={styles.subtitle}>Join us to get personalized movie recommendations</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={styles.input}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}
        </div>

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
            placeholder="Create a password"
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={styles.input}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <span className={styles.error}>{errors.confirmPassword.message}</span>
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
          Create Account
        </Button>
      </form>

      <div className={styles.divider}>
        <span>or sign up with</span>
      </div>

      <div className={styles.socialButtons}>
        <Button
          variant="outline"
          onClick={() => handleSocialRegister('google')}
          className={styles.socialButton}
          disabled={isLoading}
        >
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialRegister('facebook')}
          className={styles.socialButton}
          disabled={isLoading}
        >
          Facebook
        </Button>
      </div>

      <p className={styles.login}>
        Already have an account?{' '}
        <button
          onClick={() => navigate('/login')}
          className={styles.loginLink}
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default RegisterForm; 
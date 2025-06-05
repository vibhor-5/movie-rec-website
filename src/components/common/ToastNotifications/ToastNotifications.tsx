import React, { useEffect } from 'react';
import styles from './ToastNotifications.module.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastNotificationsProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastNotifications: React.FC<ToastNotificationsProps> = ({
  toasts,
  onRemove
}) => {
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          onRemove(toast.id);
        }, toast.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, onRemove]);

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          role="alert"
        >
          <div className={styles.content}>
            <span className={styles.message}>{toast.message}</span>
            <button
              className={styles.closeButton}
              onClick={() => onRemove(toast.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastNotifications; 
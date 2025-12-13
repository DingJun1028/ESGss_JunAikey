
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from '../types';

interface ToastContextType {
  toasts: Toast[];
  notifications: Toast[]; // Persistent history
  /**
   * Triggers a new toast notification and adds it to history.
   */
  addToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearNotifications: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Provides a global system for displaying temporary notification messages (Toasts)
 * and maintaining a persistent notification history for the notification center.
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifications, setNotifications] = useState<Toast[]>([
    // Initial Mock Notifications
    { id: 'init-1', type: 'success', title: 'System Ready', message: 'ESGss Platform v12.0.4 initialized.', duration: 0 },
    { id: 'init-2', type: 'info', title: 'AI Agent', message: 'Gemini 3 Pro connected for deep reasoning.', duration: 0 }
  ]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string, duration = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, type, message, title, duration };
    
    // Add to transient toasts (popups)
    setToasts((prev) => [...prev, newToast]);

    // Add to persistent history (notification center)
    setNotifications((prev) => [newToast, ...prev].slice(0, 50)); // Keep last 50

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, notifications, addToast, removeToast, clearNotifications }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

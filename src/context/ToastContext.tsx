'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (title: string, description?: string, type?: ToastType) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((title: string, description?: string, type: ToastType = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { id, title, description, type };
    setToasts(prev => [...prev.slice(-3), newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const success = useCallback((t: string, d?: string) => addToast(t, d, 'success'), [addToast]);
  const error = useCallback((t: string, d?: string) => addToast(t, d, 'error'), [addToast]);
  const warning = useCallback((t: string, d?: string) => addToast(t, d, 'warning'), [addToast]);
  const info = useCallback((t: string, d?: string) => addToast(t, d, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, warning, info }}>
      {children}
      {/* Brutalist Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(item => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 border bg-[#0d0f0c] shadow-2xl transition-all duration-300 transform translate-y-0 ${
              item.type === 'success'
                ? 'border-[#C8FF16] text-[#F1F1EB]'
                : item.type === 'error'
                ? 'border-[#FF314A] text-[#F1F1EB]'
                : item.type === 'warning'
                ? 'border-[#FF6B00] text-[#F1F1EB]'
                : 'border-white/20 text-[#F1F1EB]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#C8FF16]" />}
              {item.type === 'error' && <XCircle className="w-5 h-5 text-[#FF314A]" />}
              {item.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[#FF6B00]" />}
              {item.type === 'info' && <Info className="w-5 h-5 text-white/80" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-xs uppercase tracking-widest text-white/50 mb-0.5">
                GATE PROTOCOL // {item.type}
              </div>
              <div className="text-sm font-bold tracking-tight text-white">{item.title}</div>
              {item.description && (
                <div className="text-xs text-white/70 mt-1 leading-relaxed">{item.description}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="text-white/40 hover:text-white transition-colors shrink-0 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

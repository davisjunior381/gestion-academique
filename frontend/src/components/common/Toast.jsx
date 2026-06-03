import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { setToastDispatcher } from '../../services/toast-store';

/*
 * Système de toast minimaliste, aligné sur l'identité Sygle.
 * - Toasts empilés en bas à droite
 * - Auto-dismiss 5s
 * - Types : error, success, info, warning
 * - Exposé hors React via setToastDispatcher / toast() (cf. toast-store.js)
 */

const TOAST_DURATION_MS = 5000;

const ToastContext = createContext(null);

const TYPE_STYLES = {
  error: 'border-danger-100 bg-danger-50 text-danger-700',
  success: 'border-success-100 bg-success-50 text-success-700',
  warning: 'border-warning-100 bg-warning-50 text-warning-700',
  info: 'border-brand-100 bg-brand-50 text-brand-700',
};

const TYPE_LABELS = {
  error: 'Erreur',
  success: 'Succès',
  warning: 'Attention',
  info: 'Info',
};

let toastIdSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (message, type = 'info') => {
      if (!message) return;
      toastIdSeq += 1;
      const id = toastIdSeq;
      const safeType = TYPE_STYLES[type] ? type : 'info';
      setToasts((current) => [...current, { id, message, type: safeType }]);
      const timer = setTimeout(() => removeToast(id), TOAST_DURATION_MS);
      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  useEffect(() => {
    setToastDispatcher(addToast);
    return () => {
      setToastDispatcher(() => {});
    };
  }, [addToast]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-2"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto rounded-sm border px-4 py-3 text-sm shadow-md ${TYPE_STYLES[t.type]}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="font-mono text-[10px] font-medium uppercase tracking-wider">
                  {TYPE_LABELS[t.type]}
                </p>
                <p className="mt-1 leading-snug">{t.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="Fermer la notification"
                className="rounded-sm px-1 text-[18px] leading-none opacity-60 transition hover:opacity-100"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast doit être utilisé à l\'intérieur d\'un ToastProvider');
  }
  return ctx;
}

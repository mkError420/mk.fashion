import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 sm:top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center space-y-2.5 max-w-md w-[calc(100%-2rem)] pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto w-full bg-neutral-950/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-neutral-800 flex items-start space-x-3 animate-in fade-in slide-in-from-top-3 duration-300 ring-1 ring-white/10"
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-white tracking-wide">{toast.title}</h5>
            <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">{toast.message}</p>
          </div>

          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-neutral-400 hover:text-white p-0.5 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

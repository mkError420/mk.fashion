import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-black text-white p-3.5 rounded-xl shadow-xl border border-neutral-800 flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-200"
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-neutral-300 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-neutral-300 flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-white tracking-wide">{toast.title}</h5>
            <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">{toast.message}</p>
          </div>

          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-neutral-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

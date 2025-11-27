import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`p-3 rounded-lg shadow-lg border text-white min-w-64  max-w-sm transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-600 border-green-700' :
            toast.type === 'error' ? 'bg-red-600 border-red-700' :
            toast.type === 'warning' ? 'bg-yellow-600 border-yellow-700' :
            'bg-blue-600 border-blue-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-4 text-white hover:text-gray-200 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};
import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border transition-all animate-bounce ${
      isSuccess 
        ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700/50 backdrop-blur-md' 
        : 'bg-rose-900/90 text-rose-100 border-rose-700/50 backdrop-blur-md'
    }`}>
      {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

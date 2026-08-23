import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const borders = {
    success: 'border-emerald-500/30',
    error: 'border-rose-500/30',
    info: 'border-blue-500/30',
  };

  return (
    <div className={`glass flex items-center justify-between p-4 rounded-xl border ${borders[type]} shadow-xl animate-fade-in`}>
      <div className="flex items-center space-x-3">
        {icons[type]}
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{message}</span>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;

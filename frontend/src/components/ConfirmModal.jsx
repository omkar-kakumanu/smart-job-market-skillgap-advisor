import React from 'react';
import { AlertCircle } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', isDanger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass max-w-md w-full p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${isDanger ? 'bg-rose-500/10 text-rose-500' : 'bg-brand-500/10 text-brand-600'}`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-darkcard transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-md transition ${
              isDanger ? 'bg-rose-600 hover:bg-rose-700' : 'gradient-btn'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

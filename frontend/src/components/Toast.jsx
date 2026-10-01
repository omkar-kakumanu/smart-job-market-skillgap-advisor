import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-950/80 text-emerald-100',
    error: 'border-rose-500/40 bg-rose-950/80 text-rose-100',
    info: 'border-sky-500/40 bg-slate-900/90 text-sky-100',
  };

  const progressColors = {
    success: 'bg-emerald-400',
    error: 'bg-rose-400',
    info: 'bg-sky-400',
  };

  return (
    <div className={`relative overflow-hidden pointer-events-auto glass flex items-center justify-between p-4 rounded-xl border ${borders[type]} shadow-2xl backdrop-blur-xl animate-fade-in transition-all duration-300`}>
      <div className="flex items-center space-x-3 mr-2">
        {icons[type]}
        <span className="text-xs sm:text-sm font-semibold tracking-wide text-white leading-snug">
          {message}
        </span>
      </div>
      <button 
        onClick={onClose} 
        aria-label="Close notification"
        className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* 3-Second Countdown Progress Bar */}
      <div 
        className={`absolute bottom-0 left-0 h-0.5 ${progressColors[type]} opacity-80`}
        style={{
          width: '100%',
          animation: `toastProgress ${duration}ms linear forwards`
        }}
      />
    </div>
  );
};

export default Toast;

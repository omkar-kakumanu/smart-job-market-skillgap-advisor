import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'sky', subtitle }) => {
  const colorMap = {
    sky: 'bg-sky-500/15 dark:bg-emerald-500/20 text-sky-600 dark:text-emerald-400 border border-sky-400/40 dark:border-emerald-500/40',
    emerald: 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-400/40 dark:border-emerald-500/40',
    amber: 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-400/40 dark:border-amber-500/40',
    rose: 'bg-rose-500/15 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-400/40 dark:border-rose-500/40',
    indigo: 'bg-indigo-500/15 dark:bg-emerald-500/20 text-indigo-600 dark:text-emerald-400 border border-indigo-400/40 dark:border-emerald-500/40',
  };

  return (
    <div className="glass p-6 rounded-2xl border border-sky-400/30 dark:border-emerald-500/30 shadow-solo-glow dark:shadow-doom-glow hover:border-sky-500 dark:hover:border-emerald-400/80 hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-tech font-bold uppercase tracking-widest text-sky-700 dark:text-emerald-400">{title}</p>
          <h3 className="text-2xl font-cinzel font-black mt-2 text-slate-900 dark:text-white">{value}</h3>
          {subtitle && <p className="text-xs font-tech text-slate-600 dark:text-gray-400 mt-1 font-semibold">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl ${colorMap[color] || colorMap.sky}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

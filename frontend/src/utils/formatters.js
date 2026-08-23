export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatPercent = (value) => {
  if (value === undefined || value === null) return '0%';
  return `${Number(value).toFixed(1)}%`;
};

export const getBadgeColor = (category) => {
  switch (category?.toUpperCase()) {
    case 'TECHNICAL':
      return 'bg-sky-100 text-sky-900 border-sky-400/60 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/50 shadow-[0_0_10px_rgba(14,165,233,0.2)] dark:shadow-[0_0_10px_rgba(16,185,129,0.2)] font-tech font-bold';
    case 'SOFT':
      return 'bg-emerald-100 text-emerald-900 border-emerald-400/60 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-tech font-bold';
    case 'CERTIFICATION':
      return 'bg-amber-100 text-amber-900 border-amber-400/60 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-tech font-bold';
    default:
      return 'bg-indigo-100 text-indigo-900 border-indigo-400/60 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-400/40 font-tech font-bold';
  }
};

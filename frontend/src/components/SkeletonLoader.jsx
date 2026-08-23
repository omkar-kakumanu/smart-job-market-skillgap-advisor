import React from 'react';

const SkeletonLoader = ({ count = 1, height = 'h-12' }) => {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`${height} bg-gray-200 dark:bg-gray-800 rounded-xl w-full`}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;

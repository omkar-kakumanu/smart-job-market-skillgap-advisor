import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="glass max-w-md w-full p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">404</h1>
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Page Not Found</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          The career page or resource you are looking for does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 text-sm font-bold text-white gradient-btn rounded-xl shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

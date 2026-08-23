import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-6">
      <Link to="/" className="hover:text-brand-600 dark:hover:text-white flex items-center space-x-1">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          {item.to ? (
            <Link to={item.to} className="hover:text-brand-600 dark:hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 dark:text-gray-200 font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;

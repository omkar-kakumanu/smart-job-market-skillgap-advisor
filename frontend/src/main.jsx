import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import { ensureMasterDataSeeded } from './utils/enterpriseSync';

// Guarantee that on Vercel deployment (or any clean browser), all master local device data is immediately loaded into localStorage!
try {
  ensureMasterDataSeeded();
} catch (e) {
  console.warn('Initial master data seeding fallback:', e);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

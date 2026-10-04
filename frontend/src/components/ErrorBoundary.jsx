import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleClearSession = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {
      console.warn('Unable to clear local storage:', e);
    }
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans select-none">
          <div className="max-w-lg w-full bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Application Experience Safeguard
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                An unexpected client-side runtime exception occurred. The safety boundary prevented a blank screen and preserved your system state.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-left text-xs font-mono text-rose-300 max-h-32 overflow-y-auto overflow-x-hidden break-words">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md active:scale-95"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </button>

              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold transition-all active:scale-95"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </button>
            </div>

            <div className="pt-2 border-t border-slate-700/50">
              <button
                onClick={this.handleClearSession}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors underline underline-offset-4"
              >
                Troubleshoot session: Clear cache & re-login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

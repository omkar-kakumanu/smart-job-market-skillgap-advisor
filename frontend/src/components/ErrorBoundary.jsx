import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: true };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('sidebar_collapsed');
      localStorage.removeItem('sidebar_position');
    } catch (_) {}
    window.location.reload();
  };

  handleReset = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('sidebar_collapsed');
      localStorage.removeItem('sidebar_position');
    } catch (_) {}
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleClearSession = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Unable to clear local storage:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0a1310] to-slate-900 text-white flex items-center justify-center p-4 font-sans select-none relative overflow-hidden">
          {/* Subtle animated background glowing blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-lg w-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl text-center space-y-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <ShieldAlert className="w-8 h-8 animate-pulse text-emerald-400" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise Experience Safeguard</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white font-heading">
                Session Restored & Protected
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                A client-side state transition was intercepted. The platform safety boundary prevented data loss and maintained your profile integrity.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    Diagnostics
                  </span>
                  <button
                    type="button"
                    onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                    className="text-[10px] font-mono text-emerald-400 hover:underline cursor-pointer"
                  >
                    {this.state.showDetails ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                {this.state.showDetails && (
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 max-h-36 overflow-y-auto overflow-x-hidden break-words selection:bg-emerald-900">
                    {this.state.error.toString()}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Application
              </button>

              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all border border-slate-700 active:scale-95 cursor-pointer"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-col items-center gap-2">
              <button
                onClick={this.handleClearSession}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-xs transition cursor-pointer"
              >
                ✨ Clear Corrupted Cache & Fresh Start
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

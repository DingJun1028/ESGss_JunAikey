import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center bg-slate-900/50 rounded-2xl border border-red-500/20 backdrop-blur-sm animate-fade-in">
          <div className="p-4 bg-red-500/10 rounded-full mb-4 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">System Module Interrupted</h2>
          <p className="text-gray-400 mb-6 max-w-md text-sm leading-relaxed">
            Intelligence Orchestrator detected a runtime anomaly in this sector. 
            The localized error has been contained.
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Module
            </button>
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 transition-all"
            >
              <Home className="w-4 h-4" />
              System Reboot
            </button>
          </div>
          {this.state.error && (
             <div className="mt-8 p-4 bg-black/40 rounded-lg border border-white/5 text-left w-full max-w-lg overflow-auto max-h-32">
                 <code className="text-[10px] font-mono text-red-300">
                     {this.state.error.toString()}
                 </code>
             </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
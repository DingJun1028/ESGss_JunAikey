
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

/**
 * ErrorBoundary catches runtime exceptions in its child component tree.
 */
/* Explicitly extending React.Component and using a constructor ensures that state, props, and setState are correctly typed and available on the instance. */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined
    };
  }

  /* Update state so the next render shows the fallback UI. */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  /* Use arrow function for correct 'this' binding. */
  public handleRetry = () => {
    /* Using the setState method inherited from the React.Component base class. */
    this.setState({ hasError: false, error: undefined });
  };

  public handleReload = () => {
    window.location.reload();
  };

  public render(): ReactNode {
    /* Destructuring state and props which are now correctly recognized through explicit base class extension. */
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
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
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 transition-all"
            >
              <Home className="w-4 h-4" />
              System Reboot
            </button>
          </div>
          {/* Safely display error string for diagnostic purposes */}
          {error && (
             <div className="mt-8 p-4 bg-black/40 rounded-lg border border-white/5 text-left w-full max-w-lg overflow-auto max-h-32">
                 <code className="text-[10px] font-mono text-red-300">
                     {error.toString()}
                 </code>
             </div>
          )}
        </div>
      );
    }

    return children;
  }
}

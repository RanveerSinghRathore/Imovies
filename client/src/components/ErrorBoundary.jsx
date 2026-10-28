import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Robust Error Boundary Class Component
 * Never shows raw error messages or stack traces to end users.
 * Logs details to console in development only.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary caught an error]:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div
            className="w-full max-w-md rounded-3xl border p-8 text-center space-y-5 shadow-2xl"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: 'var(--color-error)',
              }}
            >
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
                Something went wrong
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                An unexpected application error occurred. Please try reloading the page.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-opacity hover:opacity-90 shadow-md"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent-from), var(--color-accent-to))',
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>

              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border font-bold text-xs transition-colors hover:opacity-80"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

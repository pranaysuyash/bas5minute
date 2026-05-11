'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
            <div className="text-6xl">😱</div>
            <h1 className="text-2xl font-bold text-gray-900">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600">
              We encountered an unexpected error. Don't worry, it's not your fault!
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 rounded-lg p-4 text-left text-sm text-red-700 overflow-auto max-h-32">
                <code>{this.state.error.message}</code>
              </div>
            )}
            <div className="space-y-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition"
              >
                Go Home
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

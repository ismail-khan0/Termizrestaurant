import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#111] text-white flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] p-6 rounded-xl max-w-md text-center">
            <h2 className="text-xl font-bold mb-4 text-red-500">Something went wrong</h2>
            <p className="text-gray-300 mb-4">
              There was an error loading this component. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Refresh Page
            </button>
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-400">Error Details</summary>
              <pre className="text-xs text-gray-500 mt-2 overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
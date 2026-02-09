import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">
              <FaExclamationTriangle />
            </div>
            <h2>Oops! Something went wrong</h2>
            <p className="error-message">
              {this.props.message || 'We encountered an unexpected error.'}
            </p>
            
            {this.props.showDetails && (
              <div className="error-details">
                <details>
                  <summary>Error Details</summary>
                  <pre>{this.state.error?.toString()}</pre>
                  <pre>{this.state.errorInfo?.componentStack}</pre>
                </details>
              </div>
            )}

            <div className="error-actions">
              <button onClick={this.handleRetry} className="btn btn-primary">
                <FaRedo /> Try Again
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-secondary"
              >
                Reload Page
              </button>
              {this.props.onBack && (
                <button onClick={this.props.onBack} className="btn btn-outline">
                  Go Back
                </button>
              )}
            </div>

            {this.props.children}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
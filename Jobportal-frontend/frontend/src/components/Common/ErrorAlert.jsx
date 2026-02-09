import './ErrorAlert.css';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorAlert = ({ message, onRetry }) => {
  return (
    <div className="error-alert">
      <div className="error-icon">
        <FaExclamationTriangle />
      </div>
      <div className="error-content">
        <h3>Something went wrong</h3>
        <p>{message || 'An unexpected error occurred. Please try again.'}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
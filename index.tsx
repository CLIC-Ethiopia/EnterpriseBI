import React, { ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#dc2626', marginBottom: '16px', fontSize: '24px' }}>Something went wrong</h1>
          <p style={{ color: '#4b5563', marginBottom: '24px' }}>The application encountered an unexpected error.</p>
          <div style={{ backgroundColor: '#fee2e2', padding: '16px', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '24px', maxWidth: '600px', overflow: 'auto' }}>
            <code style={{ color: '#991b1b', fontSize: '14px' }}>{this.state.error?.message}</code>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ErrorBoundary } from './ErrorBoundary.tsx';

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonMsg = event.reason instanceof Error ? event.reason.message : String(event.reason || '');
    // Suppress raw Event objects or Vite HMR WebSocket disconnects when HMR is disabled
    if (
      reasonMsg.includes('WebSocket closed without opened') ||
      (event.reason && (event.reason.isTrusted || event.reason instanceof Event || (typeof event.reason === 'object' && 'isTrusted' in event.reason)))
    ) {
      event.preventDefault();
      return;
    }
  });

  window.addEventListener('error', (event) => {
    const errMsg = event.message || (event.error instanceof Error ? event.error.message : '');
    if (
      errMsg.includes('WebSocket closed without opened') ||
      (event.filename && event.filename.includes('@vite/client')) ||
      (event.error && (event.error.isTrusted || event.error instanceof Event || (typeof event.error === 'object' && 'isTrusted' in event.error)))
    ) {
      event.preventDefault();
      return;
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Application root element was not found.');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);

document.documentElement.dataset.appMounted = 'true';
document.documentElement.classList.remove('app-boot-failed');

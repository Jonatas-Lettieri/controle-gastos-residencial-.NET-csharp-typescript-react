import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * Componente para tratamento de erros
 */
export const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => {
  return (
    <div className="container mt-5 text-center">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Oops! Algo deu errado</h4>
        <p>Ocorreu um erro inesperado na aplicação.</p>
        <hr />
        <p className="mb-0">
          <strong>Erro:</strong> {error.message}
        </p>
        <button
          className="btn btn-primary mt-3"
          onClick={() => window.location.href = '/'}
        >
          Voltar para a página inicial
        </button>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
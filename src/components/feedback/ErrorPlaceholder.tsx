import React from 'react';

interface ErrorPlaceholderProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorPlaceholder: React.FC<ErrorPlaceholderProps> = ({
  title = 'Encountered a Medical Service Issue',
  message = 'An unexpected error occurred while processing this hospital portal view. Please retry or contact technical support.',
  onRetry,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        minHeight: '260px',
        textAlign: 'center',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        margin: '1rem',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#FEE2E2',
          color: 'var(--color-error)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
        }}
      >
        !
      </div>
      <h3
        style={{
          color: 'var(--color-text)',
          fontSize: '1.15rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
          maxWidth: '460px',
          marginBottom: '1.25rem',
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLElement).style.backgroundColor =
              'var(--color-primary-dark)')
          }
          onMouseOut={(e) =>
            ((e.target as HTMLElement).style.backgroundColor =
              'var(--color-primary)')
          }
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};

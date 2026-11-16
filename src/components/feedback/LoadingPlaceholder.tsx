import React from 'react';

interface LoadingPlaceholderProps {
  message?: string;
  subtext?: string;
}

export const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({
  message = 'Loading Medical Services...',
  subtext = 'Preparing clinical data and portal assets',
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
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--color-primary-light)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem',
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <h3
        style={{
          color: 'var(--color-text)',
          fontSize: '1.1rem',
          fontWeight: 600,
          marginBottom: '0.25rem',
        }}
      >
        {message}
      </h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        {subtext}
      </p>
    </div>
  );
};

import React from 'react';

interface NotFoundPlaceholderProps {
  portalName?: string;
  onNavigateHome?: () => void;
}

export const NotFoundPlaceholder: React.FC<NotFoundPlaceholderProps> = ({
  portalName = 'Portal Page',
  onNavigateHome,
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
          fontSize: '3rem',
          fontWeight: 800,
          color: 'var(--color-primary)',
          letterSpacing: '-0.05em',
          marginBottom: '0.5rem',
        }}
      >
        404
      </div>
      <h3
        style={{
          color: 'var(--color-text)',
          fontSize: '1.25rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
        }}
      >
        {portalName} Not Found
      </h3>
      <p
        style={{
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
          maxWidth: '420px',
          marginBottom: '1.25rem',
        }}
      >
        The requested medical portal route or resource does not exist or may have
        been relocated.
      </p>
      {onNavigateHome && (
        <button
          onClick={onNavigateHome}
          style={{
            backgroundColor: 'var(--color-teal)',
            color: '#FFFFFF',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Return to Hospital Overview
        </button>
      )}
    </div>
  );
};

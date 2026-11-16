import React from 'react';
import { APP_CONFIG } from '@/config/app.config';
import { ShieldCheck, PhoneCall } from 'lucide-react';

interface HospitalHeaderProps {
  activePortal?: string | undefined;
}

export const HospitalHeader: React.FC<HospitalHeaderProps> = ({ activePortal }) => {
  return (
    <header
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Top Clinical Strip: Demo Notice & Non-operational emergency indicator */}
      <div
        style={{
          backgroundColor: 'var(--color-primary-dark)',
          color: '#FFFFFF',
          fontSize: '0.75rem',
          padding: '0.4rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={14} color="#14B8A6" />
          <span>Demo Platform — Healthcare Management Architecture Prototype</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PhoneCall size={14} color="#FBBF24" />
          <span>Emergency Line: <strong style={{ color: '#FCA5A5' }}>{APP_CONFIG.emergencyContact}</strong></span>
        </div>
      </div>

      {/* Main Hospital Brand Bar */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-teal) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            +
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-primary-dark)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {APP_CONFIG.name}
            </h1>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-teal)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {APP_CONFIG.platformName}
            </p>
          </div>
        </div>

        {activePortal && (
          <div
            style={{
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary-dark)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '1px solid #BFDBFE',
            }}
          >
            Active View: {activePortal}
          </div>
        )}
      </div>
    </header>
  );
};

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { DEMO_NOTICE } from '@/config/publicSampleData';

interface DemoBadgeProps {
  label?: string | undefined;
  variant?: 'banner' | 'pill' | 'subtle' | undefined;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({
  label = DEMO_NOTICE.badgeText,
  variant = 'pill',
}) => {
  if (variant === 'banner') {
    return (
      <div
        role="alert"
        style={{
          backgroundColor: '#FFFBEB',
          borderBottom: '1px solid #FDE68A',
          color: '#92400E',
          padding: '0.45rem 1.5rem',
          fontSize: '0.785rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          textAlign: 'center',
        }}
      >
        <AlertCircle size={15} style={{ flexShrink: 0, color: '#D97706' }} />
        <span>
          <strong>{DEMO_NOTICE.badgeText}:</strong> {DEMO_NOTICE.bannerText}
        </span>
      </div>
    );
  }

  if (variant === 'subtle') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontSize: '0.7rem',
          color: '#B45309',
          backgroundColor: '#FEF3C7',
          padding: '0.15rem 0.5rem',
          borderRadius: '9999px',
          fontWeight: 600,
          border: '1px solid #FDE68A',
        }}
      >
        <AlertCircle size={11} />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: '#FEF3C7',
        color: '#92400E',
        padding: '0.2rem 0.65rem',
        borderRadius: '9999px',
        border: '1px solid #FCD34D',
      }}
    >
      <AlertCircle size={13} color="#D97706" />
      <span>{label}</span>
    </span>
  );
};

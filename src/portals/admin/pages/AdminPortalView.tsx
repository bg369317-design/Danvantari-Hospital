import React from 'react';
import { ShieldCheck, BedDouble, FileSpreadsheet, Lock } from 'lucide-react';

export const AdminPortalView: React.FC = () => {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div
        style={{
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              marginBottom: '0.5rem',
            }}
          >
            <ShieldCheck size={14} />
            <span>Hospital Operations &amp; Administration</span>
          </div>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--color-text)',
            }}
          >
            Hospital Administration Console
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Bed management, department rosters, compliance audits, and role administration.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem',
            }}
          >
            <BedDouble color="var(--color-primary)" size={22} />
            <h4 style={{ fontWeight: 600, fontSize: '1rem' }}>Bed Occupancy &amp; Wards</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Real-time tracking of ICU, CCU, General Wards, and isolation facilities.
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem',
            }}
          >
            <FileSpreadsheet color="var(--color-teal)" size={22} />
            <h4 style={{ fontWeight: 600, fontSize: '1rem' }}>Audit &amp; Compliance</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            HIPAA/DISHA access logs, staff activity records, and billing reports.
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem',
            }}
          >
            <Lock color="#D97706" size={22} />
            <h4 style={{ fontWeight: 600, fontSize: '1rem' }}>RBAC &amp; Security</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Staff credentials, permission matrices, and system integration status.
          </p>
        </div>
      </div>
    </div>
  );
};

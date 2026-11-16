import React from 'react';
import { APP_CONFIG } from '@/config/app.config';

export const HospitalFooter: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0F172A',
        color: '#94A3B8',
        padding: '2.5rem 1.5rem 1.5rem 1.5rem',
        borderTop: '1px solid var(--color-border)',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h4
            style={{
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            {APP_CONFIG.name}
          </h4>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
            {APP_CONFIG.tagline}. Delivering patient-centered, technology-driven
            medical excellence across specialized departments.
          </p>
        </div>

        <div>
          <h4
            style={{
              color: '#FFFFFF',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            Portals &amp; Access
          </h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', lineHeight: 2 }}>
            <li>Public Information Website</li>
            <li>Patient Portal (MyDanvantari)</li>
            <li>Doctor &amp; Clinical EHR Portal</li>
            <li>Hospital Administration &amp; Audits</li>
          </ul>
        </div>

        <div>
          <h4
            style={{
              color: '#FFFFFF',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            System Architecture
          </h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', lineHeight: 2 }}>
            <li>Healthcare Data Security Design</li>
            <li>Role-Based Data Isolation (RLS Prototype)</li>
            <li>Audited Clinical Workflows</li>
            <li>Encrypted Document Storage Design</li>
          </ul>
        </div>

        <div>
          <h4
            style={{
              color: '#FFFFFF',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            Emergency Notice
          </h4>
          <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: '#FCA5A5' }}>
            DEMO ONLY: Numbers shown on this evaluation site are non-operational.
          </p>
          <p
            style={{
              color: 'var(--color-accent)',
              fontSize: '0.95rem',
              fontWeight: 700,
            }}
          >
            For Real Emergencies: Dial 112 / 108
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '1.25rem',
          borderTop: '1px solid #1E293B',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.75rem',
        }}
      >
        <span>
          &copy; {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
        </span>
        <span style={{ color: 'var(--color-teal)' }}>
          Foundation Build • Phase 1
        </span>
      </div>
    </footer>
  );
};

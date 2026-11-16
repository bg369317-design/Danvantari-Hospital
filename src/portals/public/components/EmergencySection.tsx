import React from 'react';
import { HospitalBranch } from '@/types/publicWebsite';
import {
  PhoneCall,
  Ambulance,
  AlertOctagon,
  Clock,
  HeartPulse,
  Activity,
} from 'lucide-react';

interface EmergencySectionProps {
  branches: HospitalBranch[];
  selectedBranchId: string;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({
  branches,
  selectedBranchId,
}) => {
  const currentBranch =
    branches.find((b) => b.id === selectedBranchId) ?? branches[0];

  return (
    <section
      id="emergency"
      style={{
        padding: '4rem 1.5rem',
        backgroundColor: '#FEF2F2',
        borderTop: '2px solid #FCA5A5',
        borderBottom: '2px solid #FCA5A5',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Banner Alert Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span
              style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0.25rem 0.85rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <AlertOctagon size={14} />
              <span>Demonstration Emergency Layout — Non-Operational Phone Numbers</span>
            </span>
          </div>

          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#991B1B',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Emergency &amp; Acute Trauma Information
          </h2>
          <p
            style={{
              color: '#7F1D1D',
              fontSize: '1rem',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: 1.5,
              fontWeight: 600,
            }}
          >
            IMPORTANT NOTICE: All telephone numbers on this demonstration website are simulated and non-operational. In a real medical emergency, immediately dial your national emergency number (e.g. 112 or 108 in India).
          </p>
        </div>

        {/* Emergency Hotline Showcase Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid #F87171',
            padding: '2.25rem',
            boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.15)',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Ambulance size={24} color="#DC2626" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991B1B' }}>
                  Casualty Desk Simulation: {currentBranch?.name.replace(' (Demonstration Facility)', '')}
                </h3>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Design layout for hospital casualty and trauma intake.
              </p>
              <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>
                NON-OPERATIONAL DEMO NUMBER – DO NOT CALL FOR ACTUAL MEDICAL ASSISTANCE
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: '#FEF2F2',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #FCA5A5',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PhoneCall size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#991B1B' }}>
                  Simulated Demo Line (Non-operational)
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#991B1B', letterSpacing: '-0.01em' }}>
                  {currentBranch?.emergencyPhone}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Capabilities Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              border: '1px solid #FCA5A5',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <HeartPulse size={20} color="#DC2626" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Rapid Cardiac Triage
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Immediate 12-lead ECG acquisition within 10 minutes of arrival, point-of-care cardiac troponin assays, and coronary ICU access.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              border: '1px solid #FCA5A5',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Activity size={20} color="#DC2626" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Acute Stroke &amp; Trauma Resuscitation
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Multidisciplinary resuscitation bays equipped for airway management, neurological evaluation, and surgical stabilization.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              border: '1px solid #FCA5A5',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Clock size={20} color="#DC2626" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>
                24/7 Blood Bank &amp; Diagnostic Lab
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Continuous availability of cross-matched blood components, urgent CT scanning, digital X-rays, and stat electrolyte panels.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

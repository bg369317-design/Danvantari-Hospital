import React from 'react';
import { HealthPackage } from '@/types/publicWebsite';
import { Check, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { DemoBadge } from '@/portals/public/components/DemoBadge';

interface HealthPackagesProps {
  packages: HealthPackage[];
  onSelectPackage?: (pkg: HealthPackage) => void;
}

export const HealthPackagesSection: React.FC<HealthPackagesProps> = ({
  packages,
  onSelectPackage,
}) => {
  return (
    <section
      id="packages"
      style={{
        padding: '4rem 1.5rem',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <DemoBadge label="Sample Diagnostic Packages" />
          </div>
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: 'var(--color-primary-dark)',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Preventative Health &amp; Wellness Screens
          </h2>
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '1rem',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Routine health evaluations aid in the early detection of cardiovascular, metabolic, and chronic conditions. Choose a curated health check-up package suited for you and your family.
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
            alignItems: 'stretch',
          }}
        >
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: pkg.isPopular
                  ? '2px solid var(--color-teal)'
                  : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: pkg.isPopular ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              }}
            >
              {pkg.isPopular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--color-teal)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.25rem 1rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Sparkles size={13} />
                  <span>Most Recommended</span>
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {pkg.category}
                </span>
                <h3
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginTop: '0.25rem',
                    lineHeight: 1.3,
                  }}
                >
                  {pkg.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  {pkg.targetAudience}
                </p>
              </div>

              {/* Price / Estimate Note */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  {pkg.priceNote}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                  Includes <strong>{pkg.testsIncludedCount} Core Parameters</strong> &amp; Doctor Review
                </div>
              </div>

              {/* Tests Included */}
              <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                <h4
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Key Parameters Tested:
                </h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {pkg.featuredTests.map((test, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        fontSize: '0.825rem',
                        color: 'var(--color-text)',
                        marginBottom: '0.5rem',
                        lineHeight: 1.4,
                      }}
                    >
                      <Check size={16} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{test}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fasting & Report turnaround */}
              <div
                style={{
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '1rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <AlertCircle size={14} color="#D97706" />
                  <span>
                    {pkg.fastingRequired
                      ? 'Requires 10–12 hours overnight fasting'
                      : 'No fasting required'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} color="var(--color-teal)" />
                  <span>Turnaround: {pkg.reportingTime}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectPackage?.(pkg)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: pkg.isPopular
                    ? 'var(--color-teal)'
                    : 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                Inquire &amp; Book Package
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

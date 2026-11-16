import React, { useState } from 'react';
import { HospitalBranch } from '@/types/publicWebsite';
import { MapPin, Phone, Clock, AlertTriangle, Building, CheckCircle2 } from 'lucide-react';
import { DemoBadge } from '@/portals/public/components/DemoBadge';

interface BranchSelectorProps {
  branches: HospitalBranch[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
}

export const BranchDirectorySection: React.FC<BranchSelectorProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
}) => {
  const [activeTabBranchId, setActiveTabBranchId] = useState<string>(selectedBranchId);

  const activeBranch =
    branches.find((b) => b.id === activeTabBranchId) ?? branches[0];

  const handleSelectActiveBranch = (branchId: string) => {
    setActiveTabBranchId(branchId);
    onSelectBranch(branchId);
  };

  return (
    <section
      id="branches"
      style={{
        padding: '3.5rem 1.5rem',
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <DemoBadge label="Sample Branch Data – Pending Confirmation" />
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
            Hospital Branches &amp; Medical Centers
          </h2>
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '1rem',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Explore our network of multi-specialty hospital campuses, outpatient centers, and 24/7 emergency facilities. Select your preferred branch to personalize your experience.
          </p>
        </div>

        {/* Branch Selection Pills */}
        <div
          role="tablist"
          aria-label="Hospital Branches"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          {branches.map((branch) => {
            const isSelected = branch.id === activeTabBranchId;
            return (
              <button
                key={branch.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectActiveBranch(branch.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  backgroundColor: isSelected
                    ? 'var(--color-primary)'
                    : 'var(--color-bg)',
                  color: isSelected ? '#FFFFFF' : 'var(--color-text)',
                  border: isSelected
                    ? '1px solid var(--color-primary)'
                    : '1px solid var(--color-border)',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Building size={16} />
                <span>{branch.name.replace(' (Sample Location)', '')}</span>
                {isSelected && <CheckCircle2 size={16} color="#A7F3D0" />}
              </button>
            );
          })}
        </div>

        {/* Selected Branch Detail Card */}
        {activeBranch && (
          <div
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <h3
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: 'var(--color-primary-dark)',
                    }}
                  >
                    {activeBranch.name}
                  </h3>
                  {activeBranch.isMainCampus && (
                    <span
                      style={{
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      Headquarters
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--color-teal)', fontSize: '0.85rem', fontWeight: 600 }}>
                  {activeBranch.statusNote}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  color: 'var(--color-primary-dark)',
                  fontWeight: 600,
                }}
              >
                Facility Capacity: {activeBranch.bedCount}
              </div>
            </div>

            {/* Information Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <MapPin size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                      Campus Location
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', marginTop: '0.2rem' }}>
                      {activeBranch.address}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600 }}>
                      (Address Pending Official Confirmation)
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Clock size={18} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                      Operating Timings
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', marginTop: '0.2rem' }}>
                      {activeBranch.operatingHours}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                      {activeBranch.emergencyHours}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Phone size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                      Telephone Enquiries
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', marginTop: '0.2rem' }}>
                      {activeBranch.phone}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Email: {activeBranch.email}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem 1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991B1B' }}>
                    <AlertTriangle size={18} color="#DC2626" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>24/7 Emergency Casualty Desk</span>
                  </div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#DC2626', marginTop: '0.25rem' }}>
                    {activeBranch.emergencyPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

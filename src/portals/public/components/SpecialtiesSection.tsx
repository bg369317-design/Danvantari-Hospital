import React, { useState } from 'react';
import { MedicalSpecialty } from '@/types/publicWebsite';
import {
  Heart,
  Brain,
  Activity,
  Baby,
  Stethoscope,
  Shield,
  CheckCircle,
  ChevronRight,
  Info,
} from 'lucide-react';
import { DemoBadge } from '@/portals/public/components/DemoBadge';

interface SpecialtiesSectionProps {
  specialties: MedicalSpecialty[];
  onSelectSpecialtyForSearch?: (specialtyId: string) => void;
}

export const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({
  specialties,
  onSelectSpecialtyForSearch,
}) => {
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);

  const getSpecialtyIcon = (iconName: string) => {
    switch (iconName) {
      case 'heart':
        return <Heart size={24} color="#0F52BA" />;
      case 'brain':
        return <Brain size={24} color="#6366F1" />;
      case 'bone':
        return <Activity size={24} color="#0D9488" />;
      case 'baby':
        return <Baby size={24} color="#EC4899" />;
      case 'stethoscope':
        return <Stethoscope size={24} color="#0F52BA" />;
      case 'shield':
        return <Shield size={24} color="#DC2626" />;
      default:
        return <Activity size={24} color="#0D9488" />;
    }
  };

  return (
    <section
      id="specialties"
      style={{
        padding: '4rem 1.5rem',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <DemoBadge label="Clinical Departments – Sample Information" />
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
            Medical Specialties &amp; Centers of Excellence
          </h2>
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '1rem',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Providing patient-centered outpatient, surgical, and therapeutic medical disciplines managed by experienced medical consultants.
          </p>
        </div>

        {/* Specialties Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {specialties.map((spec) => {
            const isExpanded = selectedSpecialtyId === spec.id;
            return (
              <div
                key={spec.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: isExpanded
                    ? '2px solid var(--color-primary)'
                    : '1px solid var(--color-border)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getSpecialtyIcon(spec.iconName)}
                  </div>
                  <DemoBadge label="Sample Department" variant="subtle" />
                </div>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {spec.name}
                </h3>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    flex: 1,
                  }}
                >
                  {spec.summary}
                </p>

                {/* Key Services List */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--color-primary)',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Key Clinical Services:
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {spec.keyServices.slice(0, 3).map((service, index) => (
                      <li
                        key={index}
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--color-text)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          marginBottom: '0.35rem',
                        }}
                      >
                        <CheckCircle size={13} color="var(--color-teal)" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '1rem',
                    marginTop: 'auto',
                  }}
                >
                  <button
                    onClick={() =>
                      setSelectedSpecialtyId(isExpanded ? null : spec.id)
                    }
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--color-teal)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <Info size={14} />
                    <span>{isExpanded ? 'Hide Details' : 'View Scope'}</span>
                  </button>

                  {onSelectSpecialtyForSearch && (
                    <button
                      onClick={() => onSelectSpecialtyForSearch(spec.id)}
                      style={{
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary-dark)',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <span>Find Doctors</span>
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: 'var(--color-bg)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <p style={{ color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                      {spec.detailedDescription}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      <strong>Department Lead:</strong> {spec.headOfDepartment}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

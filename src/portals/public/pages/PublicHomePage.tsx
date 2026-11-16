import React, { useState } from 'react';
import {
  SAMPLE_BRANCHES,
  SAMPLE_SPECIALTIES,
  SAMPLE_DOCTORS,
  SAMPLE_HEALTH_PACKAGES,
} from '@/config/publicSampleData';
import { PublicNavigation } from '@/portals/public/components/PublicNavigation';
import { BranchDirectorySection } from '@/portals/public/components/BranchDirectorySection';
import { SpecialtiesSection } from '@/portals/public/components/SpecialtiesSection';
import { FindDoctorSection } from '@/portals/public/components/FindDoctorSection';
import { HealthPackagesSection } from '@/portals/public/components/HealthPackagesSection';
import { AppointmentBookingSection } from '@/portals/public/components/AppointmentBookingSection';
import { EmergencySection } from '@/portals/public/components/EmergencySection';
import { ContactSection } from '@/portals/public/components/ContactSection';
import { DemoBadge } from '@/portals/public/components/DemoBadge';
import { DoctorProfile, HealthPackage } from '@/types/publicWebsite';
import {
  ShieldCheck,
  Calendar,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';

interface PublicHomePageProps {
  onSelectPortal?: (portal: 'patient' | 'doctor' | 'admin') => void;
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({ onSelectPortal }) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('branch-central');
  const [activeSpecialtyForFilter, setActiveSpecialtyForFilter] = useState<string | null>(null);
  const [bookingDoctorId, setBookingDoctorId] = useState<string | null>(null);

  const selectedBranch =
    SAMPLE_BRANCHES.find((b) => b.id === selectedBranchId) ?? SAMPLE_BRANCHES[0];

  const handleBookDoctor = (doc: DoctorProfile) => {
    setBookingDoctorId(doc.id);
    setSelectedBranchId(doc.primaryBranchId);
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPackage = (_pkg: HealthPackage) => {
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSpecialtyFilter = (specialtyId: string) => {
    setActiveSpecialtyForFilter(specialtyId);
    const docEl = document.getElementById('doctors');
    if (docEl) {
      docEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Demo Banner Indicator */}
      <DemoBadge variant="banner" />

      {/* Responsive Public Website Navigation */}
      <PublicNavigation
        branches={SAMPLE_BRANCHES}
        selectedBranchId={selectedBranchId}
        onSelectBranch={setSelectedBranchId}
        onNavigatePortal={(p) => onSelectPortal?.(p)}
      />

      {/* 1. Hero Section */}
      <section
        id="overview"
        style={{
          background: 'linear-gradient(135deg, #0A387E 0%, #0F52BA 60%, #0D9488 100%)',
          color: '#FFFFFF',
          padding: '4.5rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.825rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <ShieldCheck size={16} color="#A7F3D0" />
            <span>Healthcare Platform Architecture &amp; Clinical Management Prototype</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Hero Left: Value Proposition */}
            <div>
              <h1
                style={{
                  fontSize: '2.75rem',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.25rem',
                }}
              >
                Danvantari Hospital
              </h1>
              <p
                style={{
                  fontSize: '1.25rem',
                  color: '#A5F3FC',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                Advancing Clinical Excellence &amp; Compassionate Healing
              </p>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: '560px',
                  marginBottom: '2rem',
                }}
              >
                A unified multi-specialty healthcare network providing compassionate
                inpatient and outpatient medical services, round-the-clock emergency
                trauma response, certified clinical consultants, and modern diagnostic
                imaging.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="#booking"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-primary-dark)',
                    padding: '0.8rem 1.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <Calendar size={18} color="var(--color-primary)" />
                  <span>Book Consultation</span>
                </a>

                <a
                  href="#emergency"
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    padding: '0.8rem 1.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <PhoneCall size={18} />
                  <span>Emergency Info (Demo)</span>
                </a>
              </div>
            </div>

            {/* Hero Right: Selected Branch Overview Card */}
            <div>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#A5F3FC',
                    }}
                  >
                    Campus Highlights (Sample)
                  </span>
                  <DemoBadge label="Demonstration" variant="subtle" />
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  {selectedBranch?.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '1.25rem' }}>
                  {selectedBranch?.address}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    paddingTop: '1.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#93C5FD' }}>
                      Inpatient Capacity
                    </span>
                    <strong>{selectedBranch?.bedCount}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#93C5FD' }}>
                      Emergency Operations
                    </span>
                    <strong>24 Hours Continuous</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#93C5FD' }}>
                      OPD Consulting
                    </span>
                    <strong>Mon – Sat (08:00 AM – 08:00 PM)</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#93C5FD' }}>
                      Specialties Available
                    </span>
                    <strong>6 Medical Disciplines</strong>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <a
                    href="#branches"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#A5F3FC',
                      textDecoration: 'underline',
                    }}
                  >
                    <span>View All 3 Hospital Campuses</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hospital Introduction & Key Metrics Overview */}
      <section
        style={{
          padding: '3.5rem 1.5rem',
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                About Danvantari Hospital
              </span>
              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--color-primary-dark)',
                  letterSpacing: '-0.02em',
                  marginBottom: '1rem',
                  lineHeight: 1.25,
                }}
              >
                A Legacy of Healthcare Dedicated to Every Patient
              </h2>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  marginBottom: '1rem',
                }}
              >
                Danvantari Hospital is envisioned as a multi-tier clinical institution
                offering tertiary medical services, evidence-based therapies, and
                patient-centered outpatient care. We aim to integrate clinical expertise
                with responsive digital healthcare experiences.
              </p>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}
              >
                From maternal and pediatric wellness to interventional cardiology and
                acute trauma management, our departments work collaboratively under
                stringent safety and clinical auditing protocols.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                  3
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  Sample Campuses
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Central, North &amp; South
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-teal)' }}>
                  6
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  Sample Specialties
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Cardiology, Ortho, Neuro+
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary-dark)' }}>
                  600
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  Fictional Bed Capacity
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Demonstration Estimate
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#DC2626' }}>
                  24/7
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  Casualty Workflow
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Non-operational Demo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Hospital Branch Directory with Selection */}
      <BranchDirectorySection
        branches={SAMPLE_BRANCHES}
        selectedBranchId={selectedBranchId}
        onSelectBranch={setSelectedBranchId}
      />

      {/* 4. Medical Specialties & Centers of Excellence */}
      <SpecialtiesSection
        specialties={SAMPLE_SPECIALTIES}
        onSelectSpecialtyForSearch={handleSpecialtyFilter}
      />

      {/* 5 & 6. Find a Doctor Search & Doctor Cards */}
      <FindDoctorSection
        doctors={SAMPLE_DOCTORS}
        branches={SAMPLE_BRANCHES}
        specialties={SAMPLE_SPECIALTIES}
        initialSpecialtyId={activeSpecialtyForFilter}
        onBookDoctor={handleBookDoctor}
      />

      {/* 7. Health Check-up Packages */}
      <HealthPackagesSection
        packages={SAMPLE_HEALTH_PACKAGES}
        onSelectPackage={handleSelectPackage}
      />

      {/* 8. Appointment Booking Entry Point */}
      <AppointmentBookingSection
        branches={SAMPLE_BRANCHES}
        specialties={SAMPLE_SPECIALTIES}
        doctors={SAMPLE_DOCTORS}
        preselectedDoctorId={bookingDoctorId}
        preselectedBranchId={selectedBranchId}
      />

      {/* 9. Emergency and Critical Care Information */}
      <EmergencySection
        branches={SAMPLE_BRANCHES}
        selectedBranchId={selectedBranchId}
      />

      {/* 10. Contact Form & Branch Location Section */}
      <ContactSection
        branches={SAMPLE_BRANCHES}
        selectedBranchId={selectedBranchId}
      />
    </div>
  );
};

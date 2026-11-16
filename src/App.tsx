import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { PublicHomePage } from '@/portals/public/pages/PublicHomePage';
import { PatientPortalView } from '@/portals/patient/pages/PatientPortalView';
import { DoctorPortalView } from '@/portals/doctor/pages/DoctorPortalView';
import { AdminPortalView } from '@/portals/admin/pages/AdminPortalView';
import { LoadingPlaceholder } from '@/components/feedback/LoadingPlaceholder';
import { ErrorPlaceholder } from '@/components/feedback/ErrorPlaceholder';
import { NotFoundPlaceholder } from '@/components/feedback/NotFoundPlaceholder';
import { APP_CONFIG } from '@/config/app.config';
import {
  Globe,
  HeartPulse,
  Stethoscope,
  ShieldCheck,
  Building2,
} from 'lucide-react';

type ActiveTab =
  | 'overview'
  | 'public'
  | 'patient'
  | 'doctor'
  | 'admin'
  | 'demo-loading'
  | 'demo-error'
  | 'demo-notfound';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const portalDescriptor = {
    overview: 'Platform Overview',
    public: 'Public Website',
    patient: 'Patient Portal',
    doctor: 'Doctor Portal',
    admin: 'Admin Portal',
    'demo-loading': 'Placeholder Preview: Loading',
    'demo-error': 'Placeholder Preview: Error',
    'demo-notfound': 'Placeholder Preview: 404',
  }[activeTab];

  const isPublicActive = activeTab === 'public';

  return (
    <MainLayout
      activePortal={portalDescriptor}
      hideHospitalHeader={isPublicActive}
    >
      {/* Portal Switcher & Clinical Context Navigation Bar */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          padding: '0.75rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Main 4 Portals */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor:
                  activeTab === 'overview'
                    ? 'var(--color-primary)'
                    : 'transparent',
                color: activeTab === 'overview' ? '#FFFFFF' : 'var(--color-text)',
                transition: 'all 0.15s ease',
              }}
            >
              <Building2 size={16} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('public')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor:
                  activeTab === 'public'
                    ? 'var(--color-primary)'
                    : 'transparent',
                color: activeTab === 'public' ? '#FFFFFF' : 'var(--color-text)',
              }}
            >
              <Globe size={16} />
              <span>Public Website</span>
            </button>

            <button
              onClick={() => setActiveTab('patient')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor:
                  activeTab === 'patient'
                    ? 'var(--color-primary)'
                    : 'transparent',
                color: activeTab === 'patient' ? '#FFFFFF' : 'var(--color-text)',
              }}
            >
              <HeartPulse size={16} />
              <span>Patient Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('doctor')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor:
                  activeTab === 'doctor'
                    ? 'var(--color-teal)'
                    : 'transparent',
                color: activeTab === 'doctor' ? '#FFFFFF' : 'var(--color-text)',
              }}
            >
              <Stethoscope size={16} />
              <span>Doctor Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor:
                  activeTab === 'admin' ? '#0F172A' : 'transparent',
                color: activeTab === 'admin' ? '#FFFFFF' : 'var(--color-text)',
              }}
            >
              <ShieldCheck size={16} />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Placeholders preview switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--color-bg)',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
              State Previews:
            </span>
            <button
              onClick={() => setActiveTab('demo-loading')}
              style={{
                padding: '0.2rem 0.45rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: activeTab === 'demo-loading' ? 600 : 400,
                color:
                  activeTab === 'demo-loading'
                    ? 'var(--color-primary)'
                    : 'var(--color-text-muted)',
              }}
            >
              Loading
            </button>
            <span style={{ color: 'var(--color-border)' }}>|</span>
            <button
              onClick={() => setActiveTab('demo-error')}
              style={{
                padding: '0.2rem 0.45rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: activeTab === 'demo-error' ? 600 : 400,
                color:
                  activeTab === 'demo-error'
                    ? 'var(--color-error)'
                    : 'var(--color-text-muted)',
              }}
            >
              Error
            </button>
            <span style={{ color: 'var(--color-border)' }}>|</span>
            <button
              onClick={() => setActiveTab('demo-notfound')}
              style={{
                padding: '0.2rem 0.45rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: activeTab === 'demo-notfound' ? 600 : 400,
                color:
                  activeTab === 'demo-notfound'
                    ? 'var(--color-teal)'
                    : 'var(--color-text-muted)',
              }}
            >
              404
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      {activeTab === 'overview' && (
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '2.5rem 1.5rem',
          }}
        >
          {/* Main Hero Header */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '3rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                padding: '0.35rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1rem',
                border: '1px solid #BFDBFE',
              }}
            >
              <Building2 size={16} />
              <span>Phase 1 Foundation Ready</span>
            </div>
            <h1
              style={{
                fontSize: '2.75rem',
                fontWeight: 800,
                color: 'var(--color-primary-dark)',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                marginBottom: '0.75rem',
              }}
            >
              {APP_CONFIG.name}
            </h1>
            <p
              style={{
                fontSize: '1.25rem',
                color: 'var(--color-teal)',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {APP_CONFIG.platformName}
            </p>
            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '1rem',
                maxWidth: '680px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Unified healthcare management architecture supporting clinical care,
              patient records, administrative operations, and public hospital
              information.
            </p>
          </div>

          {/* Four Core Experience Portals Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}
          >
            {/* Card 1: Public Website */}
            <div
              onClick={() => setActiveTab('public')}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Globe size={24} />
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: '0.5rem',
                }}
              >
                Public Website
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
                Information for patients, visitors, and families. Features clinical
                specialties, department directory, doctor finder, and emergency contacts.
              </p>
              <span
                style={{
                  color: 'var(--color-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                Explore Public Site &rarr;
              </span>
            </div>

            {/* Card 2: Patient Portal */}
            <div
              onClick={() => setActiveTab('patient')}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <HeartPulse size={24} />
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: '0.5rem',
                }}
              >
                Patient Portal
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
                Secure portal for patients to view medical records, consult
                history, laboratory results, prescriptions, and manage doctor
                appointments.
              </p>
              <span
                style={{
                  color: 'var(--color-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                Open Patient Portal &rarr;
              </span>
            </div>

            {/* Card 3: Doctor Portal */}
            <div
              onClick={() => setActiveTab('doctor')}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-teal)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-teal-light)',
                  color: 'var(--color-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Stethoscope size={24} />
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: '0.5rem',
                }}
              >
                Doctor Portal
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
                Clinical workstation for physicians and nurses. OPD consultation
                queue, EHR charting, diagnostic orders, and electronic prescriptions.
              </p>
              <span
                style={{
                  color: 'var(--color-teal)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                Open Doctor Portal &rarr;
              </span>
            </div>

            {/* Card 4: Admin Portal */}
            <div
              onClick={() => setActiveTab('admin')}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#0F172A';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: '0.5rem',
                }}
              >
                Admin Portal
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
                Administrative console for hospital operations, department rosters,
                ward bed allocations, staff access roles, and audit compliance logs.
              </p>
              <span
                style={{
                  color: '#B45309',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                Open Admin Portal &rarr;
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'public' && (
        <PublicHomePage
          onSelectPortal={(portal) => setActiveTab(portal)}
        />
      )}

      {activeTab === 'patient' && (
        <PatientPortalView onExitToPublic={() => setActiveTab('public')} />
      )}

      {activeTab === 'doctor' && (
        <DoctorPortalView onExitToPublic={() => setActiveTab('public')} />
      )}

      {activeTab === 'admin' && <AdminPortalView />}

      {activeTab === 'demo-loading' && (
        <LoadingPlaceholder
          message="Simulating Patient Record Retrieval..."
          subtext="Fetching clinical appointments from secure Supabase backend"
        />
      )}

      {activeTab === 'demo-error' && (
        <ErrorPlaceholder
          title="Diagnostic Services Unavailable"
          message="Could not establish connection to the clinical laboratory system. Please check system network."
          onRetry={() => setActiveTab('overview')}
        />
      )}

      {activeTab === 'demo-notfound' && (
        <NotFoundPlaceholder
          portalName="Requested Medical Record"
          onNavigateHome={() => setActiveTab('overview')}
        />
      )}
    </MainLayout>
  );
};

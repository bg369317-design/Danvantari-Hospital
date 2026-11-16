import React from 'react';
import { PatientTab } from '@/types/patientPortal';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarPlus,
  FileText,
  FlaskConical,
  Pill,
  CreditCard,
  MessageSquare,
  HelpCircle,
  User,
  X,
  Building,
} from 'lucide-react';

interface PatientSidebarProps {
  activeTab: PatientTab;
  onSelectTab: (tab: PatientTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const PatientSidebar: React.FC<PatientSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
}) => {
  const navItems: { id: PatientTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'appointments', label: 'My Appointments', icon: <CalendarCheck size={18} /> },
    { id: 'book', label: 'Book Appointment', icon: <CalendarPlus size={18} /> },
    { id: 'records', label: 'Medical Records', icon: <FileText size={18} /> },
    { id: 'labs', label: 'Lab Reports', icon: <FlaskConical size={18} /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: <Pill size={18} /> },
    { id: 'billing', label: 'Billing & Payments', icon: <CreditCard size={18} /> },
    { id: 'second-opinion', label: 'Second Opinion', icon: <HelpCircle size={18} /> },
    { id: 'messages', label: 'Messages & Support', icon: <MessageSquare size={18} /> },
    { id: 'profile', label: 'Profile & Settings', icon: <User size={18} /> },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            zIndex: 40,
            backdropFilter: 'blur(2px)',
          }}
          className="sidebar-backdrop"
        />
      )}

      {/* Main Patient Sidebar Container */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          position: 'relative',
          zIndex: 45,
          flexShrink: 0,
        }}
        className={`patient-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        {/* Patient Portal Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}
            >
              +
            </div>
            <div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: 'var(--color-primary-dark)',
                  lineHeight: 1.1,
                }}
              >
                Danvantari
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--color-teal)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Patient Portal
              </div>
            </div>
          </div>

          {/* Close mobile button */}
          <button
            onClick={onCloseMobile}
            aria-label="Close navigation sidebar"
            className="mobile-close-btn"
            style={{
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-muted)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Demo Indicator Notice in Sidebar */}
        <div
          style={{
            margin: '0.75rem 1rem',
            padding: '0.45rem 0.75rem',
            backgroundColor: '#EFF6FF',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #BFDBFE',
            fontSize: '0.72rem',
            color: 'var(--color-primary-dark)',
            lineHeight: 1.35,
          }}
        >
          <strong>Patient Workspace:</strong> Synthetic demo account for UI review.
        </div>

        {/* Navigation Item List */}
        <nav
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            overflowY: 'auto',
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  textAlign: 'left',
                  backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                  borderLeft: isActive
                    ? '3px solid var(--color-primary)'
                    : '3px solid transparent',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <span
                  style={{
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Hospital Branch Indication */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Building size={16} color="var(--color-teal)" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>Central Campus</div>
            <div>Primary Medical Facility</div>
          </div>
        </div>
      </aside>
    </>
  );
};

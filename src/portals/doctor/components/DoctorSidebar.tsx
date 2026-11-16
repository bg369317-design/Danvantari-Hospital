import React from 'react';
import { DoctorTab } from '@/types/doctorPortal';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Stethoscope,
  Pill,
  FlaskConical,
  Activity,
  Share2,
  Clock,
  MessageSquare,
  User,
  X,
  ShieldCheck,
} from 'lucide-react';

interface DoctorSidebarProps {
  activeTab: DoctorTab;
  onSelectTab: (tab: DoctorTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  queueWaitingCount: number;
  unreadLabCount: number;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
  queueWaitingCount,
  unreadLabCount,
}) => {
  const navItems: {
    id: DoctorTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | undefined;
    badgeColor?: string | undefined;
  }[] = [
    { id: 'dashboard', label: 'Clinical Dashboard', icon: <LayoutDashboard size={18} /> },
    {
      id: 'queue',
      label: 'OPD Patient Queue',
      icon: <Users size={18} />,
      badge: queueWaitingCount > 0 ? queueWaitingCount : undefined,
      badgeColor: '#0F52BA',
    },
    { id: 'appointments', label: 'Appointment Schedule', icon: <Calendar size={18} /> },
    { id: 'records', label: 'Patient Medical Charts', icon: <FileText size={18} /> },
    { id: 'consultation-notes', label: 'SOAP Consultation Notes', icon: <Stethoscope size={18} /> },
    { id: 'prescriptions', label: 'Prescription Orders', icon: <Pill size={18} /> },
    { id: 'diagnostic-orders', label: 'Diagnostic Orders', icon: <FlaskConical size={18} /> },
    {
      id: 'lab-results',
      label: 'Lab & Diagnostic Results',
      icon: <Activity size={18} />,
      badge: unreadLabCount > 0 ? unreadLabCount : undefined,
      badgeColor: '#D97706',
    },
    { id: 'referrals', label: 'Specialist Referrals', icon: <Share2 size={18} /> },
    { id: 'roster', label: 'Roster & On-Call Duty', icon: <Clock size={18} /> },
    { id: 'messages', label: 'Patient Inquiries', icon: <MessageSquare size={18} /> },
    { id: 'profile', label: 'Physician Profile', icon: <User size={18} /> },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 40,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          zIndex: 50,
          transition: 'transform 0.25s ease',
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
        className={`doctor-sidebar ${isOpen ? 'open' : ''}`}
      >
        {/* Top Doctor Portal Brand Strip */}
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
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.15rem',
                flexShrink: 0,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              +
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                DANVANTARI
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-teal)', fontWeight: 700, letterSpacing: '0.5px' }}>
                PHYSICIAN PORTAL
              </div>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'none',
            }}
            className="mobile-close-btn"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items List */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
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
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                  border: 'none',
                  borderLeft: isActive ? '3.5px solid var(--color-primary)' : '3.5px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ color: isActive ? 'var(--color-primary)' : '#64748B' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    style={{
                      backgroundColor: item.badgeColor || 'var(--color-primary)',
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '9999px',
                      minWidth: '18px',
                      textAlign: 'center',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Clinical Notice Strip */}
        <div
          style={{
            padding: '0.85rem 1rem',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: '#F8FAFC',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <ShieldCheck size={16} color="var(--color-teal)" style={{ flexShrink: 0 }} />
          <span>Fictional Demonstration EHR • Non-Clinical Simulation</span>
        </div>
      </aside>

      <style>{`
        @media (max-width: 1023px) {
          .doctor-sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
          }
          .doctor-sidebar.open {
            transform: translateX(0);
          }
          .mobile-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};

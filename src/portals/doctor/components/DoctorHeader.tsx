import React, { useState, useRef, useEffect } from 'react';
import {
  DoctorProfileData,
  DoctorNotification,
  DoctorTab,
} from '@/types/doctorPortal';
import { HospitalBranch } from '@/types/publicWebsite';
import {
  Menu,
  Bell,
  Search,
  Building2,
  CheckCircle2,
  AlertCircle,
  User,
  LogOut,
  Calendar,
  CheckCheck,
} from 'lucide-react';

interface DoctorHeaderProps {
  doctor: DoctorProfileData;
  branches: HospitalBranch[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  notifications: DoctorNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onOpenMobileSidebar: () => void;
  onNavigateTab: (tab: DoctorTab) => void;
  onExitPortal?: (() => void) | undefined;
  onSearchPatient?: ((query: string) => void) | undefined;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({
  doctor,
  branches,
  selectedBranchId,
  onSelectBranch,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onOpenMobileSidebar,
  onNavigateTab,
  onExitPortal,
  onSearchPatient,
}) => {
  const [notifDropdownOpen, setNotifDropdownOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const notifBoxRef = useRef<HTMLDivElement>(null);
  const profileBoxRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifBoxRef.current && !notifBoxRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileBoxRef.current && !profileBoxRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchPatient && searchQuery.trim()) {
      onSearchPatient(searchQuery.trim());
      onNavigateTab('records');
    }
  };

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      <div
        style={{
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Mobile hamburger & Doctor Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onOpenMobileSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
            }}
            aria-label="Open clinical navigation"
          >
            <Menu size={22} />
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-primary-dark)' }}>
                {doctor.fullName}
              </span>
              <span
                style={{
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#16A34A',
                  }}
                />
                <span>On OPD Duty</span>
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {doctor.specialtyName} • {branches.length} Assigned {branches.length === 1 ? 'Branch' : 'Branches'}
            </div>
          </div>
        </div>

        {/* Center: Branch Selector & Patient Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flex: '1',
            maxWidth: '580px',
            minWidth: '260px',
          }}
        >
          {/* Branch Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Building2 size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <select
              value={selectedBranchId}
              onChange={(e) => onSelectBranch(e.target.value)}
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--color-primary-dark)',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.6rem',
                cursor: 'pointer',
                maxWidth: '180px',
              }}
            >
              <option value="all">
                All Assigned Branches ({branches.length})
              </option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name.replace(' (Demonstration Facility)', '')}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search patient chart by name or UHID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: '#F8FAFC',
                color: 'var(--color-text)',
                boxSizing: 'border-box',
              }}
            />
            <Search
              size={14}
              color="#94A3B8"
              style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </form>
        </div>

        {/* Right: Notifications & Physician Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Notification Bell */}
          <div style={{ position: 'relative' }} ref={notifBoxRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              style={{
                background: '#F8FAFC',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: unreadNotifs.length > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
              }}
              aria-label={`Doctor alerts, ${unreadNotifs.length} unread`}
            >
              <Bell size={18} />
              {unreadNotifs.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '320px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: '#F8FAFC',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary-dark)' }}>
                    Clinical Alerts &amp; Updates
                  </span>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={onMarkAllNotificationsAsRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontSize: '0.725rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <CheckCheck size={14} />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.8rem' }}>
                      No active alerts
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          onMarkNotificationAsRead(notif.id);
                          onNavigateTab(notif.targetTab);
                          setNotifDropdownOpen(false);
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid #F1F5F9',
                          cursor: 'pointer',
                          backgroundColor: notif.isRead ? '#FFFFFF' : '#EFF6FF',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          {notif.type === 'critical_lab' ? (
                            <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                          ) : (
                            <CheckCircle2 size={16} color="#0F52BA" style={{ flexShrink: 0, marginTop: '2px' }} />
                          )}
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: notif.isRead ? 600 : 700, color: '#0F172A' }}>
                              {notif.title}
                            </div>
                            <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '0.15rem' }}>
                              {notif.description}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                              {notif.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Doctor Profile Menu */}
          <div style={{ position: 'relative' }} ref={profileBoxRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#F8FAFC',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.35rem 0.65rem',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                AS
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)' }}>
                Dr. Sharma
              </span>
            </button>

            {profileDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '220px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary-dark)' }}>
                    {doctor.fullName}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
                    Senior Cardiologist
                  </div>
                </div>

                <div style={{ padding: '0.35rem 0' }}>
                  <button
                    onClick={() => {
                      onNavigateTab('profile');
                      setProfileDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.55rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                      border: 'none',
                      background: 'none',
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <User size={15} />
                    <span>View Profile &amp; Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateTab('roster');
                      setProfileDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.55rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                      border: 'none',
                      background: 'none',
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Calendar size={15} />
                    <span>Duty Roster &amp; Availability</span>
                  </button>

                  {onExitPortal && (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onExitPortal();
                      }}
                      style={{
                        width: '100%',
                        padding: '0.55rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.8rem',
                        border: 'none',
                        borderTop: '1px solid var(--color-border)',
                        background: 'none',
                        color: '#B91C1C',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={15} />
                      <span>Switch to Overview</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

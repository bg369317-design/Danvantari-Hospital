import React, { useState, useRef, useEffect } from 'react';
import {
  PatientProfile,
  InAppNotification,
  PatientTab,
  SearchResultItem,
} from '@/types/patientPortal';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Calendar,
  X,
  CheckCheck,
  FileText,
  FlaskConical,
  Pill,
  CreditCard,
  Stethoscope,
} from 'lucide-react';

interface PatientHeaderProps {
  profile: PatientProfile;
  notifications: InAppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onOpenMobileSidebar: () => void;
  onNavigateTab: (tab: PatientTab) => void;
  onSelectSearchResult: (result: SearchResultItem) => void;
  allSearchableRecords: SearchResultItem[];
  onExitPortal?: (() => void) | undefined;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  profile,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onOpenMobileSidebar,
  onNavigateTab,
  onSelectSearchResult,
  allSearchableRecords,
  onExitPortal,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchValidationMessage, setSearchValidationMessage] = useState<string | null>(null);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const notifBoxRef = useRef<HTMLDivElement>(null);
  const profileBoxRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Handle Search input
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const trimmed = query.trim();

    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchValidationMessage(null);
      return;
    }

    setIsSearching(true);
    setSearchValidationMessage(null);

    const normalized = trimmed.toUpperCase();
    const matched = allSearchableRecords.filter((record) => {
      const refMatch = record.referenceNumber.toUpperCase().includes(normalized);
      const titleMatch = record.title.toUpperCase().includes(normalized);
      const catMatch = record.category.toUpperCase().includes(normalized);
      return refMatch || titleMatch || catMatch;
    });

    setSearchResults(matched);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setSearchValidationMessage(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchValidationMessage('Please enter an appointment code, lab accession ID, invoice number or medical record reference.');
      setIsSearching(true);
      return;
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
      if (notifBoxRef.current && !notifBoxRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileBoxRef.current && !profileBoxRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'Appointment':
        return <Calendar size={14} color="var(--color-primary)" />;
      case 'Lab Report':
        return <FlaskConical size={14} color="var(--color-teal)" />;
      case 'Prescription':
        return <Pill size={14} color="#10B981" />;
      case 'Invoice':
        return <CreditCard size={14} color="#6366F1" />;
      case 'Medical Record':
      case 'External Record':
        return <FileText size={14} color="#D97706" />;
      case 'Second Opinion':
        return <Stethoscope size={14} color="#8B5CF6" />;
      default:
        return <FileText size={14} />;
    }
  };

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Left: Mobile Sidebar Trigger & Reference Search */}
      <div
        ref={searchBoxRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flex: 1,
          maxWidth: '520px',
          position: 'relative',
        }}
      >
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="patient-hamburger-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.45rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
          }}
        >
          <Menu size={20} />
        </button>

        {/* Global Reference & Keyword Search */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
          <Search
            size={16}
            color="var(--color-text-muted)"
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim()) setIsSearching(true);
            }}
            placeholder="Search by Ref # (e.g. APT-7819, LAB-9011, RX-4412, INV-8801)..."
            aria-label="Search patient records by reference number"
            style={{
              width: '100%',
              padding: '0.55rem 2.2rem 0.55rem 2.25rem',
              borderRadius: 'var(--radius-sm)',
              border: searchValidationMessage ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              fontSize: '0.85rem',
              outline: 'none',
              color: 'var(--color-text)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search query"
              style={{
                position: 'absolute',
                right: '0.65rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                padding: '0.2rem',
              }}
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Interactive Search Results Dropdown */}
        {isSearching && (
          <div
            style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '340px',
              overflowY: 'auto',
              zIndex: 60,
              padding: '0.5rem',
            }}
          >
            {searchValidationMessage ? (
              <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--color-error)' }}>
                {searchValidationMessage}
              </div>
            ) : searchResults.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>No matching record found</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                  No appointment, lab report, prescription or invoice matches &quot;{searchQuery}&quot;. Search only looks up your authorized records.
                </p>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    padding: '0.35rem 0.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Found {searchResults.length} matching records:
                </div>
                {searchResults.map((item) => (
                  <button
                    key={`${item.category}-${item.id}`}
                    onClick={() => {
                      onSelectSearchResult(item);
                      setIsSearching(false);
                      setSearchQuery('');
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'left',
                      backgroundColor: 'transparent',
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-text)' }}>
                          <span style={{ color: 'var(--color-primary)', marginRight: '0.4rem' }}>
                            [{item.referenceNumber}]
                          </span>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                          {item.category} • {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                      Open &rarr;
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: In-App Notifications & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* In-App Notifications Bell */}
        <div ref={notifBoxRef} style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileDropdownOpen(false);
            }}
            aria-label={`Notifications: ${unreadCount} unread`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text)',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '340px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.75rem',
                zIndex: 50,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--color-border)',
                  paddingBottom: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bell size={15} color="var(--color-primary)" />
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>In-App Notifications</h4>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsAsRead}
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--color-teal)',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                    }}
                  >
                    <CheckCheck size={12} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* In-app Disclaimer Strip */}
              <div
                style={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  padding: '0.35rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.68rem',
                  color: '#92400E',
                  marginBottom: '0.5rem',
                  lineHeight: 1.3,
                }}
              >
                <strong>Simulated Notices:</strong> Demo in-app events only. No external SMS or email sent.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    No notifications at this time.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationAsRead(notif.id);
                        onNavigateTab(notif.targetTab);
                        setNotificationsOpen(false);
                      }}
                      style={{
                        padding: '0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: notif.isRead ? 'transparent' : 'var(--color-primary-light)',
                        borderLeft: notif.isRead ? '3px solid transparent' : '3px solid var(--color-primary)',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: notif.isRead ? 600 : 800, color: 'var(--color-text)' }}>
                          {notif.title}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                          {notif.timestamp}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '0.15rem', lineHeight: 1.35 }}>
                        {notif.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Patient Profile Dropdown */}
        <div ref={profileBoxRef} style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              VJ
            </div>
            <div style={{ textAlign: 'left', display: 'none' }} className="patient-header-name">
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>
                {profile.fullName.split(' (')[0]}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                UHID: {profile.uhid.slice(0, 15)}...
              </div>
            </div>
            <ChevronDown size={14} color="var(--color-text-muted)" />
          </button>

          {profileDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '240px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                zIndex: 50,
              }}
            >
              <div
                style={{
                  padding: '0.75rem',
                  borderBottom: '1px solid var(--color-border)',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{profile.fullName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                  UHID: {profile.uhid}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                  Blood Group: {profile.bloodGroup}
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigateTab('profile');
                  setProfileDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  textAlign: 'left',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                }}
              >
                <User size={15} color="var(--color-primary)" />
                <span>My Profile &amp; Settings</span>
              </button>

              {onExitPortal && (
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onExitPortal();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.825rem',
                    textAlign: 'left',
                    color: 'var(--color-error)',
                    borderTop: '1px solid var(--color-border)',
                    marginTop: '0.25rem',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={15} />
                  <span>Exit to Public Hospital Website</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

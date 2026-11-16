import React, { useState } from 'react';
import {
  PatientTab,
  PatientProfile,
  InAppNotification,
  SearchResultItem,
} from '@/types/patientPortal';
import { PatientSidebar } from '@/portals/patient/components/PatientSidebar';
import { PatientHeader } from '@/portals/patient/components/PatientHeader';
import { PATIENT_DEMO_NOTICE } from '@/config/patientSampleData';
import { AlertCircle } from 'lucide-react';

interface PatientLayoutProps {
  children: React.ReactNode;
  activeTab: PatientTab;
  onSelectTab: (tab: PatientTab) => void;
  profile: PatientProfile;
  notifications: InAppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  allSearchableRecords: SearchResultItem[];
  onSelectSearchResult: (result: SearchResultItem) => void;
  onExitPortal?: (() => void) | undefined;
}

export const PatientLayout: React.FC<PatientLayoutProps> = ({
  children,
  activeTab,
  onSelectTab,
  profile,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  allSearchableRecords,
  onSelectSearchResult,
  onExitPortal,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        color: 'var(--color-text)',
      }}
    >
      {/* Patient Sidebar Navigation */}
      <PatientSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Patient Content Canvas */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Top Patient Header with Search and Profile */}
        <PatientHeader
          profile={profile}
          notifications={notifications}
          onMarkNotificationAsRead={onMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onNavigateTab={onSelectTab}
          onSelectSearchResult={onSelectSearchResult}
          allSearchableRecords={allSearchableRecords}
          onExitPortal={onExitPortal}
        />

        {/* Persistent Demo Warning Banner */}
        <div
          role="alert"
          style={{
            backgroundColor: '#EFF6FF',
            borderBottom: '1px solid #BFDBFE',
            padding: '0.4rem 1.5rem',
            fontSize: '0.78rem',
            color: 'var(--color-primary-dark)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={15} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <span>{PATIENT_DEMO_NOTICE.bannerText}</span>
        </div>

        {/* Main Routed Page Content */}
        <main
          style={{
            flex: 1,
            padding: '1.75rem',
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

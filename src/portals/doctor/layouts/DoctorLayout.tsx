import React, { useState } from 'react';
import {
  DoctorTab,
  DoctorProfileData,
  DoctorNotification,
} from '@/types/doctorPortal';
import { HospitalBranch } from '@/types/publicWebsite';
import { DoctorSidebar } from '../components/DoctorSidebar';
import { DoctorHeader } from '../components/DoctorHeader';
import { DOCTOR_DEMO_NOTICE } from '@/config/doctorSampleData';
import { ShieldCheck } from 'lucide-react';

interface DoctorLayoutProps {
  children: React.ReactNode;
  activeTab: DoctorTab;
  onSelectTab: (tab: DoctorTab) => void;
  doctor: DoctorProfileData;
  branches: HospitalBranch[];
  selectedBranchId: string;
  onSelectBranch: (branchId: string) => void;
  notifications: DoctorNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onExitPortal?: (() => void) | undefined;
  queueWaitingCount: number;
  unreadLabCount: number;
  onSearchPatient?: ((query: string) => void) | undefined;
}

export const DoctorLayout: React.FC<DoctorLayoutProps> = ({
  children,
  activeTab,
  onSelectTab,
  doctor,
  branches,
  selectedBranchId,
  onSelectBranch,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onExitPortal,
  queueWaitingCount,
  unreadLabCount,
  onSearchPatient,
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
      {/* Physician Left Navigation Sidebar */}
      <DoctorSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        queueWaitingCount={queueWaitingCount}
        unreadLabCount={unreadLabCount}
      />

      {/* Main Clinical Canvas */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Top Doctor Header */}
        <DoctorHeader
          doctor={doctor}
          branches={branches}
          selectedBranchId={selectedBranchId}
          onSelectBranch={onSelectBranch}
          notifications={notifications}
          onMarkNotificationAsRead={onMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onNavigateTab={onSelectTab}
          onExitPortal={onExitPortal}
          onSearchPatient={onSearchPatient}
        />

        {/* Persistent Demonstration Notice Banner */}
        <div
          role="alert"
          style={{
            backgroundColor: '#EFF6FF',
            borderBottom: '1px solid #BFDBFE',
            padding: '0.45rem 1.5rem',
            fontSize: '0.78rem',
            color: 'var(--color-primary-dark)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <ShieldCheck size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <span>{DOCTOR_DEMO_NOTICE.bannerText}</span>
        </div>

        {/* Routed Section Content */}
        <main
          style={{
            flex: 1,
            padding: '1.75rem',
            maxWidth: '1360px',
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

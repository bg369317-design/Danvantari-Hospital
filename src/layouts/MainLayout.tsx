import React from 'react';
import { HospitalHeader } from '@/components/navigation/HospitalHeader';
import { HospitalFooter } from '@/components/navigation/HospitalFooter';

interface MainLayoutProps {
  children: React.ReactNode;
  activePortal?: string;
  hideHospitalHeader?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activePortal,
  hideHospitalHeader = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {!hideHospitalHeader && <HospitalHeader activePortal={activePortal} />}
      <main style={{ flex: 1 }}>{children}</main>
      <HospitalFooter />
    </div>
  );
};

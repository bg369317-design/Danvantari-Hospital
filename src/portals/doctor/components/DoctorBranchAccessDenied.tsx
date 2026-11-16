import React from 'react';
import {
  ShieldAlert,
  Building2,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { HospitalBranch } from '@/types/publicWebsite';

interface DoctorBranchAccessDeniedProps {
  doctorName: string;
  doctorSpecialty: string;
  attemptedBranchId?: string | undefined;
  attemptedBranchName?: string | undefined;
  assignedBranches: HospitalBranch[];
  onSelectAuthorizedBranch: (branchId: string) => void;
  onReturnToDashboard: () => void;
  contextMessage?: string | undefined;
}

export const DoctorBranchAccessDenied: React.FC<DoctorBranchAccessDeniedProps> = ({
  doctorName,
  doctorSpecialty,
  attemptedBranchId,
  attemptedBranchName = 'Unassigned Hospital Branch',
  assignedBranches,
  onSelectAuthorizedBranch,
  onReturnToDashboard,
  contextMessage,
}) => {
  return (
    <div
      role="alert"
      style={{
        maxWidth: '840px',
        margin: '2rem auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #FECACA',
        boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: '#FEF2F2',
          borderBottom: '1px solid #FECACA',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#DC2626',
            flexShrink: 0,
            border: '2px solid #FCA5A5',
          }}
        >
          <Lock size={22} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#991B1B' }}>
            Access Denied — Unauthorized Branch Facility
          </h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#B91C1C' }}>
            Branch-Based Access Control Violation (Demonstration Security Guard)
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: '1.75rem' }}>
        <div
          style={{
            backgroundColor: '#FFFDF5',
            border: '1px solid #FDE68A',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#92400E', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
            <AlertTriangle size={16} />
            <span>Facility Access Restriction Details</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350F', lineHeight: 1.5 }}>
            {contextMessage || (
              <>
                You are currently signed in as <strong>{doctorName}</strong> ({doctorSpecialty}). You have attempted to access or query clinical records registered under <strong>{attemptedBranchName}</strong> ({attemptedBranchId || 'Unassigned'}). You are not credentialed or assigned to this hospital branch.
              </>
            )}
          </p>
        </div>

        {/* Diagnostic Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Target Branch */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldAlert size={14} />
              <span>Requested Branch (Denied)</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)' }}>
              {attemptedBranchName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', marginTop: '0.15rem' }}>
              ID: {attemptedBranchId || 'unassigned'}
            </div>
          </div>

          {/* Assigned Branches */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #BBF7D0',
              backgroundColor: '#F0FDF4',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} />
              <span>Your Authorized Branches ({assignedBranches.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
              {assignedBranches.map((b) => (
                <div key={b.id} style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building2 size={13} />
                  <span>{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hospital Data Governance & Future RLS Notice */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: '#F1F5F9',
            border: '1px solid #CBD5E1',
            fontSize: '0.8rem',
            color: '#475569',
            lineHeight: 1.5,
            marginBottom: '1.5rem',
          }}
        >
          <strong style={{ color: '#0F172A' }}>Architecture &amp; Security Compliance Notice:</strong>
          <p style={{ margin: '0.35rem 0 0' }}>
            In accordance with Danvantari Hospital healthcare data governance, physicians may only query, inspect, and modify patient queues, appointments, SOAP encounter notes, prescriptions, and diagnostic orders for hospital campuses where they hold an active assignment.
          </p>
          <p style={{ margin: '0.35rem 0 0', fontStyle: 'italic' }}>
            * Future Backend Security: In production with Supabase, this access boundary is enforced at the database kernel via PostgreSQL Row Level Security (RLS) policies matching <code>auth.uid()</code> against <code>doctor_branch_assignments</code>.
          </p>
        </div>

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            borderTop: '1px solid #E2E8F0',
            paddingTop: '1.25rem',
          }}
        >
          <button
            type="button"
            onClick={onReturnToDashboard}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              backgroundColor: '#FFFFFF',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Clinical Dashboard</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {assignedBranches.length > 0 && (
              <button
                type="button"
                onClick={() => onSelectAuthorizedBranch(assignedBranches[0]?.id || 'branch-central')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                <Building2 size={16} />
                <span>Switch to {assignedBranches[0]?.name.split(' ')[1] || 'Authorized'} Campus</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Building2,
  PhoneCall,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  X,
  Send,
  Info,
} from 'lucide-react';
import { DoctorRosterSlot } from '@/types/doctorPortal';

interface DoctorRosterPageProps {
  roster: DoctorRosterSlot[];
  onToggleOnCall: (slotId: string) => void;
  onRequestLeave: (slotId: string, reason: string) => void;
  doctorName?: string;
  doctorSpecialty?: string;
}

export const DoctorRosterPage: React.FC<DoctorRosterPageProps> = ({
  roster,
  onToggleOnCall,
  onRequestLeave,
  doctorName = 'Dr. Aarav Sharma',
  doctorSpecialty = 'Cardiology',
}) => {
  const [leaveModalSlot, setLeaveModalSlot] = useState<DoctorRosterSlot | null>(null);
  const [leaveReason, setLeaveReason] = useState('');
  const [coveringPhysician, setCoveringPhysician] = useState('Dr. Priya Desai (Consultant Cardiologist)');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const activeOpdCount = roster.filter((s) => s.status === 'Available').length;
  const onCallCount = roster.filter((s) => s.isOnCall).length;
  const uniqueBranches = Array.from(new Set(roster.map((s) => s.branchName)));

  const handleOpenLeaveModal = (slot: DoctorRosterSlot) => {
    setLeaveModalSlot(slot);
    setLeaveReason('');
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveModalSlot) return;
    if (!leaveReason.trim()) return;

    onRequestLeave(leaveModalSlot.id, leaveReason.trim());
    setSuccessBanner(
      `Leave request recorded for ${leaveModalSlot.dayOfWeek}. Cross-coverage requested from ${coveringPhysician} (Demonstration Session).`
    );
    setLeaveModalSlot(null);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="doctor-page-container" style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#EFF6FF',
              color: 'var(--color-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              marginBottom: '0.5rem',
            }}
          >
            <CalendarDays size={14} />
            <span>Physician Duty &amp; Ward Roster</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Roster &amp; On-Call Schedule
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Weekly OPD consultation blocks, clinical ward rounds, and emergency on-call commitments for {doctorName} ({doctorSpecialty}).
          </p>
        </div>

        {/* Demo pill */}
        <div
          style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #FCD34D',
            color: '#92400E',
            fontSize: '0.75rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Info size={14} />
          <span>Demonstration Duty Schedule</span>
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            color: '#15803D',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
          }}
        >
          <CheckCircle size={16} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
            <CalendarDays size={16} color="var(--color-primary)" />
            <span>OPD SESSIONS / WEEK</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '0.5rem' }}>
            {activeOpdCount} Blocks
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            Standard 4-hour morning &amp; afternoon clinics
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
            <PhoneCall size={16} color="#DC2626" />
            <span>ON-CALL BLOCKS</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '0.5rem' }}>
            {onCallCount} Active
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            24h emergency triage &amp; cardiac cath lab call
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
            <Building2 size={16} color="var(--color-teal)" />
            <span>ASSIGNED LOCATIONS</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', marginTop: '0.5rem' }}>
            {uniqueBranches.length} Branches
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            Central Campus &amp; North Center
          </div>
        </div>
      </div>

      {/* Weekly Schedule Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#F8FAFC' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)' }}>
            Weekly Rotation Schedule (Mon – Sat)
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Tap the On-Call switch to toggle emergency coverage status or request leave/cross-coverage for specific days.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: '#F8FAFC',
                  borderBottom: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <th style={{ padding: '0.75rem 1.25rem' }}>Day of Week</th>
                <th style={{ padding: '0.75rem 1rem' }}>Hospital Branch &amp; Room</th>
                <th style={{ padding: '0.75rem 1rem' }}>OPD Consultation Hours</th>
                <th style={{ padding: '0.75rem 1rem' }}>Duty Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>On-Call Coverage</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((slot) => {
                const isLeave = slot.status === 'Leave / Unavailable';
                return (
                  <tr
                    key={slot.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: isLeave ? '#F8FAFC' : '#FFFFFF',
                      opacity: isLeave ? 0.8 : 1,
                    }}
                  >
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text)' }}>
                      <div style={{ fontSize: '0.95rem' }}>{slot.dayOfWeek}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                        Regular Outpatient Duty
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--color-text)' }}>
                        <Building2 size={14} color="var(--color-teal)" />
                        <span>{slot.branchName}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                        Consultation {slot.roomNumber}
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text)' }}>
                        <Clock size={14} color="var(--color-primary)" />
                        <span style={{ fontWeight: 500 }}>{slot.opdHours}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {slot.status === 'Available' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: '#F0FDF4',
                            color: '#16A34A',
                            border: '1px solid #DCFCE7',
                          }}
                        >
                          <CheckCircle size={12} />
                          <span>Active on Duty</span>
                        </span>
                      ) : slot.status === 'On Call' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            border: '1px solid #FECACA',
                          }}
                        >
                          <PhoneCall size={12} />
                          <span>On-Call Triage</span>
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: '#F1F5F9',
                            color: '#64748B',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <AlertCircle size={12} />
                          <span>Leave / Cross-Covered</span>
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <button
                        type="button"
                        onClick={() => onToggleOnCall(slot.id)}
                        disabled={isLeave}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.3rem 0.65rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: '6px',
                          cursor: isLeave ? 'not-allowed' : 'pointer',
                          backgroundColor: slot.isOnCall ? '#FEF2F2' : '#F1F5F9',
                          color: slot.isOnCall ? '#DC2626' : '#64748B',
                          border: `1px solid ${slot.isOnCall ? '#FECACA' : '#CBD5E1'}`,
                          opacity: isLeave ? 0.5 : 1,
                        }}
                      >
                        <PhoneCall size={12} />
                        <span>{slot.isOnCall ? 'On Call: ENABLED' : 'On Call: OFF'}</span>
                      </button>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      {slot.status !== 'Leave / Unavailable' ? (
                        <button
                          type="button"
                          onClick={() => handleOpenLeaveModal(slot)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            backgroundColor: '#FFFFFF',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          Request Leave
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontStyle: 'italic' }}>
                          Leave Logged
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency On-Call Policy Box */}
      <div
        style={{
          marginTop: '1.5rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          padding: '1.25rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ padding: '0.5rem', backgroundColor: '#EFF6FF', borderRadius: '6px', color: 'var(--color-primary)' }}>
          <ShieldAlert size={20} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>
            Hospital On-Call Policy &amp; Escalation Protocol (Demonstration)
          </h4>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            When toggled On-Call, the clinical command center routes Code Blue and emergency cardiac triage alerts to your mobile terminal. Any planned unavailability requires logging a covering consultant at least 24 hours in advance.
          </p>
        </div>
      </div>

      {/* Leave Request Modal */}
      {leaveModalSlot && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarDays size={18} color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>
                  Request Leave / Shift Handover
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLeaveModalSlot(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
              <div>Day: <strong>{leaveModalSlot.dayOfWeek}</strong></div>
              <div>Location: <strong>{leaveModalSlot.branchName}</strong> ({leaveModalSlot.roomNumber})</div>
              <div>Hours: <strong>{leaveModalSlot.opdHours}</strong></div>
            </div>

            <form onSubmit={handleSubmitLeave}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Reason for Unavailability *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Medical conference, Annual leave, Personal emergency"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Proposed Covering Physician
                </label>
                <select
                  value={coveringPhysician}
                  onChange={(e) => setCoveringPhysician(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="Dr. Priya Desai (Consultant Cardiologist)">Dr. Priya Desai (Consultant Cardiologist)</option>
                  <option value="Dr. Rajesh Nambiar (Endocrinologist)">Dr. Rajesh Nambiar (Endocrinologist)</option>
                  <option value="Duty Medical Officer (DMO)">Duty Medical Officer (DMO)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setLeaveModalSlot(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Send size={14} />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

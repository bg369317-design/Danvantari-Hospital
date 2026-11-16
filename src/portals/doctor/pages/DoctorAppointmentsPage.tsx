import React, { useState } from 'react';
import { DoctorAppointment, QueueStatus } from '@/types/doctorPortal';
import { HospitalBranch } from '@/types/publicWebsite';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  AlertCircle,
  Edit2,
  X,
  Building2,
} from 'lucide-react';

interface DoctorAppointmentsPageProps {
  appointments: DoctorAppointment[];
  onConfirmAppointment: (appointmentId: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onRescheduleAppointment: (appointmentId: string, newDate: string, newTimeSlot: string) => boolean;
  onViewPatientChart: (patientId: string) => void;
  branches: HospitalBranch[];
  selectedBranchId: string;
}

export const DoctorAppointmentsPage: React.FC<DoctorAppointmentsPageProps> = ({
  appointments,
  onConfirmAppointment,
  onCancelAppointment,
  onRescheduleAppointment,
  onViewPatientChart,
  branches,
  selectedBranchId,
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [branchFilter, setBranchFilter] = useState<string>(selectedBranchId);

  // Reschedule Modal State
  const [reschedulingAppointment, setReschedulingAppointment] = useState<DoctorAppointment | null>(null);
  const [newDate, setNewDate] = useState<string>('2026-11-17');
  const [newTimeSlot, setNewTimeSlot] = useState<string>('11:00 AM – 11:30 AM');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [rescheduleSuccess, setRescheduleSuccess] = useState<string | null>(null);

  // Cancel Confirmation Modal
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState<string | null>(null);

  // Time slots for rescheduling
  const availableSlots = [
    '09:00 AM – 09:30 AM',
    '09:30 AM – 10:00 AM',
    '10:00 AM – 10:30 AM',
    '10:30 AM – 11:00 AM',
    '11:00 AM – 11:30 AM',
    '11:30 AM – 12:00 PM',
    '02:00 PM – 02:30 PM',
    '02:30 PM – 03:00 PM',
    '03:00 PM – 03:30 PM',
    '03:30 PM – 04:00 PM',
  ];

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (branchFilter !== 'all' && apt.branchId !== branchFilter) return false;
    if (viewMode === 'daily') {
      return apt.date === '2026-11-16';
    }
    if (viewMode === 'weekly') {
      // Show appointments between 16 Nov and 22 Nov 2026
      return apt.date >= '2026-11-16' && apt.date <= '2026-11-22';
    }
    return true; // monthly
  });

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAppointment) return;

    if (!newDate) {
      setRescheduleError('Please select a valid future consultation date.');
      return;
    }

    // Minimum date check
    if (newDate < '2026-11-16') {
      setRescheduleError('Appointments cannot be rescheduled to past dates.');
      return;
    }

    const success = onRescheduleAppointment(reschedulingAppointment.id, newDate, newTimeSlot);
    if (!success) {
      setRescheduleError('Schedule Conflict: A consultation is already scheduled for that time slot. Please choose an alternate slot.');
      return;
    }

    setRescheduleError(null);
    setRescheduleSuccess(`Appointment ${reschedulingAppointment.appointmentCode} successfully rescheduled to ${newDate} at ${newTimeSlot}.`);
    setReschedulingAppointment(null);
    setTimeout(() => setRescheduleSuccess(null), 4000);
  };

  const getStatusBadge = (status: QueueStatus) => {
    switch (status) {
      case 'Scheduled':
        return (
          <span
            style={{
              backgroundColor: '#EFF6FF',
              color: 'var(--color-primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
            }}
          >
            Confirmed (Demo)
          </span>
        );
      case 'In Consultation':
        return (
          <span
            style={{
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
            }}
          >
            In Consultation
          </span>
        );
      case 'Waiting':
        return (
          <span
            style={{
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
            }}
          >
            Waiting in Lounge
          </span>
        );
      case 'Completed':
        return (
          <span
            style={{
              backgroundColor: '#F1F5F9',
              color: '#475569',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
            }}
          >
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span
            style={{
              backgroundColor: '#FEF2F2',
              color: '#B91C1C',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
            }}
          >
            Cancelled
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Controls Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Calendar size={22} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Physician Consultation Schedule
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Calendar bookings, conflict-checked rescheduling, and demonstration status confirmations.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: '8px' }}>
            {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewMode === mode ? '#FFFFFF' : 'transparent',
                  color: viewMode === mode ? 'var(--color-primary)' : '#64748B',
                  boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {mode} View
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Alert for Reschedule */}
        {rescheduleSuccess && (
          <div
            role="status"
            style={{
              marginTop: '1rem',
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              color: '#166534',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{rescheduleSuccess}</span>
          </div>
        )}

        {/* Branch Filter & Date Navigation bar */}
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={16} color="var(--color-primary)" />
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              style={{
                padding: '0.45rem 0.65rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
              }}
            >
              <option value="all">All Hospital Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name.replace(' (Demonstration Facility)', '')}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
            <Calendar size={15} color="var(--color-primary)" />
            <span>
              {viewMode === 'daily' && 'Monday, 16 Nov 2026 (Today)'}
              {viewMode === 'weekly' && 'Week of 16 Nov – 22 Nov 2026'}
              {viewMode === 'monthly' && 'November 2026 Schedule'}
            </span>
          </div>
        </div>
      </div>

      {/* Appointment Cards / List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredAppointments.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              padding: '3rem',
              textAlign: 'center',
              color: '#94A3B8',
            }}
          >
            <Calendar size={40} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#475569' }}>No Appointments Found</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
              No clinical appointments found for the selected {viewMode} range.
            </div>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                padding: '1.25rem 1.5rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                    {apt.patientName}
                  </h3>
                  {getStatusBadge(apt.status)}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.25rem' }}>
                  UHID: <strong>{apt.patientUhid}</strong> • Ref: <strong>{apt.appointmentCode}</strong> • {apt.age} Y / {apt.gender}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} color="var(--color-primary)" />
                    <span>{apt.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} color="var(--color-primary)" />
                    <span>{apt.timeSlot}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="var(--color-teal)" />
                    <span>{apt.branchName.replace(' (Demonstration Facility)', '')}</span>
                  </div>
                </div>

                {apt.notes && (
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.4rem', fontStyle: 'italic' }}>
                    Note: {apt.notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onViewPatientChart(apt.patientId)}
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: 'var(--color-primary)',
                    border: '1px solid #BFDBFE',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <FileText size={14} />
                  <span>Chart</span>
                </button>

                {apt.status === 'Scheduled' && (
                  <button
                    onClick={() => onConfirmAppointment(apt.id)}
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      border: '1px solid #86EFAC',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Confirm</span>
                  </button>
                )}

                {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                  <button
                    onClick={() => {
                      setReschedulingAppointment(apt);
                      setNewDate(apt.date);
                      setNewTimeSlot(apt.timeSlot);
                      setRescheduleError(null);
                    }}
                    style={{
                      backgroundColor: '#F8FAFC',
                      color: '#334155',
                      border: '1px solid var(--color-border)',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Edit2 size={13} />
                    <span>Reschedule</span>
                  </button>
                )}

                {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                  <button
                    onClick={() => setCancellingAppointmentId(apt.id)}
                    style={{
                      backgroundColor: '#FEF2F2',
                      color: '#B91C1C',
                      border: '1px solid #FCA5A5',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reschedule Modal */}
      {reschedulingAppointment && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '480px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Reschedule Consultation (Demo)
              </h3>
              <button
                onClick={() => setReschedulingAppointment(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Rescheduling appointment for <strong>{reschedulingAppointment.patientName}</strong> (Ref:{' '}
              {reschedulingAppointment.appointmentCode}).
            </p>

            {rescheduleError && (
              <div
                role="alert"
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{rescheduleError}</span>
              </div>
            )}

            <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Select New Consultation Date *
                </label>
                <input
                  type="date"
                  min="2026-11-16"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Select Available Time Slot *
                </label>
                <select
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setReschedulingAppointment(null)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#F8FAFC',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                  }}
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancellingAppointmentId && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '420px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991B1B', marginBottom: '0.5rem' }}>
              Cancel Consultation (Demo)?
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you sure you want to cancel this demonstration appointment? The patient slot will be marked as cancelled in the clinical schedule.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setCancellingAppointmentId(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#F8FAFC',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Keep Appointment
              </button>
              <button
                onClick={() => {
                  onCancelAppointment(cancellingAppointmentId);
                  setCancellingAppointmentId(null);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Yes, Cancel Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

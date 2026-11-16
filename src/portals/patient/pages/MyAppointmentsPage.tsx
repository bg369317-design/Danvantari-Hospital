import React, { useState } from 'react';
import { PatientAppointment, AppointmentStatus } from '@/types/patientPortal';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react';

interface MyAppointmentsPageProps {
  appointments: PatientAppointment[];
  onNavigateToBook: () => void;
}

export const MyAppointmentsPage: React.FC<MyAppointmentsPageProps> = ({
  appointments,
  onNavigateToBook,
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | AppointmentStatus>('All');
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointment | null>(null);

  const filteredAppointments = appointments.filter((apt) =>
    statusFilter === 'All' ? true : apt.status === statusFilter
  );

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Upcoming':
        return (
          <span
            style={{
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Clock size={12} />
            <span>Upcoming (Demo)</span>
          </span>
        );
      case 'Completed':
        return (
          <span
            style={{
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <CheckCircle2 size={12} />
            <span>Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span
            style={{
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <XCircle size={12} />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header Strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            My Appointments
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Review, verify details, and track upcoming and past clinical visits.
          </p>
        </div>

        <button
          onClick={onNavigateToBook}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Plus size={16} />
          <span>Schedule New Appointment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter Appointments"
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        {(['All', 'Upcoming', 'Completed', 'Cancelled'] as const).map((tab) => {
          const isActive = statusFilter === tab;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => setStatusFilter(tab)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: isActive ? 'var(--color-primary)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
              }}
            >
              {tab} Appointments
            </button>
          );
        })}
      </div>

      {/* Appointments List Grid */}
      {filteredAppointments.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '3rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <Calendar size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>No Appointments Found</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            There are no appointments matching the &quot;{statusFilter}&quot; filter status.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1.25rem',
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  {getStatusBadge(apt.status)}
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    Ref: {apt.appointmentCode}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-teal)',
                      backgroundColor: 'var(--color-teal-light)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                    }}
                  >
                    {apt.type}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  {apt.doctorName}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {apt.specialtyName}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                    fontSize: '0.825rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} color="var(--color-primary)" />
                    <span>
                      <strong>{apt.date}</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} color="var(--color-teal)" />
                    <span>{apt.timeSlot}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} color="var(--color-text-muted)" />
                    <span>{apt.branchName.replace(' (Demonstration Facility)', '')}</span>
                  </div>
                </div>

                {apt.notes && (
                  <p
                    style={{
                      marginTop: '0.75rem',
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)',
                      backgroundColor: 'var(--color-bg)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <strong>Clinical Note:</strong> {apt.notes}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedAppointment(apt)}
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
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
            zIndex: 100,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Appointment Summary
              </h3>
              {getStatusBadge(selectedAppointment.status)}
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-bg)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ marginBottom: '0.4rem' }}>
                <strong>Booking Code:</strong> {selectedAppointment.appointmentCode}
              </div>
              <div style={{ marginBottom: '0.4rem' }}>
                <strong>Physician:</strong> {selectedAppointment.doctorName}
              </div>
              <div style={{ marginBottom: '0.4rem' }}>
                <strong>Department:</strong> {selectedAppointment.specialtyName}
              </div>
              <div style={{ marginBottom: '0.4rem' }}>
                <strong>Date &amp; Time:</strong> {selectedAppointment.date} ({selectedAppointment.timeSlot})
              </div>
              <div style={{ marginBottom: '0.4rem' }}>
                <strong>Hospital Branch:</strong> {selectedAppointment.branchName}
              </div>
              {selectedAppointment.roomNumber && (
                <div>
                  <strong>Room / Suite:</strong> {selectedAppointment.roomNumber}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setSelectedAppointment(null)}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

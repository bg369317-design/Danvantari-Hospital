import React from 'react';
import {
  PatientProfile,
  PatientAppointment,
  LabReportItem,
  PrescriptionItem,
  PatientTab,
} from '@/types/patientPortal';
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Activity,
  FlaskConical,
  Pill,
  PlusCircle,
  ChevronRight,
  AlertTriangle,
  Heart,
  Droplets,
} from 'lucide-react';

interface PatientDashboardProps {
  profile: PatientProfile;
  upcomingAppointments: PatientAppointment[];
  recentLabs: LabReportItem[];
  activePrescriptions: PrescriptionItem[];
  onNavigateTab: (tab: PatientTab) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  profile,
  upcomingAppointments,
  recentLabs,
  activePrescriptions,
  onNavigateTab,
}) => {
  const nextAppointment = upcomingAppointments[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Welcome Message & Patient Profile Summary Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--color-teal)',
                letterSpacing: '0.05em',
              }}
            >
              MyDanvantari Patient Portal
            </span>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--color-primary-dark)',
                marginTop: '0.2rem',
                lineHeight: 1.2,
              }}
            >
              Welcome back, {profile.fullName.split(' (')[0]}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Your electronic health summary, consultation calendar, and diagnostic records are up to date.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ color: 'var(--color-text-muted)' }}>Universal Health ID (UHID):</div>
            <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
              {profile.uhid}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '0.15rem' }}>
              Synthetic Patient Account (Demo)
            </div>
          </div>
        </div>

        {/* Clinical Baseline Metrics Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Heart size={18} color="var(--color-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Blood Pressure</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>132 / 84 mmHg (Sample)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Droplets size={18} color="#DC2626" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Blood Group</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{profile.bloodGroup}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-teal-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Activity size={18} color="var(--color-teal)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Heart Rate / Pulse</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>72 bpm (Resting)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={18} color="#D97706" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Allergies</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-error)' }}>
                {profile.allergies[0] ?? 'None'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Next Appointment Highlight & Quick Actions Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Next Appointment Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Upcoming Consultation
              </h3>
            </div>
            <span
              style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
              }}
            >
              Confirmed (Sample)
            </span>
          </div>

          {nextAppointment ? (
            <div
              style={{
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--color-border)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-primary-dark)' }}>
                  {nextAppointment.doctorName}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                  {nextAppointment.specialtyName}
                </div>

                <div style={{ marginTop: '0.85rem', fontSize: '0.825rem', color: 'var(--color-text)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                    <Clock size={15} color="var(--color-primary)" />
                    <span>
                      <strong>{nextAppointment.date}</strong> at {nextAppointment.timeSlot}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                    <MapPin size={15} color="var(--color-teal)" />
                    <span>{nextAppointment.branchName.replace(' (Demonstration Facility)', '')}</span>
                  </div>
                  {nextAppointment.roomNumber && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Location: {nextAppointment.roomNumber}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => onNavigateTab('appointments')}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                  }}
                >
                  Manage Appointment
                </button>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              You have no pending scheduled consultations.
            </p>
          )}
        </div>

        {/* Quick Actions Shortcuts */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}
          >
            Quick Actions
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={() => onNavigateTab('book')}
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <PlusCircle size={22} color="var(--color-primary)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Book OPD</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Schedule a doctor</div>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('labs')}
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <FlaskConical size={22} color="var(--color-teal)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Lab Results</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>View recent tests</div>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('prescriptions')}
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <Pill size={22} color="#10B981" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Prescriptions</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Active medication list</div>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('second-opinion')}
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <Stethoscope size={22} color="#6366F1" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Second Opinion</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Panel clinical review</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Recent Activity: Latest Lab Reports & Active Prescriptions Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Recent Lab Reports */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FlaskConical size={18} color="var(--color-teal)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Lab Reports</h3>
            </div>
            <button
              onClick={() => onNavigateTab('labs')}
              style={{ fontSize: '0.8rem', color: 'var(--color-teal)', fontWeight: 600 }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentLabs.slice(0, 2).map((lab) => (
              <div
                key={lab.id}
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{lab.testName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Reported on {lab.dateReported.split(' ')[0]} • {lab.resultValue}
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('labs')}
                  style={{
                    color: 'var(--color-primary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Inspect <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Prescriptions */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pill size={18} color="#10B981" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Active Prescriptions</h3>
            </div>
            <button
              onClick={() => onNavigateTab('prescriptions')}
              style={{ fontSize: '0.8rem', color: 'var(--color-teal)', fontWeight: 600 }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activePrescriptions.slice(0, 2).map((rx) => (
              <div
                key={rx.id}
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-primary-dark)' }}>
                    {rx.medicationName}
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                    }}
                  >
                    Active
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Dosage: {rx.dosage} • {rx.frequency}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

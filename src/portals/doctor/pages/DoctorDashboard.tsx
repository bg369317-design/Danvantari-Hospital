import React from 'react';
import {
  DoctorProfileData,
  QueuePatientItem,
  DoctorAppointment,
  DoctorLabResultItem,
  DoctorTab,
} from '@/types/doctorPortal';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  PlayCircle,
  FileText,
  Pill,
  FlaskConical,
  Share2,
  ArrowRight,
  Activity,
  Heart,
  Stethoscope,
} from 'lucide-react';

interface DoctorDashboardProps {
  doctor: DoctorProfileData;
  queue: QueuePatientItem[];
  appointments: DoctorAppointment[];
  labResults: DoctorLabResultItem[];
  onNavigateTab: (tab: DoctorTab) => void;
  onStartConsultation: (patient: QueuePatientItem) => void;
  selectedBranchName: string;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctor,
  queue,
  appointments,
  labResults,
  onNavigateTab,
  onStartConsultation,
  selectedBranchName,
}) => {
  // Compute Daily Metrics
  const todayAppointments = appointments.filter((a) => a.date === '2026-11-16');
  const waitingPatients = queue.filter((q) => q.status === 'Waiting');
  const inConsultationPatient = queue.find((q) => q.status === 'In Consultation');
  const completedCount = queue.filter((q) => q.status === 'Completed').length;
  const pendingLabs = labResults.filter((l) => !l.doctorReviewNote || l.isAbnormal);

  // Next patient to see
  const nextWaiting = waitingPatients[0];

  // Completion Percentage
  const totalQueueCount = queue.length;
  const completionPercentage =
    totalQueueCount > 0 ? Math.round((completedCount / totalQueueCount) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Welcome & Status Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
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
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Stethoscope size={22} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Welcome back, {doctor.fullName}
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              {doctor.title} • Active Facility:{' '}
              <strong style={{ color: 'var(--color-primary)' }}>{selectedBranchName}</strong>
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>
              Monday, 16 November 2026
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
              Shift: {doctor.opdTimings.split('|')[0]}
            </div>
          </div>
        </div>

        {/* Visual Progress Bar of Today's Consultations */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
              Today&apos;s OPD Queue Progress: {completedCount} of {totalQueueCount} Consultations Completed
            </span>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{completionPercentage}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${completionPercentage}%`,
                height: '100%',
                backgroundColor: 'var(--color-primary)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Real-Time Clinical KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Card 1: Total Appointments */}
        <div
          onClick={() => onNavigateTab('appointments')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              TODAY&apos;S BOOKINGS
            </span>
            <div style={{ backgroundColor: '#EFF6FF', padding: '0.45rem', borderRadius: '8px' }}>
              <Calendar size={18} color="var(--color-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '0.5rem' }}>
            {todayAppointments.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600, marginTop: '0.2rem' }}>
            Across scheduled OPD slots
          </div>
        </div>

        {/* Card 2: Waiting in Lounge */}
        <div
          onClick={() => onNavigateTab('queue')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              WAITING IN LOUNGE
            </span>
            <div style={{ backgroundColor: '#FEF3C7', padding: '0.45rem', borderRadius: '8px' }}>
              <Users size={18} color="#D97706" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#D97706', marginTop: '0.5rem' }}>
            {waitingPatients.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            Checked in &amp; vitals recorded
          </div>
        </div>

        {/* Card 3: In Consultation */}
        <div
          onClick={() => onNavigateTab('consultation-notes')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              CURRENTLY IN CONSULTATION
            </span>
            <div style={{ backgroundColor: '#DCFCE7', padding: '0.45rem', borderRadius: '8px' }}>
              <Clock size={18} color="#15803D" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#15803D', marginTop: '0.5rem' }}>
            {inConsultationPatient ? 1 : 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            {inConsultationPatient ? inConsultationPatient.patientName.split(' ')[0] : 'Consultation room idle'}
          </div>
        </div>

        {/* Card 4: Completed Consultations */}
        <div
          onClick={() => onNavigateTab('queue')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              COMPLETED TODAY
            </span>
            <div style={{ backgroundColor: '#F1F5F9', padding: '0.45rem', borderRadius: '8px' }}>
              <CheckCircle2 size={18} color="#475569" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#334155', marginTop: '0.5rem' }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            SOAP notes archived
          </div>
        </div>
      </div>

      {/* 3. Main Operational Panels: Live Queue & Pending Labs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Left: Next Patient Callout Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Active Patient Queue
              </h3>
              <button
                onClick={() => onNavigateTab('queue')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>View Full Queue</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {inConsultationPatient && (
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                  Patient Inside Examination Room
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#14532D', marginTop: '0.2rem' }}>
                  {inConsultationPatient.patientName}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#166534', marginTop: '0.15rem' }}>
                  UHID: {inConsultationPatient.patientUhid} • Token: <strong>{inConsultationPatient.tokenNumber}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#14532D', marginTop: '0.4rem', fontWeight: 600 }}>
                  Reason: {inConsultationPatient.reasonForVisit}
                </div>
                {inConsultationPatient.vitals && (
                  <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '0.35rem' }}>
                    Vitals: BP {inConsultationPatient.vitals.bp} • Pulse {inConsultationPatient.vitals.pulse} • SpO2 {inConsultationPatient.vitals.spo2}
                  </div>
                )}
              </div>
            )}

            {nextWaiting ? (
              <div
                style={{
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                }}
              >
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' }}>
                  Next Waiting Patient
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#78350F', marginTop: '0.2rem' }}>
                  {nextWaiting.patientName} ({nextWaiting.age} Y / {nextWaiting.gender})
                </div>
                <div style={{ fontSize: '0.78rem', color: '#92400E', marginTop: '0.15rem' }}>
                  Slot: {nextWaiting.appointmentTime} • Token: <strong>{nextWaiting.tokenNumber}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#92400E', marginTop: '0.35rem' }}>
                  Chief Complaint: <em>{nextWaiting.reasonForVisit}</em>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                No patients currently waiting in the lounge.
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            {nextWaiting && (
              <button
                onClick={() => onStartConsultation(nextWaiting)}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <PlayCircle size={16} />
                <span>Call Token {nextWaiting.tokenNumber}</span>
              </button>
            )}
            <button
              onClick={() => onNavigateTab('queue')}
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Open Queue
            </button>
          </div>
        </div>

        {/* Right: Diagnostic & Abnormal Lab Results Alert Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Activity size={18} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  Diagnostic Lab Feed
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('lab-results')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>All Results</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingLabs.map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => onNavigateTab('lab-results')}
                  style={{
                    backgroundColor: lab.isAbnormal ? '#FEF2F2' : '#F8FAFC',
                    border: lab.isAbnormal ? '1px solid #FCA5A5' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: lab.isAbnormal ? '#991B1B' : '#0F172A' }}>
                          {lab.patientName}
                        </span>
                        {lab.isAbnormal && (
                          <span
                            style={{
                              backgroundColor: '#DC2626',
                              color: '#FFFFFF',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                            }}
                          >
                            ABNORMAL
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.15rem' }}>
                        {lab.testName} • Ref: {lab.reportCode}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: lab.isAbnormal ? '#B91C1C' : '#64748B', marginTop: '0.25rem' }}>
                        {lab.summaryFindings}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('diagnostic-orders')}
            style={{
              marginTop: '1rem',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--color-border)',
              color: 'var(--color-primary-dark)',
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
            }}
          >
            <FlaskConical size={15} />
            <span>Order New Diagnostic Investigation</span>
          </button>
        </div>
      </div>

      {/* 4. Quick Clinical Actions Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '1.5rem',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
          Quick Clinical Workflows
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}
        >
          <button
            onClick={() => onNavigateTab('consultation-notes')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            <FileText size={18} color="var(--color-primary)" />
            <span>SOAP Consultation Note</span>
          </button>

          <button
            onClick={() => onNavigateTab('prescriptions')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            <Pill size={18} color="var(--color-primary)" />
            <span>Issue E-Prescription</span>
          </button>

          <button
            onClick={() => onNavigateTab('diagnostic-orders')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            <FlaskConical size={18} color="var(--color-teal)" />
            <span>Order Diagnostic Test</span>
          </button>

          <button
            onClick={() => onNavigateTab('referrals')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            <Share2 size={18} color="#D97706" />
            <span>Specialist Referral</span>
          </button>

          <button
            onClick={() => onNavigateTab('records')}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: '#F8FAFC',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            <Heart size={18} color="#DC2626" />
            <span>Review Patient Charts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  PatientChart,
  DoctorTab,
} from '@/types/doctorPortal';
import {
  User,
  Heart,
  AlertTriangle,
  Paperclip,
  Activity,
  Pill,
  ShieldAlert,
  PlusCircle,
} from 'lucide-react';

interface DoctorPatientRecordsPageProps {
  patientCharts: Record<string, PatientChart>;
  activePatientId: string;
  onSelectPatient: (patientId: string) => void;
  onNavigateTab: (tab: DoctorTab) => void;
  onPrepareSoapForPatient: (patientId: string) => void;
  onPreparePrescriptionForPatient: (patientId: string) => void;
  onPrepareDiagnosticOrderForPatient: (patientId: string) => void;
}

export const DoctorPatientRecordsPage: React.FC<DoctorPatientRecordsPageProps> = ({
  patientCharts,
  activePatientId,
  onSelectPatient,
  onNavigateTab: _onNavigateTab,
  onPrepareSoapForPatient,
  onPreparePrescriptionForPatient,
  onPrepareDiagnosticOrderForPatient,
}) => {
  const [activeRecordSubTab, setActiveRecordSubTab] = useState<
    'hospital' | 'external' | 'documents' | 'labs' | 'prescriptions'
  >('hospital');

  const currentChart = patientCharts[activePatientId] || Object.values(patientCharts)[0];

  if (!currentChart) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        No patient records available.
      </div>
    );
  }

  const { demographics, hospitalRecords, externalMedicalHistory, externalDocuments } = currentChart;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Patient Switcher Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <User size={20} color="var(--color-primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>
            Select Patient Medical Chart:
          </span>
          <select
            value={currentChart.demographics.id}
            onChange={(e) => onSelectPatient(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
          >
            {Object.values(patientCharts).map((chart) => (
              <option key={chart.demographics.id} value={chart.demographics.id}>
                {chart.demographics.fullName} ({chart.demographics.uhid})
              </option>
            ))}
          </select>
        </div>

        {/* Quick EHR Actions for this Patient */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onPrepareSoapForPatient(currentChart.demographics.id)}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <PlusCircle size={14} />
            <span>New SOAP Note</span>
          </button>

          <button
            onClick={() => onPreparePrescriptionForPatient(currentChart.demographics.id)}
            style={{
              backgroundColor: '#F8FAFC',
              color: 'var(--color-primary-dark)',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Pill size={14} />
            <span>Prescribe</span>
          </button>

          <button
            onClick={() => onPrepareDiagnosticOrderForPatient(currentChart.demographics.id)}
            style={{
              backgroundColor: '#F8FAFC',
              color: 'var(--color-primary-dark)',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Activity size={14} />
            <span>Order Test</span>
          </button>
        </div>
      </div>

      {/* Patient Demographic & Clinical Summary Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                {demographics.fullName}
              </h2>
              <span
                style={{
                  backgroundColor: '#EFF6FF',
                  color: 'var(--color-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '4px',
                }}
              >
                {demographics.uhid}
              </span>
            </div>
            <div style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '0.25rem' }}>
              {demographics.age} Yrs / {demographics.gender} • Blood Group: <strong>{demographics.bloodGroup}</strong> • Facility: {demographics.primaryBranchName.split(' ')[1]} Campus
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#64748B', textAlign: 'right' }}>
            <div>Contact: <strong>{demographics.contactNumber}</strong></div>
            <div>Emergency: {demographics.emergencyContact}</div>
          </div>
        </div>

        {/* Clinical Alert Flags: Allergies & Chronic Conditions */}
        <div
          style={{
            marginTop: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {/* Allergies */}
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
            }}
          >
            <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase' }}>
                DOCUMENTED ALLERGIES
              </div>
              <div style={{ fontSize: '0.8rem', color: '#7F1D1D', fontWeight: 600, marginTop: '0.15rem' }}>
                {demographics.allergies.join(' • ')}
              </div>
            </div>
          </div>

          {/* Chronic Conditions */}
          <div
            style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
            }}
          >
            <Heart size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' }}>
                ACTIVE CHRONIC DIAGNOSES
              </div>
              <div style={{ fontSize: '0.8rem', color: '#78350F', fontWeight: 600, marginTop: '0.15rem' }}>
                {demographics.chronicConditions.join(' • ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid var(--color-border)',
          paddingBottom: '0.25rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setActiveRecordSubTab('hospital')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.825rem',
            fontWeight: 700,
            border: 'none',
            background: 'none',
            color: activeRecordSubTab === 'hospital' ? 'var(--color-primary)' : '#64748B',
            borderBottom: activeRecordSubTab === 'hospital' ? '3px solid var(--color-primary)' : '3px solid transparent',
            cursor: 'pointer',
          }}
        >
          Hospital Clinical Records ({hospitalRecords.length})
        </button>

        <button
          onClick={() => setActiveRecordSubTab('external')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.825rem',
            fontWeight: 700,
            border: 'none',
            background: 'none',
            color: activeRecordSubTab === 'external' ? '#B45309' : '#64748B',
            borderBottom: activeRecordSubTab === 'external' ? '3px solid #D97706' : '3px solid transparent',
            cursor: 'pointer',
          }}
        >
          Patient-Reported History ({externalMedicalHistory.length})
        </button>

        <button
          onClick={() => setActiveRecordSubTab('documents')}
          style={{
            padding: '0.65rem 1rem',
            fontSize: '0.825rem',
            fontWeight: 700,
            border: 'none',
            background: 'none',
            color: activeRecordSubTab === 'documents' ? 'var(--color-primary)' : '#64748B',
            borderBottom: activeRecordSubTab === 'documents' ? '3px solid var(--color-primary)' : '3px solid transparent',
            cursor: 'pointer',
          }}
        >
          Patient Documents ({externalDocuments.length})
        </button>
      </div>

      {/* 1. Hospital Verified Records Tab */}
      {activeRecordSubTab === 'hospital' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {hospitalRecords.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
              No previous hospital consultation summaries found.
            </div>
          ) : (
            hospitalRecords.map((rec) => (
              <div
                key={rec.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span
                      style={{
                        backgroundColor: '#EFF6FF',
                        color: 'var(--color-primary)',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                      }}
                    >
                      {rec.recordCode}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '0.35rem' }}>
                      {rec.diagnosisSummary}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      Physician: <strong>{rec.doctorName}</strong> • {rec.department} • Date: {rec.date}
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#334155' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                    Documented Clinical Findings:
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, lineHeight: 1.5 }}>
                    {rec.keyFindings.map((finding, idx) => (
                      <li key={idx}>{finding}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Patient-Reported External Medical History Tab */}
      {activeRecordSubTab === 'external' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Prominent Warning */}
          <div
            role="alert"
            style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: '#92400E',
              fontSize: '0.8rem',
            }}
          >
            <ShieldAlert size={18} color="#D97706" style={{ flexShrink: 0 }} />
            <div>
              <strong>Patient-Reported History (Unverified):</strong> Information in this section was provided by the patient for historical context and has not been verified by Danvantari Hospital clinical staff.
            </div>
          </div>

          {externalMedicalHistory.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
              No external medical records reported by patient.
            </div>
          ) : (
            externalMedicalHistory.map((ext) => (
              <div
                key={ext.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #FDE68A',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span
                      style={{
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                      }}
                    >
                      Patient Record: {ext.recordCode} (Unverified)
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#78350F', marginTop: '0.35rem' }}>
                      {ext.diagnosis}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#78350F' }}>
                      Outside Facility: <strong>{ext.facilityName}</strong> • Consultant: {ext.consultantName} • Date: {ext.treatmentDate}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.825rem', color: '#334155', marginBottom: '0.75rem' }}>
                  <strong>Treatment Summary:</strong> {ext.treatmentSummary}
                </div>

                {ext.medications.length > 0 && (
                  <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                    <strong>Reported Medications:</strong>
                    <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                      {ext.medications.map((m, i) => (
                        <li key={i}>
                          {m.name} ({m.dosage}) — {m.frequency} for {m.duration}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Patient Uploaded External Documents */}
      {activeRecordSubTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              fontSize: '0.8rem',
              color: 'var(--color-primary-dark)',
            }}
          >
            These attachments were uploaded by the patient via the Patient Portal. File names and metadata are displayed below for clinician reference.
          </div>

          {externalDocuments.length === 0 ? (
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
              No uploaded documents attached to this chart.
            </div>
          ) : (
            externalDocuments.map((doc) => (
              <div
                key={doc.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Paperclip size={18} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)' }}>
                      {doc.fileName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Category: {doc.docType} • Size: {doc.fileSizeKb} KB • Uploaded: {doc.uploadedAt}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#059669',
                    backgroundColor: '#ECFDF5',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  Demonstration File
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

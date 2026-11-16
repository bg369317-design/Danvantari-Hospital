import React, { useState } from 'react';
import { LabReportItem, PatientProfile } from '@/types/patientPortal';
import { generateLabReportPdf } from '@/utils/labReportPdfGenerator';
import {
  Download,
  Eye,
  CheckCircle2,
  X,
  Info,
} from 'lucide-react';

interface LabReportsPageProps {
  reports: LabReportItem[];
  profile: PatientProfile;
}

export const LabReportsPage: React.FC<LabReportsPageProps> = ({ reports, profile }) => {
  const [activeReportModal, setActiveReportModal] = useState<LabReportItem | null>(null);
  const [downloadSuccessNote, setDownloadSuccessNote] = useState<string | null>(null);

  const handleDownloadPdf = (report: LabReportItem) => {
    try {
      generateLabReportPdf(report, profile);
      setDownloadSuccessNote(`Report ${report.reportCode} successfully exported as clinical PDF with patient-friendly explanations.`);
      setTimeout(() => setDownloadSuccessNote(null), 5000);
    } catch (e) {
      alert('Unable to generate PDF report. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Title */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
          Laboratory &amp; Pathology Reports
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
          Diagnostic blood chemistry panels, pathology evaluations, and downloadable clinical PDF reports with patient-friendly explanations.
        </p>
      </div>

      {downloadSuccessNote && (
        <div
          role="status"
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #86EFAC',
            color: '#15803D',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{downloadSuccessNote}</span>
        </div>
      )}

      {/* Reports List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reports.map((report) => (
          <div
            key={report.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px',
                  }}
                >
                  {report.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  Accession: {report.reportCode}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Reported: {report.dateReported.split(' ')[0]}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)' }}>
                {report.testName}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Ordered by: {report.orderedBy} • Specimen: {report.specimenType}
              </p>

              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                <strong>Finding Summary:</strong>{' '}
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                  {report.resultValue}
                </span>{' '}
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                  (Reference Range: {report.normalRange})
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setActiveReportModal(report)}
                style={{
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                <Eye size={15} />
                <span>View Sheet</span>
              </button>

              <button
                onClick={() => handleDownloadPdf(report)}
                style={{
                  backgroundColor: 'var(--color-teal)',
                  color: '#FFFFFF',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                }}
              >
                <Download size={15} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lab Report Inspection Modal */}
      {activeReportModal && (
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
              maxWidth: '680px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-teal)', textTransform: 'uppercase' }}>
                  Danvantari Hospital Pathology Service • Demo Sheet
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  {activeReportModal.testName}
                </h3>
              </div>
              <button
                onClick={() => setActiveReportModal(null)}
                style={{ padding: '0.35rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Specimen and Accession Details */}
            <div
              style={{
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                border: '1px solid var(--color-border)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Accession Code:</span>
                <strong>{activeReportModal.reportCode}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Specimen / Fasting:</span>
                <strong>{activeReportModal.specimenType} ({activeReportModal.fastingState})</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Date Reported:</span>
                <strong>{activeReportModal.dateReported}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Ordering Consultant:</span>
                <strong>{activeReportModal.orderedBy}</strong>
              </div>
            </div>

            {/* Parameters Table */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Measured Laboratory Parameters:
              </h4>
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 700 }}>Parameter</th>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 700 }}>Measured Value</th>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 700 }}>Unit</th>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 700 }}>Reference Interval</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeReportModal.parameters.map((param, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.6rem 0.75rem', fontWeight: 600 }}>{param.parameterName}</td>
                        <td style={{ padding: '0.6rem 0.75rem', color: param.isAbnormal ? 'var(--color-error)' : 'var(--color-text)', fontWeight: param.isAbnormal ? 700 : 500 }}>
                          {param.measuredValue} {param.isAbnormal && '*'}
                        </td>
                        <td style={{ padding: '0.6rem 0.75rem', color: 'var(--color-text-muted)' }}>{param.unit}</td>
                        <td style={{ padding: '0.6rem 0.75rem', color: 'var(--color-text-muted)' }}>{param.referenceInterval}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Understanding Your Report (Patient-Friendly Section) */}
            <div
              style={{
                backgroundColor: '#FEF3C7',
                border: '1px solid #FCD34D',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <Info size={16} color="#B45309" />
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#92400E' }}>
                  Understanding Your Report – Patient-Friendly Explanation
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#78350F', lineHeight: 1.5, marginBottom: '0.65rem' }}>
                {activeReportModal.generalDescription} {activeReportModal.clinicalSignificance}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: '#78350F' }}>
                {activeReportModal.parameters.map((p, idx) => (
                  <div key={idx}>
                    <strong>• {p.parameterName}:</strong> {p.explanation}
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.72rem', color: '#B45309', borderTop: '1px dashed #FCD34D', paddingTop: '0.5rem', marginTop: '0.75rem' }}>
                * Patient-friendly explanations are for general understanding only. They are not a diagnosis or substitute for professional medical advice.
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <button
                onClick={() => setActiveReportModal(null)}
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close View
              </button>
              <button
                onClick={() => {
                  handleDownloadPdf(activeReportModal);
                  setActiveReportModal(null);
                }}
                style={{
                  backgroundColor: 'var(--color-teal)',
                  color: '#FFFFFF',
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                }}
              >
                <Download size={15} />
                <span>Download Report PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

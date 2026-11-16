import React, { useState } from 'react';
import {
  FlaskConical,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  User,
  Calendar,
  X,
  Save,
  Info,
} from 'lucide-react';
import { DoctorLabResultItem } from '@/types/doctorPortal';

interface DoctorLabResultsPageProps {
  labResults: DoctorLabResultItem[];
  onSaveDoctorReviewNote: (reportId: string, note: string) => void;
  onOpenPatientRecords: (patientId: string) => void;
}

export const DoctorLabResultsPage: React.FC<DoctorLabResultsPageProps> = ({
  labResults,
  onSaveDoctorReviewNote,
  onOpenPatientRecords,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'abnormal' | 'reviewed' | 'unreviewed'>('all');
  const [selectedReport, setSelectedReport] = useState<DoctorLabResultItem | null>(null);
  const [reviewNoteInput, setReviewNoteInput] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const filteredResults = labResults.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patientUhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reportCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.testName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'abnormal') return item.isAbnormal;
    if (filterType === 'reviewed') return Boolean(item.doctorReviewNote);
    if (filterType === 'unreviewed') return !item.doctorReviewNote;
    return true;
  });

  const handleOpenDetailModal = (item: DoctorLabResultItem) => {
    setSelectedReport(item);
    setReviewNoteInput(item.doctorReviewNote || '');
    setSaveSuccessNotice(null);
  };

  const handleSaveReview = () => {
    if (!selectedReport) return;
    onSaveDoctorReviewNote(selectedReport.id, reviewNoteInput.trim());
    setSelectedReport({
      ...selectedReport,
      doctorReviewNote: reviewNoteInput.trim(),
      reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setSaveSuccessNotice('Clinical review note saved successfully (Demonstration Session).');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
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
            <FlaskConical size={14} />
            <span>Pathology &amp; Diagnostics Triage</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Laboratory &amp; Diagnostic Results
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Review real-time hematology, biochemistry, and microbiology findings with abnormal flag alerts.
          </p>
        </div>

        {/* Demonstration pill */}
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
          <span>Demonstration Clinical Feeds — Not for real diagnostic decisions</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 320px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search by patient name, UHID, test, or report code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                fontSize: '0.875rem',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: 'var(--color-text-muted)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Filter:</span>
          {(['all', 'abnormal', 'unreviewed', 'reviewed'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: '6px',
                border: '1px solid',
                cursor: 'pointer',
                borderColor: filterType === type ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: filterType === type ? '#EFF6FF' : '#FFFFFF',
                color: filterType === type ? 'var(--color-primary)' : 'var(--color-text)',
                fontWeight: filterType === type ? 600 : 400,
                textTransform: 'capitalize',
              }}
            >
              {type === 'all'
                ? 'All Results'
                : type === 'abnormal'
                ? 'Abnormal Flagged'
                : type === 'unreviewed'
                ? 'Needs Review'
                : 'Reviewed'}
            </button>
          ))}
        </div>
      </div>

      {/* Lab Results Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
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
                <th style={{ padding: '0.75rem 1rem' }}>Report Code</th>
                <th style={{ padding: '0.75rem 1rem' }}>Patient</th>
                <th style={{ padding: '0.75rem 1rem' }}>Test Profile</th>
                <th style={{ padding: '0.75rem 1rem' }}>Date &amp; Facility</th>
                <th style={{ padding: '0.75rem 1rem' }}>Findings Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Physician Review</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <FlaskConical size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 500 }}>No laboratory results match your search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredResults.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      backgroundColor: item.isAbnormal ? '#FFFDF5' : '#FFFFFF',
                    }}
                  >
                    <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text)' }}>
                      {item.reportCode}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{item.patientName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                        {item.patientUhid}
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{item.testName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.orderingDoctor}</div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--color-text)' }}>
                        <Calendar size={13} color="var(--color-text-muted)" />
                        <span>{item.reportDate}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.branchName}</div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      {item.isAbnormal ? (
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
                          <AlertTriangle size={12} />
                          <span>Abnormal Values</span>
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
                            backgroundColor: '#F0FDF4',
                            color: '#16A34A',
                            border: '1px solid #DCFCE7',
                          }}
                        >
                          <CheckCircle size={12} />
                          <span>Within Normal Limits</span>
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      {item.doctorReviewNote ? (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-teal)', fontSize: '0.75rem', fontWeight: 600 }}>
                            <CheckCircle size={12} />
                            <span>Reviewed</span>
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--color-text-muted)',
                              maxWidth: '220px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={item.doctorReviewNote}
                          >
                            &quot;{item.doctorReviewNote}&quot;
                          </div>
                        </div>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            color: '#D97706',
                            backgroundColor: '#FFFBEB',
                            padding: '0.2rem 0.45rem',
                            borderRadius: '4px',
                          }}
                        >
                          <Clock size={12} />
                          <span>Pending Review</span>
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenDetailModal(item)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          backgroundColor: '#EFF6FF',
                          color: 'var(--color-primary)',
                          border: '1px solid #BFDBFE',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lab Report Detail & Review Modal */}
      {selectedReport && (
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
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#F8FAFC',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="var(--color-primary)" />
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    {selectedReport.testName}
                  </h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Accession Ref: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedReport.reportCode}</span> | Status: {selectedReport.status}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  padding: '0.25rem',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Patient Banner */}
              <div
                style={{
                  backgroundColor: '#F1F5F9',
                  borderRadius: '8px',
                  padding: '0.875rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    {selectedReport.patientName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                    UHID: {selectedReport.patientUhid}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <div>Ordering Physician: <strong style={{ color: 'var(--color-text)' }}>{selectedReport.orderingDoctor}</strong></div>
                  <div>Report Date: {selectedReport.reportDate}</div>
                </div>
              </div>

              {/* Summary Findings */}
              <div
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: selectedReport.isAbnormal ? '#FEF2F2' : '#F0FDF4',
                  border: `1px solid ${selectedReport.isAbnormal ? '#FECACA' : '#DCFCE7'}`,
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: selectedReport.isAbnormal ? '#B91C1C' : '#15803D',
                    marginBottom: '0.25rem',
                  }}
                >
                  Clinical Summary
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text)' }}>
                  {selectedReport.summaryFindings}
                </p>
              </div>

              {/* Parameter Table */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                  Laboratory Parameters &amp; Reference Ranges
                </h4>
                <div style={{ border: '1px solid var(--color-border)', borderRadius: '6px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.6rem 0.85rem' }}>Analyte / Parameter</th>
                        <th style={{ padding: '0.6rem 0.85rem' }}>Measured Value</th>
                        <th style={{ padding: '0.6rem 0.85rem' }}>Unit</th>
                        <th style={{ padding: '0.6rem 0.85rem' }}>Biological Reference Interval</th>
                        <th style={{ padding: '0.6rem 0.85rem', textAlign: 'center' }}>Evaluation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.parameters.map((param, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: '1px solid var(--color-border)',
                            backgroundColor: param.isAbnormal ? '#FFF5F5' : '#FFFFFF',
                          }}
                        >
                          <td style={{ padding: '0.6rem 0.85rem', fontWeight: 500, color: 'var(--color-text)' }}>
                            {param.name}
                          </td>
                          <td
                            style={{
                              padding: '0.6rem 0.85rem',
                              fontWeight: 700,
                              color: param.isAbnormal ? '#DC2626' : 'var(--color-text)',
                            }}
                          >
                            {param.val}
                          </td>
                          <td style={{ padding: '0.6rem 0.85rem', color: 'var(--color-text-muted)' }}>{param.unit}</td>
                          <td style={{ padding: '0.6rem 0.85rem', color: 'var(--color-text-muted)' }}>{param.ref}</td>
                          <td style={{ padding: '0.6rem 0.85rem', textAlign: 'center' }}>
                            {param.isAbnormal ? (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  backgroundColor: '#FEF2F2',
                                  color: '#DC2626',
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: '4px',
                                  border: '1px solid #FECACA',
                                }}
                              >
                                ABNORMAL
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  backgroundColor: '#F0FDF4',
                                  color: '#16A34A',
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: '4px',
                                }}
                              >
                                NORMAL
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Doctor Review Note Editor */}
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '1rem', border: '1px solid var(--color-border)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.4rem' }}>
                  Consultant / Treating Physician Review Note
                </label>
                <textarea
                  rows={3}
                  value={reviewNoteInput}
                  onChange={(e) => setReviewNoteInput(e.target.value)}
                  placeholder="Record your clinical impression, medication adjustment, or patient communication instructions..."
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
                {saveSuccessNotice && (
                  <div style={{ marginTop: '0.5rem', color: '#16A34A', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle size={14} />
                    <span>{saveSuccessNotice}</span>
                  </div>
                )}
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleSaveReview}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      backgroundColor: 'var(--color-primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <Save size={14} />
                    <span>Save Review Note</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--color-border)',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  const patId = selectedReport.patientId;
                  setSelectedReport(null);
                  onOpenPatientRecords(patId);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                <User size={14} />
                <span>Open Patient Chart ({selectedReport.patientUhid})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  backgroundColor: '#E2E8F0',
                  color: 'var(--color-text)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

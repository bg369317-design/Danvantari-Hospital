import React, { useState } from 'react';
import { HospitalBranch, MedicalSpecialty } from '@/types/publicWebsite';
import { SecondOpinionRequest, SecondOpinionStatus } from '@/types/patientPortal';
import {
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Clock,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  X,
  ListFilter,
} from 'lucide-react';

interface SecondOpinionPageProps {
  branches: HospitalBranch[];
  specialties: MedicalSpecialty[];
  secondOpinions: SecondOpinionRequest[];
  onSubmitSecondOpinion?: (
    data: Omit<SecondOpinionRequest, 'id' | 'requestCode' | 'submissionDate' | 'status'>
  ) => void;
  onOpenMedicalRecord?: (recordCode: string) => void;
}

export const SecondOpinionPage: React.FC<SecondOpinionPageProps> = ({
  branches,
  specialties,
  secondOpinions,
  onSubmitSecondOpinion,
  onOpenMedicalRecord,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'request'>('list');
  const [statusFilter, setStatusFilter] = useState<'All' | SecondOpinionStatus>('All');
  const [selectedOpinion, setSelectedOpinion] = useState<SecondOpinionRequest | null>(null);

  // Form State
  const [specialtyName, setSpecialtyName] = useState<string>(
    specialties[0]?.name || 'Cardiology & Heart Care (Sample Dept)'
  );
  const [reviewingCampus, setReviewingCampus] = useState<string>(
    branches[0]?.name || 'Danvantari Central Campus (Demonstration Facility)'
  );
  const [currentDiagnosis, setCurrentDiagnosis] = useState<string>('');
  const [specificQuestions, setSpecificQuestions] = useState<string>('');
  const [urgency, setUrgency] = useState<'Routine Review' | 'Priority Specialist Review'>('Routine Review');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const filteredOpinions = secondOpinions.filter((item) =>
    statusFilter === 'All' ? true : item.status === statusFilter
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDiagnosis.trim()) {
      setValidationError('Please specify your current diagnosed clinical condition.');
      return;
    }
    if (!specificQuestions.trim()) {
      setValidationError('Please enter the specific clinical questions for the collegiate specialist panel.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedCode = `2ND-DEMO-${Math.floor(803 + Math.random() * 100)}`;

      if (onSubmitSecondOpinion) {
        onSubmitSecondOpinion({
          specialtyName,
          reviewingCampus,
          currentDiagnosis,
          specificQuestions,
          urgency,
          reviewingPanel: `Danvantari ${specialtyName} Collegiate Review Board (Demo)`,
        });
      }

      setSubmittedCode(generatedCode);
      setCurrentDiagnosis('');
      setSpecificQuestions('');
      setActiveSubTab('list');
    }, 500);
  };

  const getStatusBadge = (status: SecondOpinionStatus) => {
    switch (status) {
      case 'Completed (Demo)':
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
            <span>Completed (Demo Review)</span>
          </span>
        );
      case 'Under Review (Demo)':
        return (
          <span
            style={{
              backgroundColor: '#EFF6FF',
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
            <span>Under Review (Demo)</span>
          </span>
        );
      case 'Submitted (Demo)':
        return (
          <span
            style={{
              backgroundColor: '#FEF3C7',
              color: '#92400E',
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
            <span>Submitted (Demo)</span>
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner / Switcher */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
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
              <Stethoscope size={24} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Medical Second Opinion Panel
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Multidisciplinary specialist reviews, diagnostic evaluations, and non-binding clinical recommendations.
            </p>
          </div>

          {/* Sub-Tabs: List vs New Request */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setActiveSubTab('list')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: activeSubTab === 'list' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: activeSubTab === 'list' ? 'var(--color-primary)' : '#FFFFFF',
                color: activeSubTab === 'list' ? '#FFFFFF' : 'var(--color-text)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <ListFilter size={16} />
              <span>My Requests ({secondOpinions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('request')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: activeSubTab === 'request' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: activeSubTab === 'request' ? 'var(--color-primary)' : '#FFFFFF',
                color: activeSubTab === 'request' ? '#FFFFFF' : 'var(--color-text)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <PlusCircle size={16} />
              <span>Request Second Opinion</span>
            </button>
          </div>
        </div>

        {/* Status filter if on list tab */}
        {activeSubTab === 'list' && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {(['All', 'Completed (Demo)', 'Under Review (Demo)', 'Submitted (Demo)'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: statusFilter === filter ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: statusFilter === filter ? 'var(--color-primary)' : '#FFFFFF',
                  color: statusFilter === filter ? '#FFFFFF' : 'var(--color-text)',
                  cursor: 'pointer',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Success Notification after submission */}
      {submittedCode && (
        <div
          role="alert"
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CheckCircle2 size={20} color="#15803D" />
            <div>
              <strong>Demonstration Second Opinion Request Created:</strong> Reference tracking number{' '}
              <strong style={{ textDecoration: 'underline' }}>{submittedCode}</strong> has been logged to your portal.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubmittedCode(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#166534',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem',
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Clinical Disclaimer */}
      <div
        role="alert"
        style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1.25rem',
          fontSize: '0.8rem',
          color: '#92400E',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <ShieldAlert size={18} color="#D97706" style={{ flexShrink: 0 }} />
        <div>
          <strong>Collegiate Second Opinion Protocol:</strong> Second opinions provide consultative expert peer analysis based on submitted historical information. They do not constitute an in-person primary physical examination or replace emergency medical intervention.
        </div>
      </div>

      {/* VIEW 1: MY REQUESTS LIST */}
      {activeSubTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredOpinions.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                padding: '3rem 2rem',
                textAlign: 'center',
              }}
            >
              <Stethoscope size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                No Second Opinion Requests Found
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                You have no active or completed requests under this filter category.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('request')}
                style={{
                  marginTop: '1rem',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Submit First Request
              </button>
            </div>
          ) : (
            filteredOpinions.map((op) => (
              <div
                key={op.id}
                id={`opinion-row-${op.requestCode}`}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  padding: '1.5rem',
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
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                        {op.specialtyName}
                      </h3>
                      {getStatusBadge(op.status)}
                    </div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--color-text-muted)',
                        marginTop: '0.25rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      Request Code: <strong style={{ color: 'var(--color-primary)' }}>{op.requestCode}</strong> • Submitted: {op.submissionDate}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOpinion(op)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      backgroundColor: op.status === 'Completed (Demo)' ? 'var(--color-primary)' : '#F8FAFC',
                      color: op.status === 'Completed (Demo)' ? '#FFFFFF' : 'var(--color-text)',
                      border: op.status === 'Completed (Demo)' ? 'none' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span>{op.status === 'Completed (Demo)' ? 'View Panel Consensus' : 'View Request Details'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Working Diagnosis:</span>{' '}
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{op.currentDiagnosis}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Assigned Campus:</span>{' '}
                    <span>{op.reviewingCampus}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Reviewing Panel:</span>{' '}
                    <span style={{ color: 'var(--color-primary-dark)', fontWeight: 600 }}>{op.reviewingPanel}</span>
                  </div>

                  {op.resultSummary && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        backgroundColor: '#F0FDF4',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid #BBF7D0',
                        fontSize: '0.825rem',
                        color: '#166534',
                      }}
                    >
                      <strong>Panel Consensus Summary:</strong> {op.resultSummary}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW 2: SUBMIT NEW REQUEST FORM */}
      {activeSubTab === 'request' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
              Submit New Second Opinion Dossier
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Select a specialized collegiate board and provide your current diagnosis and clinical inquiries for simulated peer review.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {validationError && (
              <div
                role="alert"
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{validationError}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Target Medical Specialty *
                </label>
                <select
                  value={specialtyName}
                  onChange={(e) => setSpecialtyName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem',
                  }}
                >
                  {specialties.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Reviewing Campus Facility *
                </label>
                <select
                  value={reviewingCampus}
                  onChange={(e) => setReviewingCampus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem',
                  }}
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Primary Diagnosed Condition / Working Diagnosis *
              </label>
              <input
                type="text"
                value={currentDiagnosis}
                onChange={(e) => setCurrentDiagnosis(e.target.value)}
                placeholder="e.g. Mild Chondromalacia Patellae / Essential Hypertension Grade 1"
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Specific Clinical Questions for the Specialist Panel *
              </label>
              <textarea
                value={specificQuestions}
                onChange={(e) => setSpecificQuestions(e.target.value)}
                rows={4}
                placeholder="Outline what specific diagnostic doubts, alternative pharmaceutical regimens, or surgical considerations you wish the panel to review..."
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Review Urgency Tier
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="urgency"
                    value="Routine Review"
                    checked={urgency === 'Routine Review'}
                    onChange={() => setUrgency('Routine Review')}
                  />
                  <span>Routine Collegiate Review (3-5 Business Days)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="urgency"
                    value="Priority Specialist Review"
                    checked={urgency === 'Priority Specialist Review'}
                    onChange={() => setUrgency('Priority Specialist Review')}
                  />
                  <span>Priority Specialist Review (24-48 Hours)</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setActiveSubTab('list')}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: 'var(--color-text)',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Stethoscope size={16} />
                <span>{isSubmitting ? 'Submitting Request...' : 'Submit Second Opinion Request'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DETAIL MODAL FOR SECOND OPINION */}
      {selectedOpinion && (
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
              maxWidth: '700px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Stethoscope size={22} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                    Second Opinion Dossier
                  </h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Tracking Code: <strong style={{ color: 'var(--color-primary)' }}>{selectedOpinion.requestCode}</strong> • Status:{' '}
                  {getStatusBadge(selectedOpinion.status)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOpinion(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>DEPARTMENT</div>
                  <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{selectedOpinion.specialtyName}</div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>CAMPUS FACILITY</div>
                  <div style={{ fontWeight: 700, marginTop: '0.2rem' }}>{selectedOpinion.reviewingCampus}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  CURRENT WORKING DIAGNOSIS
                </div>
                <div style={{ fontWeight: 700, color: 'var(--color-text)', marginTop: '0.25rem' }}>
                  {selectedOpinion.currentDiagnosis}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  SPECIFIC CLINICAL INQUIRIES
                </div>
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '0.25rem',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  {selectedOpinion.specificQuestions}
                </div>
              </div>

              {selectedOpinion.resultSummary && (
                <div
                  style={{
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #86EFAC',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <CheckCircle2 size={18} color="#15803D" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#166534' }}>
                      Collegiate Panel Review Consensus
                    </h4>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Reviewed by: {selectedOpinion.reviewingPanel}
                  </div>
                  <p style={{ color: '#14532D', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                    {selectedOpinion.resultSummary}
                  </p>

                  {selectedOpinion.recommendations && selectedOpinion.recommendations.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', marginBottom: '0.35rem' }}>
                        Collegiate Recommendations:
                      </div>
                      <ul style={{ paddingLeft: '1.25rem', color: '#14532D', fontSize: '0.825rem', lineHeight: 1.5 }}>
                        {selectedOpinion.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {selectedOpinion.associatedReportCode && (
                <div
                  style={{
                    backgroundColor: '#EFF6FF',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #BFDBFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                      Cross-Referenced Medical Record:
                    </span>{' '}
                    <strong style={{ color: 'var(--color-primary-dark)' }}>{selectedOpinion.associatedReportCode}</strong>
                  </div>
                  {onOpenMedicalRecord && (
                    <button
                      type="button"
                      onClick={() => {
                        const recCode = selectedOpinion.associatedReportCode!;
                        setSelectedOpinion(null);
                        onOpenMedicalRecord(recCode);
                      }}
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <span>Open Consultation Record</span>
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '1rem',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedOpinion(null)}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: 'var(--color-text)',
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '1px solid var(--color-border)',
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

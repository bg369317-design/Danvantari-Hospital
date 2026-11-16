import React, { useState } from 'react';
import {
  MedicalRecordItem,
  ExternalMedicalHistoryItem,
  ExternalPrescriptionMedication,
  ExternalMedicalDocument,
} from '@/types/patientPortal';
import { PATIENT_DEMO_NOTICE } from '@/config/patientSampleData';
import {
  Building,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2,
  Paperclip,
  AlertCircle,
  X,
  Upload,
} from 'lucide-react';

interface MedicalRecordsPageProps {
  hospitalRecords: MedicalRecordItem[];
  externalRecords: ExternalMedicalHistoryItem[];
  onAddExternalRecord: (record: ExternalMedicalHistoryItem) => void;
  onUpdateExternalRecord: (record: ExternalMedicalHistoryItem) => void;
  onDeleteExternalRecord: (id: string) => void;
}

export const MedicalRecordsPage: React.FC<MedicalRecordsPageProps> = ({
  hospitalRecords,
  externalRecords,
  onAddExternalRecord,
  onUpdateExternalRecord,
  onDeleteExternalRecord,
}) => {
  const [activeTab, setActiveTab] = useState<'hospital' | 'external'>('hospital');
  const [expandedHospitalId, setExpandedHospitalId] = useState<string | null>(hospitalRecords[0]?.id ?? null);
  const [expandedExternalId, setExpandedExternalId] = useState<string | null>(null);

  // External Record Form State (Modal)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // Form Fields
  const [facilityName, setFacilityName] = useState<string>('');
  const [consultantName, setConsultantName] = useState<string>('');
  const [treatmentDate, setTreatmentDate] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [treatmentSummary, setTreatmentSummary] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Dynamic Medications List
  const [medications, setMedications] = useState<ExternalPrescriptionMedication[]>([
    { id: 'med-1', name: '', dosage: '', frequency: '', duration: '' },
  ]);

  // Document Attachments
  const [attachments, setAttachments] = useState<ExternalMedicalDocument[]>([]);
  const [newDocName, setNewDocName] = useState<string>('');
  const [newDocType, setNewDocType] = useState<ExternalMedicalDocument['docType']>('Previous Prescription');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [formValidationErrors, setFormValidationErrors] = useState<Record<string, string>>({});

  const handleOpenAddForm = () => {
    setEditingRecordId(null);
    setFacilityName('');
    setConsultantName('');
    setTreatmentDate('');
    setSpecialty('');
    setDiagnosis('');
    setTreatmentSummary('');
    setAdditionalNotes('');
    setMedications([{ id: `med-${Date.now()}`, name: '', dosage: '', frequency: '', duration: '' }]);
    setAttachments([]);
    setFormValidationErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (rec: ExternalMedicalHistoryItem) => {
    setEditingRecordId(rec.id);
    setFacilityName(rec.facilityName);
    setConsultantName(rec.consultantName);
    setTreatmentDate(rec.treatmentDate);
    setSpecialty(rec.specialty);
    setDiagnosis(rec.diagnosis);
    setTreatmentSummary(rec.treatmentSummary);
    setAdditionalNotes(rec.additionalNotes);
    setMedications(
      rec.medications.length > 0
        ? rec.medications
        : [{ id: `med-${Date.now()}`, name: '', dosage: '', frequency: '', duration: '' }]
    );
    setAttachments(rec.attachments);
    setFormValidationErrors({});
    setIsFormOpen(true);
  };

  const handleAddMedicationRow = () => {
    setMedications((prev) => [
      ...prev,
      { id: `med-${Date.now()}-${Math.random()}`, name: '', dosage: '', frequency: '', duration: '' },
    ]);
  };

  const handleRemoveMedicationRow = (id: string) => {
    if (medications.length === 1) return;
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const handleMedicationChange = (id: string, field: keyof ExternalPrescriptionMedication, value: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSimulatedFileUpload = () => {
    if (!newDocName.trim()) {
      setUploadError('Please specify document or file name.');
      return;
    }
    setUploadError(null);

    const newDoc: ExternalMedicalDocument = {
      id: `doc-${Date.now()}`,
      fileName: newDocName.trim().endsWith('.pdf') ? newDocName.trim() : `${newDocName.trim()}.pdf`,
      docType: newDocType,
      fileSizeKb: Math.floor(150 + Math.random() * 450),
      uploadedAt: new Date().toISOString().split('T')[0] ?? '2026-11-16',
    };

    setAttachments((prev) => [...prev, newDoc]);
    setNewDocName('');
  };

  const handleRemoveAttachment = (docId: string) => {
    setAttachments((prev) => prev.filter((d) => d.id !== docId));
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!facilityName.trim()) errs.facilityName = 'Previous hospital / clinic name is required.';
    if (!treatmentDate.trim()) errs.treatmentDate = 'Treatment date is required.';
    if (!specialty.trim()) errs.specialty = 'Specialty or medical department is required.';
    if (!diagnosis.trim()) errs.diagnosis = 'Health condition or diagnosis is required.';

    setFormValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const filteredMeds = medications.filter((m) => m.name.trim() !== '');

    if (editingRecordId) {
      const existing = externalRecords.find((r) => r.id === editingRecordId);
      if (existing) {
        const updated: ExternalMedicalHistoryItem = {
          ...existing,
          facilityName: facilityName.trim(),
          consultantName: consultantName.trim() || 'Attending Physician',
          treatmentDate,
          specialty: specialty.trim(),
          diagnosis: diagnosis.trim(),
          treatmentSummary: treatmentSummary.trim() || 'Outpatient clinical care summary.',
          medications: filteredMeds,
          additionalNotes: additionalNotes.trim(),
          attachments,
        };
        onUpdateExternalRecord(updated);
      }
    } else {
      const newRec: ExternalMedicalHistoryItem = {
        id: `ext-${Date.now()}`,
        recordCode: `EXT-DEMO-${Math.floor(100 + Math.random() * 900)}`,
        facilityName: facilityName.trim(),
        consultantName: consultantName.trim() || 'Attending Physician',
        treatmentDate,
        specialty: specialty.trim(),
        diagnosis: diagnosis.trim(),
        treatmentSummary: treatmentSummary.trim() || 'Outpatient clinical care summary.',
        medications: filteredMeds,
        additionalNotes: additionalNotes.trim(),
        attachments,
        isPatientProvided: true,
      };
      onAddExternalRecord(newRec);
    }

    setIsFormOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Strip with Section Switcher */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            Medical Records &amp; Clinical History
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Danvantari Hospital consultation files and patient-managed external treatment history.
          </p>
        </div>

        {activeTab === 'external' && (
          <button
            onClick={handleOpenAddForm}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              padding: '0.65rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            <span>Add External Medical History</span>
          </button>
        )}
      </div>

      {/* Tabs Switcher: Danvantari Hospital Records vs External Medical History */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => setActiveTab('hospital')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'hospital' ? 700 : 500,
            backgroundColor: activeTab === 'hospital' ? 'var(--color-primary)' : '#FFFFFF',
            color: activeTab === 'hospital' ? '#FFFFFF' : 'var(--color-text)',
            border: '1px solid var(--color-border)',
            boxShadow: activeTab === 'hospital' ? 'var(--shadow-sm)' : 'none',
            cursor: 'pointer',
          }}
        >
          Danvantari Hospital Records ({hospitalRecords.length})
        </button>

        <button
          onClick={() => setActiveTab('external')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'external' ? 700 : 500,
            backgroundColor: activeTab === 'external' ? 'var(--color-teal)' : '#FFFFFF',
            color: activeTab === 'external' ? '#FFFFFF' : 'var(--color-text)',
            border: '1px solid var(--color-border)',
            boxShadow: activeTab === 'external' ? 'var(--shadow-sm)' : 'none',
            cursor: 'pointer',
          }}
        >
          External Medical History ({externalRecords.length})
        </button>
      </div>

      {/* Tab 1: Hospital EHR Records */}
      {activeTab === 'hospital' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {hospitalRecords.map((rec) => {
            const isExpanded = expandedHospitalId === rec.id;
            return (
              <div
                key={rec.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                }}
              >
                <div
                  onClick={() => setExpandedHospitalId(isExpanded ? null : rec.id)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: isExpanded ? 'var(--color-bg)' : '#FFFFFF',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          backgroundColor: 'var(--color-primary-light)',
                          color: 'var(--color-primary)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {rec.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        Ref: {rec.recordCode}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Date: {rec.date}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                      {rec.diagnosisSummary}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-teal)', fontWeight: 600 }}>
                      {rec.doctorName} • {rec.department}
                    </div>
                  </div>

                  <div style={{ color: 'var(--color-text-muted)' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Clinical Assessment &amp; Findings:
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.25rem' }}>
                      {rec.keyFindings.map((finding, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                            fontSize: '0.85rem',
                            color: 'var(--color-text)',
                            marginBottom: '0.45rem',
                            lineHeight: 1.45,
                          }}
                        >
                          <CheckCircle size={15} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: '0.85rem',
                        fontSize: '0.78rem',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      <div>Facility: {rec.facility} (Hospital EHR Archive)</div>
                      <span style={{ color: '#D97706', fontWeight: 600 }}>
                        Danvantari Verified Record (Demo File)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: External Medical History (Patient-Provided) */}
      {activeTab === 'external' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Patient-Provided Disclaimer Banner */}
          <div
            style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              color: '#92400E',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0 }} />
            <span>
              <strong>Patient-Provided Records:</strong> {PATIENT_DEMO_NOTICE.externalRecordsDisclaimer}
            </span>
          </div>

          {externalRecords.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px dashed var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '3rem 1.5rem',
                textAlign: 'center',
              }}
            >
              <Building size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>No External Medical History Recorded</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', maxWidth: '440px', margin: '0.35rem auto 1rem auto' }}>
                You can record treatments, prescriptions, and upload past reports from other medical institutions to share with your consulting physicians.
              </p>
              <button
                onClick={handleOpenAddForm}
                style={{
                  backgroundColor: 'var(--color-teal)',
                  color: '#FFFFFF',
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Add Your First External Record
              </button>
            </div>
          ) : (
            externalRecords.map((ext) => {
              const isExpanded = expandedExternalId === ext.id;
              return (
                <div
                  key={ext.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      backgroundColor: isExpanded ? 'var(--color-bg)' : '#FFFFFF',
                    }}
                  >
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpandedExternalId(isExpanded ? null : ext.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            border: '1px solid #FDE68A',
                          }}
                        >
                          External Hospital Record (Unverified)
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                          Ref: {ext.recordCode}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Treatment Date: {ext.treatmentDate}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                        {ext.diagnosis}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text)', marginTop: '0.2rem' }}>
                        Facility: <strong>{ext.facilityName}</strong> • Attending: {ext.consultantName} ({ext.specialty})
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenEditForm(ext)}
                        aria-label="Edit External Record"
                        style={{
                          padding: '0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text)',
                          cursor: 'pointer',
                        }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete the external medical record for "${ext.diagnosis}"?`)) {
                            onDeleteExternalRecord(ext.id);
                          }
                        }}
                        aria-label="Delete External Record"
                        style={{
                          padding: '0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#FEE2E2',
                          border: '1px solid #FCA5A5',
                          color: 'var(--color-error)',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        onClick={() => setExpandedExternalId(isExpanded ? null : ext.id)}
                        style={{ color: 'var(--color-text-muted)', padding: '0.4rem', cursor: 'pointer' }}
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}>
                      {/* Summary */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          Treatment Summary:
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                          {ext.treatmentSummary}
                        </p>
                      </div>

                      {/* Prescribed Medications */}
                      {ext.medications.length > 0 && (
                        <div style={{ marginBottom: '1.25rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-teal)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            Medicines Administered / Prescribed:
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                            {ext.medications.map((m) => (
                              <div
                                key={m.id}
                                style={{
                                  backgroundColor: 'var(--color-bg)',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid var(--color-border)',
                                  padding: '0.75rem',
                                  fontSize: '0.8rem',
                                }}
                              >
                                <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{m.name}</div>
                                <div style={{ color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                                  Dosage: {m.dosage} • {m.frequency}
                                </div>
                                {m.duration && <div style={{ color: 'var(--color-text-muted)' }}>Duration: {m.duration}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Attachments Section */}
                      {ext.attachments.length > 0 && (
                        <div style={{ marginBottom: '1.25rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            Attached External Documents ({ext.attachments.length}):
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {ext.attachments.map((doc) => (
                              <div
                                key={doc.id}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  backgroundColor: 'var(--color-bg)',
                                  border: '1px solid var(--color-border)',
                                  padding: '0.5rem 0.75rem',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.8rem',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <Paperclip size={14} color="var(--color-teal)" />
                                  <span style={{ fontWeight: 600 }}>{doc.fileName}</span>
                                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                                    ({doc.docType} • {doc.fileSizeKb} KB)
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 600 }}>
                                  Simulated Attachment
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Notes */}
                      {ext.additionalNotes && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                            Additional Patient Notes:
                          </h4>
                          <p style={{ fontSize: '0.825rem', color: 'var(--color-text)' }}>{ext.additionalNotes}</p>
                        </div>
                      )}

                      <div style={{ fontSize: '0.75rem', color: '#D97706', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                        * This entry was entered directly by the patient and has not been verified by Danvantari Hospital medical staff.
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add / Edit External Record Modal */}
      {isFormOpen && (
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
              maxWidth: '720px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  {editingRecordId ? 'Edit External Medical Record' : 'Add External Medical History'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Enter treatments received at previous clinics or hospitals for reference.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                style={{ padding: '0.35rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              {/* Row 1: Facility & Consultant */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label htmlFor="ext-facility" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Hospital or Clinic Name *
                  </label>
                  <input
                    id="ext-facility"
                    type="text"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="e.g. St. Jude Community Health Clinic"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: formValidationErrors.facilityName ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg)',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                  {formValidationErrors.facilityName && (
                    <span style={{ color: 'var(--color-error)', fontSize: '0.72rem', display: 'block', marginTop: '0.2rem' }}>
                      {formValidationErrors.facilityName}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="ext-consultant" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Doctor / Consultant Name
                  </label>
                  <input
                    id="ext-consultant"
                    type="text"
                    value={consultantName}
                    onChange={(e) => setConsultantName(e.target.value)}
                    placeholder="e.g. Dr. N. K. Menon"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg)',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Date & Specialty */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label htmlFor="ext-date" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Treatment Date *
                  </label>
                  <input
                    id="ext-date"
                    type="date"
                    value={treatmentDate}
                    onChange={(e) => setTreatmentDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: formValidationErrors.treatmentDate ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg)',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                  {formValidationErrors.treatmentDate && (
                    <span style={{ color: 'var(--color-error)', fontSize: '0.72rem', display: 'block', marginTop: '0.2rem' }}>
                      {formValidationErrors.treatmentDate}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="ext-specialty" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Specialty / Department *
                  </label>
                  <input
                    id="ext-specialty"
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Dermatology / Orthopedics"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: formValidationErrors.specialty ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg)',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Diagnosis */}
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="ext-diag" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Diagnosis or Health Condition *
                </label>
                <input
                  id="ext-diag"
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Contact Dermatitis or Right Ankle Sprain"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    border: formValidationErrors.diagnosis ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Treatment Description */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="ext-treat" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Treatment Description &amp; Care Details
                </label>
                <textarea
                  id="ext-treat"
                  rows={3}
                  value={treatmentSummary}
                  onChange={(e) => setTreatmentSummary(e.target.value)}
                  placeholder="Summary of tests done, doctor advice, physical therapy or surgical procedures..."
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Dynamic Medicines Form Block */}
              <div style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    Medicines Used (Multiple Entries Allowed)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicationRow}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--color-teal)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={13} />
                    <span>Add Another Medicine</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {medications.map((m) => (
                    <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Medicine Name (e.g. Levocetirizine)"
                        value={m.name}
                        onChange={(e) => handleMedicationChange(m.id, 'name', e.target.value)}
                        style={{ padding: '0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}
                      />
                      <input
                        type="text"
                        placeholder="Dosage (5mg)"
                        value={m.dosage}
                        onChange={(e) => handleMedicationChange(m.id, 'dosage', e.target.value)}
                        style={{ padding: '0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}
                      />
                      <input
                        type="text"
                        placeholder="Frequency (OD/BD)"
                        value={m.frequency}
                        onChange={(e) => handleMedicationChange(m.id, 'frequency', e.target.value)}
                        style={{ padding: '0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}
                      />
                      <input
                        type="text"
                        placeholder="Duration (5 Days)"
                        value={m.duration}
                        onChange={(e) => handleMedicationChange(m.id, 'duration', e.target.value)}
                        style={{ padding: '0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicationRow(m.id)}
                        disabled={medications.length === 1}
                        aria-label="Remove Medicine"
                        style={{ padding: '0.35rem', color: medications.length === 1 ? '#CBD5E1' : 'var(--color-error)', cursor: 'pointer' }}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Attachments Upload */}
              <div style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
                  External Document Attachments (Simulated)
                </label>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  {PATIENT_DEMO_NOTICE.externalDocsDisclaimer}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Document Title / File Name (e.g. Lab_Report_2025)"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    style={{ flex: 1, minWidth: '220px', padding: '0.45rem 0.65rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}
                  />
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as any)}
                    style={{ padding: '0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}
                  >
                    <option value="Previous Prescription">Previous Prescription</option>
                    <option value="Laboratory Report">Laboratory Report</option>
                    <option value="Diagnostic Scan / Imaging">Diagnostic Scan / Imaging</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Medical Certificate">Medical Certificate</option>
                    <option value="Other">Other Document</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleSimulatedFileUpload}
                    style={{
                      backgroundColor: 'var(--color-teal)',
                      color: '#FFF',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Upload size={13} />
                    <span>Attach</span>
                  </button>
                </div>

                {uploadError && <div style={{ color: 'var(--color-error)', fontSize: '0.72rem', marginBottom: '0.5rem' }}>{uploadError}</div>}

                {/* Attachments List */}
                {attachments.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#FFF',
                          border: '1px solid var(--color-border)',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                        }}
                      >
                        <span>{att.fileName} ({att.docType} • {att.fileSizeKb} KB)</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          style={{ color: 'var(--color-error)', cursor: 'pointer' }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    padding: '0.6rem 1.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {editingRecordId ? 'Update Record' : 'Save External Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

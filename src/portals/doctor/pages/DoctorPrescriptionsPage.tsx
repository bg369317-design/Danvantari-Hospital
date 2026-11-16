import React, { useState } from 'react';
import {
  DoctorPrescription,
  PrescribedMedicationRow,
} from '@/types/doctorPortal';
import {
  Pill,
  Plus,
  Trash2,
  Save,
  Eye,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface DoctorPrescriptionsPageProps {
  prescriptions: DoctorPrescription[];
  onSavePrescription: (prescription: DoctorPrescription) => void;
  defaultPatientId?: string;
  defaultPatientName?: string;
  defaultPatientUhid?: string;
}

export const DoctorPrescriptionsPage: React.FC<DoctorPrescriptionsPageProps> = ({
  prescriptions,
  onSavePrescription,
  defaultPatientId = 'pt-1',
  defaultPatientName = 'Vikram Joshi (Sample Patient)',
  defaultPatientUhid = 'DH-DEMO-2026-90412',
}) => {
  const [patientName] = useState<string>(defaultPatientName);
  const [patientUhid] = useState<string>(defaultPatientUhid);
  const [consultationRef, setConsultationRef] = useState<string>('APT-DEMO-7819');
  const [clinicalNotes, setClinicalNotes] = useState<string>('Blood pressure stable. Regular home monitoring advised.');

  // Medication rows
  const [medications, setMedications] = useState<PrescribedMedicationRow[]>([
    {
      id: 'med-row-1',
      medicineName: 'Telmisartan Tablets IP',
      dosage: '40 mg',
      frequency: 'Once Daily (Morning)',
      duration: '90 Days',
      route: 'Oral',
      instructions: 'Take post breakfast with a glass of water.',
      startDate: '2026-11-16',
      endDate: '2027-02-14',
    },
  ]);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);
  const [previewPrescription, setPreviewPrescription] = useState<DoctorPrescription | null>(null);

  const handleAddMedication = () => {
    const newMed: PrescribedMedicationRow = {
      id: `med-row-${Date.now()}`,
      medicineName: '',
      dosage: '',
      frequency: 'Once Daily',
      duration: '30 Days',
      route: 'Oral',
      instructions: 'Take post meals.',
      startDate: '2026-11-16',
      endDate: '2026-12-16',
    };
    setMedications([...medications, newMed]);
  };

  const handleRemoveMedication = (id: string) => {
    if (medications.length === 1) {
      setValidationError('A prescription must contain at least one medication.');
      return;
    }
    setMedications(medications.filter((m) => m.id !== id));
  };

  const handleMedChange = (id: string, field: keyof PrescribedMedicationRow, value: string) => {
    setMedications(
      medications.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const invalidMed = medications.find((m) => !m.medicineName.trim() || !m.dosage.trim());
    if (invalidMed) {
      setValidationError('Please specify medicine name and dosage for all prescribed items.');
      return;
    }

    setValidationError(null);

    const newRx: DoctorPrescription = {
      id: `rx-${Date.now()}`,
      rxCode: `RX-DEMO-${Math.floor(4600 + Math.random() * 400)}`,
      patientId: defaultPatientId,
      patientName,
      patientUhid,
      consultationRef,
      prescribedDate: '2026-11-16',
      doctorName: 'Dr. Aarav Sharma',
      doctorSpecialty: 'Cardiology & Heart Care',
      branchId: 'branch-central',
      branchName: 'Danvantari Central Campus (Demonstration Facility)',
      medications,
      status: 'Active',
      clinicalNotes,
    };

    onSavePrescription(newRx);
    setSuccessNote(`Demonstration Prescription ${newRx.rxCode} issued successfully for ${patientName}.`);
    setTimeout(() => setSuccessNote(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Pill size={22} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            E-Prescription &amp; Medication Order Console
          </h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Formulate structured pharmacological orders, dosage schedules, patient instructions, and consultation prescription records.
        </p>

        {successNote && (
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
            <span>{successNote}</span>
          </div>
        )}
      </div>

      {/* Mandatory Prescription Disclaimer */}
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
          fontSize: '0.825rem',
        }}
      >
        <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0 }} />
        <div>
          <strong>DEMONSTRATION ONLY – NOT A VALID PRESCRIPTION FOR DISPENSING:</strong> These digital medication records are illustrative prototypes for EHR UI demonstration. No actual pharmaceutical delivery, pharmacy substitution, or dispensing is supported.
        </div>
      </div>

      {/* Prescription Form */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Metadata Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              backgroundColor: '#F8FAFC',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>PATIENT</span>
              <div style={{ fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '0.2rem' }}>
                {patientName} ({patientUhid})
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>PRESCRIBING DOCTOR</span>
              <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
                Dr. Aarav Sharma, MD, DM
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>CONSULTATION REF</span>
              <input
                type="text"
                value={consultationRef}
                onChange={(e) => setConsultationRef(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '0.2rem',
                  padding: '0.35rem 0.5rem',
                  fontSize: '0.8rem',
                  borderRadius: '4px',
                  border: '1px solid #CBD5E1',
                }}
              />
            </div>
          </div>

          {validationError && (
            <div
              role="alert"
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          {/* Dynamic Medicines Rows */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Prescribed Medications List ({medications.length})
              </h3>
              <button
                type="button"
                onClick={handleAddMedication}
                style={{
                  backgroundColor: '#EFF6FF',
                  color: 'var(--color-primary)',
                  border: '1px solid #BFDBFE',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Plus size={14} />
                <span>Add Another Drug</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {medications.map((med, index) => (
                <div
                  key={med.id}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      MEDICATION #{index + 1}
                    </span>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(med.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#DC2626',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                        Drug / Formulation Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Telmisartan Tablets IP"
                        value={med.medicineName}
                        onChange={(e) => handleMedChange(med.id, 'medicineName', e.target.value)}
                        style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                        Dosage / Strength *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 40 mg"
                        value={med.dosage}
                        onChange={(e) => handleMedChange(med.id, 'dosage', e.target.value)}
                        style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                        Frequency
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Once Daily (Morning)"
                        value={med.frequency}
                        onChange={(e) => handleMedChange(med.id, 'frequency', e.target.value)}
                        style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 90 Days"
                        value={med.duration}
                        onChange={(e) => handleMedChange(med.id, 'duration', e.target.value)}
                        style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                        Route
                      </label>
                      <select
                        value={med.route}
                        onChange={(e) => handleMedChange(med.id, 'route', e.target.value)}
                        style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}
                      >
                        <option value="Oral">Oral (PO)</option>
                        <option value="Topical">Topical</option>
                        <option value="Inhalation">Inhalation</option>
                        <option value="Sublingual">Sublingual</option>
                        <option value="Intravenous">Intravenous (IV)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.2rem' }}>
                      Physician Usage Instructions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Take morning after breakfast with plenty of water."
                      value={med.instructions}
                      onChange={(e) => handleMedChange(med.id, 'instructions', e.target.value)}
                      style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#FFF' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Additional Clinical Notes / Refill Instructions
            </label>
            <input
              type="text"
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => {
                const rxObj: DoctorPrescription = {
                  id: 'preview',
                  rxCode: 'RX-PREVIEW',
                  patientId: defaultPatientId,
                  patientName,
                  patientUhid,
                  consultationRef,
                  prescribedDate: '2026-11-16',
                  doctorName: 'Dr. Aarav Sharma',
                  doctorSpecialty: 'Cardiology & Heart Care',
                  branchId: 'branch-central',
                  branchName: 'Danvantari Central Campus',
                  medications,
                  status: 'Active',
                  clinicalNotes,
                };
                setPreviewPrescription(rxObj);
              }}
              style={{
                backgroundColor: '#F8FAFC',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Eye size={15} />
              <span>Preview Rx</span>
            </button>

            <button
              type="submit"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.65rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Save size={15} />
              <span>Save &amp; Authorize E-Prescription (Demo)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Previously Issued Prescriptions History */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '1.5rem',
        }}
      >
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
          Previously Prescribed Regimens ({prescriptions.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                padding: '1rem 1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--color-primary-dark)' }}>{rx.patientName}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>({rx.patientUhid})</span>
                    <span
                      style={{
                        backgroundColor: rx.status === 'Active' ? '#DCFCE7' : '#F1F5F9',
                        color: rx.status === 'Active' ? '#15803D' : '#475569',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.45rem',
                        borderRadius: '4px',
                      }}
                    >
                      {rx.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                    Rx Ref: <strong>{rx.rxCode}</strong> • Prescribed: {rx.prescribedDate} by {rx.doctorName}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: '#334155' }}>
                {rx.medications.map((m, i) => (
                  <div key={i} style={{ padding: '0.2rem 0' }}>
                    • <strong>{m.medicineName}</strong> {m.dosage} — {m.frequency} ({m.duration}) [{m.instructions}]
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewPrescription && (
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
              maxWidth: '650px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  DANVANTARI HOSPITAL • OUTPATIENT PRESCRIPTION
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {previewPrescription.doctorName} • {previewPrescription.doctorSpecialty}
                </div>
              </div>
              <button onClick={() => setPreviewPrescription(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px dashed #EF4444',
                color: '#991B1B',
                padding: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '1rem',
              }}
            >
              DEMONSTRATION ONLY – NOT A VALID PRESCRIPTION FOR DISPENSING
            </div>

            <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div>Patient: <strong>{previewPrescription.patientName}</strong> ({previewPrescription.patientUhid})</div>
              <div>Consultation Ref: {previewPrescription.consultationRef}</div>
              <div>Date: {previewPrescription.prescribedDate}</div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '1rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #CBD5E1' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Rx Drug</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Dosage</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Frequency</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {previewPrescription.medications.map((m, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.5rem' }}><strong>{m.medicineName}</strong></td>
                    <td style={{ padding: '0.5rem' }}>{m.dosage}</td>
                    <td style={{ padding: '0.5rem' }}>{m.frequency}</td>
                    <td style={{ padding: '0.5rem' }}>{m.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setPreviewPrescription(null)}
                style={{ padding: '0.5rem 1.25rem', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

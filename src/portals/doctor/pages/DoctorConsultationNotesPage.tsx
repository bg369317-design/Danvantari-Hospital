import React, { useState } from 'react';
import { SoapNote, QueuePatientItem } from '@/types/doctorPortal';
import {
  Stethoscope,
  Save,
  CheckCircle2,
  Eye,
} from 'lucide-react';

interface DoctorConsultationNotesPageProps {
  soapNotes: SoapNote[];
  activePatient?: QueuePatientItem | null;
  onSaveSoapNote: (note: SoapNote) => void;
  onCompleteConsultation: (noteId: string) => void;
}

export const DoctorConsultationNotesPage: React.FC<DoctorConsultationNotesPageProps> = ({
  soapNotes: _soapNotes,
  activePatient,
  onSaveSoapNote,
  onCompleteConsultation,
}) => {
  // Active Form State
  const selectedPatientName =
    activePatient?.patientName || 'Vikram Joshi (Sample Patient)';
  const selectedPatientUhid =
    activePatient?.patientUhid || 'DH-DEMO-2026-90412';
  const [appointmentCode, setAppointmentCode] = useState<string>(
    activePatient?.appointmentCode || 'APT-DEMO-7819'
  );

  // SOAP Fields
  const [chiefComplaint, setChiefComplaint] = useState<string>(
    activePatient?.reasonForVisit || 'Routine cardiovascular follow-up & blood pressure evaluation.'
  );
  const [historyOfPresentIllness, setHistoryOfPresentIllness] = useState<string>(
    'Patient reports compliant morning medication adherence with Telmisartan 40mg. Denies chest pressure, orthopnea, or ankle swelling.'
  );
  const [relevantMedicalHistory, setRelevantMedicalHistory] = useState<string>(
    'Stage 1 Essential Hypertension. Documented Penicillin allergy.'
  );

  // Objective / Vitals
  const [bp, setBp] = useState<string>(activePatient?.vitals?.bp || '128/82 mmHg');
  const [pulse, setPulse] = useState<string>(activePatient?.vitals?.pulse || '74 bpm');
  const [temp, setTemp] = useState<string>(activePatient?.vitals?.temp || '98.4 °F');
  const [spo2, setSpo2] = useState<string>(activePatient?.vitals?.spo2 || '99%');
  const [weight, setWeight] = useState<string>('74.2 kg');
  const [physicalExamination, setPhysicalExamination] = useState<string>(
    'Well-oriented, non-distressed. S1, S2 audible, regular rate, no murmurs. Lungs clear bilaterally. Peripheral pulses full and symmetric.'
  );

  // Assessment
  const [assessmentDiagnosis, setAssessmentDiagnosis] = useState<string>(
    'Essential Hypertension (Stage 1), well-controlled under monotherapy.'
  );
  const [clinicalImpression, setClinicalImpression] = useState<string>(
    'Fasting lipid chemistry shows desirable baseline profile. Low cardiovascular risk.'
  );

  // Plan
  const [pharmacologicalPlan, setPharmacologicalPlan] = useState<string>(
    'Continue Tab Telmisartan 40 mg PO OD after breakfast for 90 days.'
  );
  const [investigationsOrdered, setInvestigationsOrdered] = useState<string>(
    'Serum Creatinine & Electrolytes in 6 months.'
  );
  const [dietAndLifestyle, setDietAndLifestyle] = useState<string>(
    'Maintain daily sodium restriction (< 2 g/day). 30 minutes brisk walking 5 days/week.'
  );
  const [followUpInstructions, setFollowUpInstructions] = useState<string>(
    'Review in OPD in 12 weeks with home blood pressure logs.'
  );
  const [followUpDate, setFollowUpDate] = useState<string>('2027-02-15');

  // Preview & Confirm Modal
  const [previewNote, setPreviewNote] = useState<SoapNote | null>(null);
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote: SoapNote = {
      id: `soap-${Date.now()}`,
      noteCode: `NOTE-DEMO-${Math.floor(502 + Math.random() * 100)}`,
      patientId: 'pt-1',
      patientName: selectedPatientName,
      patientUhid: selectedPatientUhid,
      appointmentCode,
      consultationDate: '2026-11-16 ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      doctorName: 'Dr. Aarav Sharma',
      doctorSpecialty: 'Cardiology & Heart Care',
      branchId: activePatient?.branchId || 'branch-central',
      branchName: activePatient?.branchName || 'Danvantari Central Campus (Demonstration Facility)',
      chiefComplaint,
      historyOfPresentIllness,
      relevantMedicalHistory,
      vitals: { bp, pulse, temp, spo2, weight },
      physicalExamination,
      assessmentDiagnosis,
      clinicalImpression,
      pharmacologicalPlan,
      investigationsOrdered,
      dietAndLifestyle,
      followUpInstructions,
      followUpDate,
      status: 'Draft',
      savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSaveSoapNote(newNote);
    setSaveSuccessMsg(`SOAP Draft ${newNote.noteCode} saved successfully.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleFinalizeNote = () => {
    const finalizedNote: SoapNote = {
      id: `soap-${Date.now()}`,
      noteCode: `NOTE-DEMO-${Math.floor(502 + Math.random() * 100)}`,
      patientId: 'pt-1',
      patientName: selectedPatientName,
      patientUhid: selectedPatientUhid,
      appointmentCode,
      consultationDate: '2026-11-16 ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      doctorName: 'Dr. Aarav Sharma',
      doctorSpecialty: 'Cardiology & Heart Care',
      branchId: activePatient?.branchId || 'branch-central',
      branchName: activePatient?.branchName || 'Danvantari Central Campus (Demonstration Facility)',
      chiefComplaint,
      historyOfPresentIllness,
      relevantMedicalHistory,
      vitals: { bp, pulse, temp, spo2, weight },
      physicalExamination,
      assessmentDiagnosis,
      clinicalImpression,
      pharmacologicalPlan,
      investigationsOrdered,
      dietAndLifestyle,
      followUpInstructions,
      followUpDate,
      status: 'Finalized (Demo)',
      savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSaveSoapNote(finalizedNote);
    onCompleteConsultation(finalizedNote.id);
    setConfirmCompleteOpen(false);
    setSaveSuccessMsg(`Consultation note finalized for ${selectedPatientName}. Consultation marked completed.`);
    setTimeout(() => setSaveSuccessMsg(null), 5000);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Stethoscope size={22} color="var(--color-primary)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            SOAP Clinical Consultation Notes Workspace
          </h2>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Structured Subjective, Objective, Assessment, and Plan documentation for outpatient clinical encounters.
        </p>

        {saveSuccessMsg && (
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
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Main SOAP Editor */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <form onSubmit={handleSaveDraft} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header Metadata */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                PATIENT NAME &amp; UHID
              </label>
              <input
                type="text"
                value={`${selectedPatientName} (${selectedPatientUhid})`}
                disabled
                style={{
                  width: '100%',
                  padding: '0.45rem',
                  fontSize: '0.825rem',
                  borderRadius: '4px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontWeight: 600,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                APPOINTMENT CODE
              </label>
              <input
                type="text"
                value={appointmentCode}
                onChange={(e) => setAppointmentCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem',
                  fontSize: '0.825rem',
                  borderRadius: '4px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                CONSULTATION DATE
              </label>
              <input
                type="text"
                value="16 Nov 2026, 10:15 AM (Today)"
                disabled
                style={{
                  width: '100%',
                  padding: '0.45rem',
                  fontSize: '0.825rem',
                  borderRadius: '4px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>
          </div>

          {/* S - SUBJECTIVE */}
          <div style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
              S — Subjective (Patient Narrative &amp; Complaints)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Chief Complaint *
                </label>
                <input
                  type="text"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  History of Present Illness (HPI)
                </label>
                <textarea
                  rows={3}
                  value={historyOfPresentIllness}
                  onChange={(e) => setHistoryOfPresentIllness(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Relevant Past Medical / Medication History
                </label>
                <input
                  type="text"
                  value={relevantMedicalHistory}
                  onChange={(e) => setRelevantMedicalHistory(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                />
              </div>
            </div>
          </div>

          {/* O - OBJECTIVE */}
          <div style={{ borderLeft: '4px solid var(--color-teal)', paddingLeft: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-teal)', marginBottom: '0.75rem' }}>
              O — Objective (Vitals &amp; Physical Examination)
            </h3>
            {/* Vitals Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Blood Pressure</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Pulse Rate</label>
                <input
                  type="text"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Temperature</label>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Oxygen (SpO2)</label>
                <input
                  type="text"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Physical Examination Notes
              </label>
              <textarea
                rows={3}
                value={physicalExamination}
                onChange={(e) => setPhysicalExamination(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* A - ASSESSMENT */}
          <div style={{ borderLeft: '4px solid #D97706', paddingLeft: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#D97706', marginBottom: '0.75rem' }}>
              A — Assessment (Clinical Diagnosis &amp; Impression)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Primary Assessment Diagnosis *
                </label>
                <input
                  type="text"
                  value={assessmentDiagnosis}
                  onChange={(e) => setAssessmentDiagnosis(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Clinical Impression / Progress
                </label>
                <input
                  type="text"
                  value={clinicalImpression}
                  onChange={(e) => setClinicalImpression(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                />
              </div>
            </div>
          </div>

          {/* P - PLAN */}
          <div style={{ borderLeft: '4px solid #16A34A', paddingLeft: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16A34A', marginBottom: '0.75rem' }}>
              P — Plan (Pharmacology, Diagnostics, Lifestyle &amp; Follow-up)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Pharmacological Plan
                </label>
                <input
                  type="text"
                  value={pharmacologicalPlan}
                  onChange={(e) => setPharmacologicalPlan(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Investigations Ordered
                  </label>
                  <input
                    type="text"
                    value={investigationsOrdered}
                    onChange={(e) => setInvestigationsOrdered(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Dietary &amp; Activity Instructions
                  </label>
                  <input
                    type="text"
                    value={dietAndLifestyle}
                    onChange={(e) => setDietAndLifestyle(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Follow-up Instructions
                  </label>
                  <input
                    type="text"
                    value={followUpInstructions}
                    onChange={(e) => setFollowUpInstructions(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Recommended Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.825rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              borderTop: '1px solid var(--color-border)',
              paddingTop: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="submit"
              style={{
                backgroundColor: '#F8FAFC',
                color: 'var(--color-primary-dark)',
                border: '1px solid var(--color-border)',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Save size={16} />
              <span>Save SOAP Draft</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const noteObj: SoapNote = {
                  id: 'preview',
                  noteCode: 'NOTE-PREVIEW',
                  patientId: 'pt-1',
                  patientName: selectedPatientName,
                  patientUhid: selectedPatientUhid,
                  appointmentCode,
                  consultationDate: '16 Nov 2026',
                  doctorName: 'Dr. Aarav Sharma',
                  doctorSpecialty: 'Cardiology & Heart Care',
                  branchId: activePatient?.branchId || 'branch-central',
                  branchName: activePatient?.branchName || 'Danvantari Central Campus',
                  chiefComplaint,
                  historyOfPresentIllness,
                  relevantMedicalHistory,
                  vitals: { bp, pulse, temp, spo2, weight },
                  physicalExamination,
                  assessmentDiagnosis,
                  clinicalImpression,
                  pharmacologicalPlan,
                  investigationsOrdered,
                  dietAndLifestyle,
                  followUpInstructions,
                  followUpDate,
                  status: 'Draft',
                  savedAt: 'Now',
                };
                setPreviewNote(noteObj);
              }}
              style={{
                backgroundColor: '#F8FAFC',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Eye size={16} />
              <span>Preview Note</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmCompleteOpen(true)}
              style={{
                backgroundColor: '#16A34A',
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
              <CheckCircle2 size={16} />
              <span>Finalize &amp; Complete Consultation</span>
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Complete Modal */}
      {confirmCompleteOpen && (
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
              maxWidth: '450px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              Finalize Clinical Consultation?
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Finalizing this note will archive the SOAP record and automatically mark <strong>{selectedPatientName}</strong> as <strong>Completed</strong> in the OPD queue.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setConfirmCompleteOpen(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#F8FAFC', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Back to Editing
              </button>
              <button
                onClick={handleFinalizeNote}
                style={{ padding: '0.5rem 1.25rem', borderRadius: '4px', border: 'none', backgroundColor: '#16A34A', color: '#FFFFFF', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Confirm &amp; Finalize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewNote && (
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
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  DANVANTARI HOSPITAL • CLINICAL NOTE PREVIEW
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Physician: Dr. Aarav Sharma, MD, DM • Patient: {previewNote.patientName} ({previewNote.patientUhid})
                </div>
              </div>
              <button onClick={() => setPreviewNote(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div><strong>Chief Complaint:</strong> {previewNote.chiefComplaint}</div>
              <div><strong>HPI:</strong> {previewNote.historyOfPresentIllness}</div>
              <div><strong>Vitals:</strong> BP {previewNote.vitals.bp} • Pulse {previewNote.vitals.pulse} • SpO2 {previewNote.vitals.spo2} • Temp {previewNote.vitals.temp}</div>
              <div><strong>Assessment:</strong> {previewNote.assessmentDiagnosis}</div>
              <div><strong>Plan:</strong> {previewNote.pharmacologicalPlan}</div>
              <div><strong>Instructions:</strong> {previewNote.followUpInstructions}</div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={() => setPreviewNote(null)}
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

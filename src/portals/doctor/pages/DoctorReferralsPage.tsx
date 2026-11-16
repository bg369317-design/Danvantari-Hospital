import React, { useState } from 'react';
import {
  Share2,
  Plus,
  Search,
  Filter,
  User,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ClinicalReferral, ReferralStatus } from '@/types/doctorPortal';
import { SAMPLE_BRANCHES, SAMPLE_SPECIALTIES, SAMPLE_DOCTORS } from '@/config/publicSampleData';
import { SAMPLE_PATIENT_CHARTS } from '@/config/doctorSampleData';

interface DoctorReferralsPageProps {
  referrals: ClinicalReferral[];
  onCreateReferral: (
    referral: Omit<ClinicalReferral, 'id' | 'referralCode' | 'referralDate' | 'status'>
  ) => void;
  onUpdateReferralStatus: (id: string, status: ReferralStatus) => void;
}

export const DoctorReferralsPage: React.FC<DoctorReferralsPageProps> = ({
  referrals,
  onCreateReferral,
  onUpdateReferralStatus,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReferralStatus>('all');
  const [expandedReferralId, setExpandedReferralId] = useState<string | null>(null);

  // Form state
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pt-1');
  const [receivingSpecialty, setReceivingSpecialty] = useState<string>('Endocrinology & Diabetology');
  const [receivingDoctor, setReceivingDoctor] = useState<string>('Dr. Rajesh Nambiar');
  const [destinationBranchId, setDestinationBranchId] = useState<string>('branch-central');
  const [priority, setPriority] = useState<'Routine' | 'Priority / Expedited' | 'Emergency Triage'>('Routine');
  const [clinicalReason, setClinicalReason] = useState<string>('');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Doctor list filtered by specialty
  const specialtyDoctors = SAMPLE_DOCTORS.filter(
    (doc) => doc.specialtyName.toLowerCase() === receivingSpecialty.toLowerCase()
  );

  const handleSpecialtyChange = (specName: string) => {
    setReceivingSpecialty(specName);
    const docs = SAMPLE_DOCTORS.filter((d) => d.specialtyName.toLowerCase() === specName.toLowerCase());
    if (docs.length > 0 && docs[0]) {
      setReceivingDoctor(docs[0].fullName);
    } else {
      setReceivingDoctor('Consultant Specialist on Duty');
    }
  };

  const handleSubmitReferral = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!clinicalReason.trim()) {
      setFormError('Please enter a clinical indication / reason for this referral.');
      return;
    }

    const patient = SAMPLE_PATIENT_CHARTS[selectedPatientId];
    if (!patient) {
      setFormError('Selected patient is invalid.');
      return;
    }

    const targetBranch = SAMPLE_BRANCHES.find((b) => b.id === destinationBranchId);

    onCreateReferral({
      patientId: patient.demographics.id,
      patientName: patient.demographics.fullName,
      patientUhid: patient.demographics.uhid,
      referringDoctor: 'Dr. Aarav Sharma',
      referringSpecialty: 'Cardiology',
      originBranchId: 'branch-central',
      originBranchName: 'Danvantari Central Campus (Demonstration Facility)',
      receivingSpecialty,
      receivingDoctor,
      destinationBranchId,
      destinationBranchName: targetBranch ? targetBranch.name : 'Danvantari Central Campus',
      priority,
      clinicalReason: clinicalReason.trim(),
      clinicalNotes: clinicalNotes.trim(),
    });

    setClinicalReason('');
    setClinicalNotes('');
    setShowCreateForm(false);
    setSuccessMessage('Referral order generated and routed to the specialty service (Demonstration Flow).');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const filteredReferrals = referrals.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patientUhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referralCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.receivingSpecialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.receivingDoctor.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

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
            <Share2 size={14} />
            <span>Inter-Departmental Clinical Handover</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            Specialist Referrals
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Coordinate secondary consults, cross-specialty opinions, and tertiary center transfers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: showCreateForm ? '#F1F5F9' : 'var(--color-primary)',
              color: showCreateForm ? 'var(--color-text)' : '#FFFFFF',
              border: showCreateForm ? '1px solid var(--color-border)' : 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            <span>{showCreateForm ? 'Close Referral Form' : 'New Specialist Referral'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            color: '#15803D',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
          }}
        >
          <CheckCircle size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Create Referral Form Panel */}
      {showCreateForm && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>
              Create Clinical Specialist Referral
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Referring Doctor: <strong>Dr. Aarav Sharma (Cardiology)</strong>
            </span>
          </div>

          {formError && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                padding: '0.75rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <AlertCircle size={15} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitReferral}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              {/* Patient Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {Object.values(SAMPLE_PATIENT_CHARTS).map((chart) => (
                    <option key={chart.demographics.id} value={chart.demographics.id}>
                      {chart.demographics.fullName} ({chart.demographics.uhid}) - Age {chart.demographics.age}
                    </option>
                  ))}
                </select>
              </div>

              {/* Receiving Specialty */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Target Specialty
                </label>
                <select
                  value={receivingSpecialty}
                  onChange={(e) => handleSpecialtyChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {SAMPLE_SPECIALTIES.map((spec) => (
                    <option key={spec.id} value={spec.name}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Receiving Consultant */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Receiving Consultant
                </label>
                <select
                  value={receivingDoctor}
                  onChange={(e) => setReceivingDoctor(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {specialtyDoctors.length > 0 ? (
                    specialtyDoctors.map((doc) => (
                      <option key={doc.id} value={doc.fullName}>
                        {doc.fullName} ({doc.qualifications})
                      </option>
                    ))
                  ) : (
                    <option value="Consultant Specialist on Duty">Consultant Specialist on Duty</option>
                  )}
                </select>
              </div>

              {/* Destination Branch */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Destination Branch
                </label>
                <select
                  value={destinationBranchId}
                  onChange={(e) => setDestinationBranchId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {SAMPLE_BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                  Clinical Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as typeof priority)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    fontSize: '0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="Routine">Routine (Within 7-14 Days)</option>
                  <option value="Priority / Expedited">Priority / Expedited (Within 24-48 Hours)</option>
                  <option value="Emergency Triage">Emergency Triage (Immediate In-Hospital)</option>
                </select>
              </div>
            </div>

            {/* Clinical Reason & Handover Notes */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                Clinical Indication &amp; Chief Reason for Referral *
              </label>
              <input
                type="text"
                placeholder="e.g. Uncontrolled glycemic spikes with secondary peripheral neuropathy"
                value={clinicalReason}
                onChange={(e) => setClinicalReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.35rem' }}>
                Handover Notes, Relevant Diagnostic Findings &amp; Clinical Questions
              </label>
              <textarea
                rows={3}
                placeholder="Include current therapy, recent ECG/Echo findings, specific questions for the specialist..."
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Dispatch Referral Order
              </button>
            </div>
          </form>
        </div>
      )}

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
              placeholder="Search by patient, code, specialty, or doctor..."
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Filter size={16} style={{ color: 'var(--color-text-muted)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Status:</span>
          {(['all', 'Sent (Demo)', 'Accepted (Demo)', 'Completed (Demo)', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                borderRadius: '6px',
                border: '1px solid',
                cursor: 'pointer',
                borderColor: statusFilter === st ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: statusFilter === st ? '#EFF6FF' : '#FFFFFF',
                color: statusFilter === st ? 'var(--color-primary)' : 'var(--color-text)',
                fontWeight: statusFilter === st ? 600 : 400,
              }}
            >
              {st === 'all' ? 'All Referrals' : st.replace(' (Demo)', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Referrals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredReferrals.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              padding: '3rem 1rem',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
            }}
          >
            <Share2 size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <p style={{ margin: 0, fontWeight: 500 }}>No specialist referrals match your filter criteria.</p>
          </div>
        ) : (
          filteredReferrals.map((item) => {
            const isExpanded = expandedReferralId === item.id;
            const priorityColor =
              item.priority === 'Emergency Triage'
                ? { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' }
                : item.priority === 'Priority / Expedited'
                ? { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' }
                : { bg: '#EFF6FF', text: 'var(--color-primary)', border: '#BFDBFE' };

            const statusColor =
              item.status === 'Completed (Demo)'
                ? { bg: '#F0FDF4', text: '#16A34A', border: '#DCFCE7' }
                : item.status === 'Accepted (Demo)'
                ? { bg: '#F0FDFA', text: 'var(--color-teal)', border: '#CCFBF1' }
                : item.status === 'Cancelled'
                ? { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' }
                : { bg: '#EFF6FF', text: 'var(--color-primary)', border: '#BFDBFE' };

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                {/* Referral Summary Header */}
                <div
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    borderBottom: isExpanded ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: '1 1 360px' }}>
                    <div
                      style={{
                        padding: '0.6rem',
                        borderRadius: '8px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <Share2 size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text)' }}>
                          {item.referralCode}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            backgroundColor: priorityColor.bg,
                            color: priorityColor.text,
                            border: `1px solid ${priorityColor.border}`,
                          }}
                        >
                          {item.priority}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            border: `1px solid ${statusColor.border}`,
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)', marginTop: '0.25rem' }}>
                        {item.clinicalReason}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <User size={13} />
                          <strong>{item.patientName}</strong> ({item.patientUhid})
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={13} />
                          {item.referralDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{item.receivingDoctor}</div>
                      <div style={{ color: 'var(--color-teal)', fontWeight: 500 }}>{item.receivingSpecialty}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{item.destinationBranchName}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedReferralId(isExpanded ? null : item.id)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        padding: '0.4rem',
                        cursor: 'pointer',
                        color: 'var(--color-text-muted)',
                      }}
                      aria-label="Toggle referral details"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          Referring Clinician
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginTop: '0.2rem' }}>
                          {item.referringDoctor}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          Specialty: {item.referringSpecialty}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          Target Receiving Department
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginTop: '0.2rem' }}>
                          {item.receivingSpecialty}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Building2 size={12} />
                          <span>{item.destinationBranchName}</span>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          Referral Actions (Demo)
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                          {item.status !== 'Accepted (Demo)' && item.status !== 'Completed (Demo)' && item.status !== 'Cancelled' && (
                            <button
                              type="button"
                              onClick={() => onUpdateReferralStatus(item.id, 'Accepted (Demo)')}
                              style={{
                                padding: '0.3rem 0.6rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                backgroundColor: '#F0FDFA',
                                color: 'var(--color-teal)',
                                border: '1px solid #99F6E4',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              Mark Accepted
                            </button>
                          )}
                          {item.status !== 'Completed (Demo)' && item.status !== 'Cancelled' && (
                            <button
                              type="button"
                              onClick={() => onUpdateReferralStatus(item.id, 'Completed (Demo)')}
                              style={{
                                padding: '0.3rem 0.6rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                backgroundColor: '#F0FDF4',
                                color: '#16A34A',
                                border: '1px solid #BBF7D0',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              Mark Completed
                            </button>
                          )}
                          {item.status !== 'Cancelled' && item.status !== 'Completed (Demo)' && (
                            <button
                              type="button"
                              onClick={() => onUpdateReferralStatus(item.id, 'Cancelled')}
                              style={{
                                padding: '0.3rem 0.6rem',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                backgroundColor: '#FFFFFF',
                                color: '#EF4444',
                                border: '1px solid #FECACA',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {item.clinicalNotes && (
                      <div
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          padding: '0.75rem 1rem',
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          Clinical Handover Notes
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
                          {item.clinicalNotes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

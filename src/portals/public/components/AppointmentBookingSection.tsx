import React, { useState } from 'react';
import {
  BookingFormState,
  HospitalBranch,
  MedicalSpecialty,
  DoctorProfile,
} from '@/types/publicWebsite';
import {
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { DemoBadge } from '@/portals/public/components/DemoBadge';

interface AppointmentBookingProps {
  branches: HospitalBranch[];
  specialties: MedicalSpecialty[];
  doctors: DoctorProfile[];
  preselectedDoctorId?: string | null;
  preselectedBranchId?: string;
}

export const AppointmentBookingSection: React.FC<AppointmentBookingProps> = ({
  branches,
  specialties,
  doctors,
  preselectedDoctorId = null,
  preselectedBranchId = 'branch-central',
}) => {
  const [formData, setFormData] = useState<BookingFormState>({
    fullName: '',
    phone: '',
    email: '',
    branchId: preselectedBranchId,
    specialtyId: 'cardiology',
    doctorId: preselectedDoctorId ?? '',
    preferredDate: '',
    preferredTimeSlot: 'morning',
    patientType: 'new',
    symptomsNote: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    success: boolean;
    referenceCode?: string;
    message?: string;
  } | null>(null);

  // Synchronize when preselectedDoctorId changes
  React.useEffect(() => {
    if (preselectedDoctorId) {
      const doc = doctors.find((d) => d.id === preselectedDoctorId);
      if (doc) {
        setFormData((prev) => ({
          ...prev,
          doctorId: doc.id,
          specialtyId: doc.specialtyId,
          branchId: doc.primaryBranchId,
        }));
      }
    }
  }, [preselectedDoctorId, doctors]);

  const availableDoctors = doctors.filter(
    (d) =>
      (!formData.specialtyId || d.specialtyId === formData.specialtyId) &&
      (!formData.branchId || d.primaryBranchId === formData.branchId)
  );

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter patient full name';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Please enter a contact telephone number';
    } else if (formData.phone.length < 8) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!formData.preferredDate) {
      errors.preferredDate = 'Please select a preferred consultation date';
    }
    if (!formData.branchId) {
      errors.branchId = 'Please select a hospital branch';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate clinical triage submission handling
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedRef = `SAMPLE-OPD-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmissionFeedback({
        success: true,
        referenceCode: generatedRef,
        message:
          'This is a demonstration booking confirmation. No actual hospital appointment has been scheduled and no patient database has been modified.',
      });
    }, 600);
  };

  const handleReset = () => {
    setSubmissionFeedback(null);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      branchId: preselectedBranchId,
      specialtyId: 'cardiology',
      doctorId: '',
      preferredDate: '',
      preferredTimeSlot: 'morning',
      patientType: 'new',
      symptomsNote: '',
    });
    setValidationErrors({});
  };

  return (
    <section
      id="booking"
      style={{
        padding: '4rem 1.5rem',
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <DemoBadge label="Demonstration Booking Interface" />
          </div>
          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: 'var(--color-primary-dark)',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Schedule a Doctor Consultation
          </h2>
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '1rem',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Select your preferred hospital campus, medical specialty, and consulting physician. An automated confirmation and reminder will be delivered prior to your visit.
          </p>
        </div>

        {/* Demo Disclaimer Alert */}
        <div
          style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.85rem',
            color: 'var(--color-primary-dark)',
          }}
        >
          <HelpCircle size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Evaluation Mode:</strong> This appointment booking form demonstrates client-side validation and responsive form ergonomics. Submitting will generate a simulated appointment reference.
          </span>
        </div>

        {/* Success Feedback Screen */}
        {submissionFeedback ? (
          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: '2px solid #86EFAC',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#166534',
                marginBottom: '0.5rem',
              }}
            >
              Simulated Consultation Request Received
            </h3>

            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#FFFFFF',
                border: '1px dashed #86EFAC',
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--color-primary-dark)',
                margin: '0.75rem 0',
              }}
            >
              Reference: {submissionFeedback.referenceCode}
            </div>

            <p
              style={{
                color: '#166534',
                fontSize: '0.9rem',
                maxWidth: '560px',
                margin: '0 auto 1.5rem auto',
                lineHeight: 1.5,
              }}
            >
              {submissionFeedback.message}
            </p>

            <button
              onClick={handleReset}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                padding: '0.65rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              Book Another Demo Appointment
            </button>
          </div>
        ) : (
          /* Main Appointment Form */
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Patient Category */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: '0.5rem',
                }}
              >
                Patient Type:
              </label>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
                  <input
                    type="radio"
                    name="patientType"
                    checked={formData.patientType === 'new'}
                    onChange={() => setFormData({ ...formData, patientType: 'new' })}
                  />
                  <span>New Patient (First Visit)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
                  <input
                    type="radio"
                    name="patientType"
                    checked={formData.patientType === 'returning'}
                    onChange={() => setFormData({ ...formData, patientType: 'returning' })}
                  />
                  <span>Follow-Up / Returning Patient</span>
                </label>
              </div>
            </div>

            {/* Row 1: Patient Personal Information */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <label
                  htmlFor="booking-name"
                  style={{
                    display: 'block',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Patient Full Name *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (validationErrors.fullName) {
                      setValidationErrors({ ...validationErrors, fullName: '' });
                    }
                  }}
                  placeholder="e.g. Ramesh Kumar"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: validationErrors.fullName
                      ? '1px solid var(--color-error)'
                      : '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--color-surface)',
                    outline: 'none',
                  }}
                />
                {validationErrors.fullName && (
                  <span style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                    {validationErrors.fullName}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-phone"
                  style={{
                    display: 'block',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Contact Telephone *
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (validationErrors.phone) {
                      setValidationErrors({ ...validationErrors, phone: '' });
                    }
                  }}
                  placeholder="e.g. +91 98765 43210"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: validationErrors.phone
                      ? '1px solid var(--color-error)'
                      : '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--color-surface)',
                    outline: 'none',
                  }}
                />
                {validationErrors.phone && (
                  <span style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                    {validationErrors.phone}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-email"
                  style={{
                    display: 'block',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Email Address (Optional)
                </label>
                <input
                  id="booking-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="patient@example.com"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--color-surface)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Row 2: Hospital Branch, Specialty, Doctor */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <label
                  htmlFor="booking-branch"
                  style={{
                    display: 'block',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Hospital Branch *
                </label>
                <select
                  id="booking-branch"
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value, doctorId: '' })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--color-surface)',
                    outline: 'none',
                  }}
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name.replace(' (Sample Location)', '')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="booking-specialty"
                  style={{
                    display: 'block',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Medical Specialty
                </label>
                <select
                  id="booking-specialty"
                  value={formData.specialtyId}
                  onChange={(e) => setFormData({ ...formData, specialtyId: e.target.value, doctorId: '' })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--color-surface)',
                    outline: 'none',
                  }}
                >
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="booking-doctor"
                  style={{
                    display: 'block',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Consulting Physician
                </label>
                <select
                  id="booking-doctor"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--color-surface)',
                    outline: 'none',
                  }}
                >
                  <option value="">Any Available Specialist</option>
                  {availableDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.fullName} ({doc.specialtyName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Date and Slot */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <label
                  htmlFor="booking-date"
                  style={{
                    display: 'block',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Preferred Consultation Date *
                </label>
                <input
                  id="booking-date"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => {
                    setFormData({ ...formData, preferredDate: e.target.value });
                    if (validationErrors.preferredDate) {
                      setValidationErrors({ ...validationErrors, preferredDate: '' });
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: validationErrors.preferredDate
                      ? '1px solid var(--color-error)'
                      : '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--color-surface)',
                    outline: 'none',
                  }}
                />
                {validationErrors.preferredDate && (
                  <span style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                    {validationErrors.preferredDate}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-slot"
                  style={{
                    display: 'block',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Preferred Time Slot
                </label>
                <select
                  id="booking-slot"
                  value={formData.preferredTimeSlot}
                  onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--color-surface)',
                    outline: 'none',
                  }}
                >
                  <option value="morning">Morning OPD (09:00 AM – 12:30 PM)</option>
                  <option value="afternoon">Afternoon Session (01:30 PM – 04:30 PM)</option>
                  <option value="evening">Evening Clinic (05:00 PM – 08:00 PM)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="booking-notes"
                  style={{
                    display: 'block',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Brief Symptoms / Note (Optional)
                </label>
                <input
                  id="booking-notes"
                  type="text"
                  value={formData.symptomsNote}
                  onChange={(e) => setFormData({ ...formData, symptomsNote: e.target.value })}
                  placeholder="e.g. Mild headache for 3 days"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--color-surface)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Submission Button */}
            <div style={{ textAlign: 'right', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '0.75rem 2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-md)',
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Processing Request...' : 'Confirm Appointment Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  HospitalBranch,
  MedicalSpecialty,
  DoctorProfile,
} from '@/types/publicWebsite';
import { PatientAppointment } from '@/types/patientPortal';
import {
  CheckCircle2,
  Info,
} from 'lucide-react';

interface BookAppointmentPageProps {
  branches: HospitalBranch[];
  specialties: MedicalSpecialty[];
  doctors: DoctorProfile[];
  onAppointmentBooked: (newAppointment: PatientAppointment) => void;
  onNavigateToAppointments: () => void;
}

export const BookAppointmentPage: React.FC<BookAppointmentPageProps> = ({
  branches,
  specialties,
  doctors,
  onAppointmentBooked,
  onNavigateToAppointments,
}) => {
  // Date minimum calculations: today in YYYY-MM-DD
  const todayObj = new Date();
  const year = todayObj.getFullYear();
  const month = String(todayObj.getMonth() + 1).padStart(2, '0');
  const day = String(todayObj.getDate()).padStart(2, '0');
  const minDateStr = `${year}-${month}-${day}`;

  const [branchId, setBranchId] = useState<string>('branch-central');
  const [specialtyId, setSpecialtyId] = useState<string>('cardiology');
  const [doctorId, setDoctorId] = useState<string>('doc-1');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('10:00 AM – 10:30 AM');
  const [consultationType, setConsultationType] = useState<'In-Person Consultation' | 'Tele-Consultation' | 'Follow-up'>('In-Person Consultation');
  const [symptoms, setSymptoms] = useState<string>('');

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<PatientAppointment | null>(null);

  const availableDoctors = doctors.filter(
    (d) =>
      (!specialtyId || d.specialtyId === specialtyId) &&
      (!branchId || d.primaryBranchId === branchId)
  );

  const selectedDoctor = doctors.find((d) => d.id === doctorId);
  const selectedBranch = branches.find((b) => b.id === branchId);
  const selectedSpecialty = specialties.find((s) => s.id === specialtyId);

  // Doctor consultation day mapping check
  const checkDoctorDayAvailability = (dateString: string, doc: DoctorProfile | undefined): { available: boolean; dayName: string } => {
    if (!dateString || !doc) return { available: true, dayName: '' };

    const dateParts = dateString.split('-').map(Number);
    if (dateParts.length !== 3 || !dateParts[0] || !dateParts[1] || !dateParts[2]) {
      return { available: true, dayName: '' };
    }

    const testDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[testDate.getDay()] ?? '';

    if (dayName === 'Sunday') {
      return { available: false, dayName: 'Sunday (OPD Closed)' };
    }

    const docDays = doc.consultationDays || [];
    const isDocDay = docDays.some((d) => d.toLowerCase() === dayName.toLowerCase());
    return { available: isDocDay, dayName };
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!branchId) errs.branchId = 'Please select a hospital branch.';
    if (!specialtyId) errs.specialtyId = 'Please select a specialty.';
    if (!doctorId) errs.doctorId = 'Please select a consulting physician.';

    if (!preferredDate) {
      errs.preferredDate = 'Please select today or a future date for your appointment.';
    } else {
      // Past Date check
      if (preferredDate < minDateStr) {
        errs.preferredDate = 'Past dates are not permitted. Please select today or a future date for your appointment.';
      } else if (selectedDoctor) {
        const { available, dayName } = checkDoctorDayAvailability(preferredDate, selectedDoctor);
        if (!available) {
          errs.preferredDate = `${selectedDoctor.fullName} is not on OPD duty on ${dayName}. Available days: ${selectedDoctor.consultationDays.join(', ')}.`;
        }
      }
    }

    if (!preferredTimeSlot) errs.preferredTimeSlot = 'Please select an appointment time slot.';

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedRef = `APT-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;

      const newAppointment: PatientAppointment = {
        id: `apt-new-${Date.now()}`,
        appointmentCode: generatedRef,
        doctorName: selectedDoctor ? selectedDoctor.fullName : 'Consultant Physician',
        doctorTitle: selectedDoctor ? selectedDoctor.title : 'Consultant',
        specialtyName: selectedSpecialty ? selectedSpecialty.name : 'Specialty Clinic',
        branchName: selectedBranch ? selectedBranch.name : 'Danvantari Central Campus',
        date: preferredDate,
        timeSlot: preferredTimeSlot,
        status: 'Upcoming',
        type: consultationType,
        roomNumber: 'OPD Suite 204 (Demo Allocation)',
        notes: symptoms.trim() || 'General follow-up consultation.',
      };

      onAppointmentBooked(newAppointment);
      setConfirmedAppointment(newAppointment);
    }, 600);
  };

  const handleBookAnother = () => {
    setConfirmedAppointment(null);
    setPreferredDate('');
    setSymptoms('');
    setValidationErrors({});
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            Schedule a Consultation
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Choose your preferred campus branch, medical department, consulting doctor, and date. Past dates are strictly blocked.
          </p>
        </div>

        {/* Confirmation Screen */}
        {confirmedAppointment ? (
          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: '2px solid #86EFAC',
              borderRadius: 'var(--radius-md)',
              padding: '2rem',
              textAlign: 'center',
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

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#166534', marginBottom: '0.5rem' }}>
              Appointment Successfully Booked!
            </h3>

            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#FFFFFF',
                border: '1px dashed #86EFAC',
                padding: '0.6rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 800,
                fontSize: '1.1rem',
                color: 'var(--color-primary-dark)',
                marginBottom: '1.5rem',
              }}
            >
              Appointment Reference: {confirmedAppointment.appointmentCode}
            </div>

            {/* Prominent Booking Summary Table */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #BBF7D0',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Consulting Doctor:</span>
                <strong>{confirmedAppointment.doctorName}</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-teal)' }}>{confirmedAppointment.specialtyName}</div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Hospital Campus:</span>
                <strong>{confirmedAppointment.branchName}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Date &amp; Time Slot:</span>
                <strong>{confirmedAppointment.date} ({confirmedAppointment.timeSlot})</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Consultation Format:</span>
                <strong>{confirmedAppointment.type}</strong>
              </div>
            </div>

            <p style={{ color: '#166534', fontSize: '0.85rem', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
              The appointment has been added to <strong>My Appointments</strong> and your <strong>Dashboard</strong>. An in-app confirmation notification has been triggered.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={onNavigateToAppointments}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Go to My Appointments
              </button>
              <button
                onClick={handleBookAnother}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  padding: '0.65rem 1.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Schedule Another Visit
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Step 1: Branch Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="book-branch"
                style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}
              >
                1. Select Hospital Branch *
              </label>
              <select
                id="book-branch"
                value={branchId}
                onChange={(e) => {
                  setBranchId(e.target.value);
                  setDoctorId('');
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: validationErrors.branchId ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Specialty Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="book-specialty"
                style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}
              >
                2. Select Medical Specialty *
              </label>
              <select
                id="book-specialty"
                value={specialtyId}
                onChange={(e) => {
                  setSpecialtyId(e.target.value);
                  setDoctorId('');
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: validationErrors.specialtyId ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  fontSize: '0.9rem',
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

            {/* Step 3: Doctor Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="book-doctor"
                style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}
              >
                3. Consulting Physician *
              </label>
              <select
                id="book-doctor"
                value={doctorId}
                onChange={(e) => {
                  setDoctorId(e.target.value);
                  if (validationErrors.doctorId) {
                    setValidationErrors({ ...validationErrors, doctorId: '' });
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: validationErrors.doctorId ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              >
                <option value="">-- Choose Consulting Physician --</option>
                {availableDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.fullName} ({doc.title}) • Available: {doc.consultationDays.join(', ')}
                  </option>
                ))}
              </select>
              {validationErrors.doctorId && (
                <span style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                  {validationErrors.doctorId}
                </span>
              )}
              {selectedDoctor && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-teal)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Info size={13} />
                  <span>OPD Consultation Schedule: <strong>{selectedDoctor.consultationDays.join(', ')}</strong></span>
                </div>
              )}
            </div>

            {/* Step 4 & 5: Date (with past date protection) & Time Slot */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <label
                  htmlFor="book-date"
                  style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}
                >
                  4. Appointment Date (Today or Future) *
                </label>
                <input
                  id="book-date"
                  type="date"
                  min={minDateStr}
                  value={preferredDate}
                  onChange={(e) => {
                    setPreferredDate(e.target.value);
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
                    backgroundColor: 'var(--color-bg)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
                {validationErrors.preferredDate ? (
                  <span style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                    {validationErrors.preferredDate}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'block' }}>
                    Earliest selectable: Today ({minDateStr})
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="book-slot"
                  style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}
                >
                  5. Time Slot *
                </label>
                <select
                  id="book-slot"
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                >
                  <option value="09:00 AM – 09:30 AM">09:00 AM – 09:30 AM (Morning OPD)</option>
                  <option value="10:00 AM – 10:30 AM">10:00 AM – 10:30 AM (Morning OPD)</option>
                  <option value="11:30 AM – 12:00 PM">11:30 AM – 12:00 PM (Morning OPD)</option>
                  <option value="02:30 PM – 03:00 PM">02:30 PM – 03:00 PM (Afternoon OPD)</option>
                  <option value="04:00 PM – 04:30 PM">04:00 PM – 04:30 PM (Evening OPD)</option>
                </select>
              </div>
            </div>

            {/* Step 6: Consultation Type */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                6. Consultation Format *
              </label>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="consultationType"
                    checked={consultationType === 'In-Person Consultation'}
                    onChange={() => setConsultationType('In-Person Consultation')}
                  />
                  <span>In-Person Hospital Visit</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="consultationType"
                    checked={consultationType === 'Tele-Consultation'}
                    onChange={() => setConsultationType('Tele-Consultation')}
                  />
                  <span>Tele-Consultation (Remote Video)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="consultationType"
                    checked={consultationType === 'Follow-up'}
                    onChange={() => setConsultationType('Follow-up')}
                  />
                  <span>Routine Follow-Up</span>
                </label>
              </div>
            </div>

            {/* Step 7: Symptoms / Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="book-symptoms"
                style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}
              >
                7. Reason for Consultation / Symptoms (Optional)
              </label>
              <textarea
                id="book-symptoms"
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Mention any chief complaints, duration of symptoms, or ongoing medication..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ textAlign: 'right', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '0.75rem 2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-sm)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? 'Verifying & Confirming...' : 'Confirm Appointment Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

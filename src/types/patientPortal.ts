export type PatientTab =
  | 'dashboard'
  | 'appointments'
  | 'book'
  | 'records'
  | 'labs'
  | 'prescriptions'
  | 'billing'
  | 'second-opinion'
  | 'messages'
  | 'profile';

export interface PatientProfile {
  id: string;
  uhid: string;
  fullName: string;
  age: number;
  gender: string;
  bloodGroup: string;
  email: string;
  phone: string;
  emergencyContact: string;
  primaryBranchName: string;
  allergies: string[];
  chronicConditions: string[];
}

export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface PatientAppointment {
  id: string;
  appointmentCode: string;
  doctorName: string;
  doctorTitle: string;
  specialtyName: string;
  branchName: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  type: 'In-Person Consultation' | 'Tele-Consultation' | 'Follow-up';
  roomNumber?: string;
  notes?: string;
}

export interface MedicalRecordItem {
  id: string;
  recordCode: string; // Reference identifier e.g. REC-DEMO-001
  date: string;
  category: 'Consultation Summary' | 'Discharge Summary' | 'Immunization' | 'Diagnostic Assessment';
  doctorName: string;
  department: string;
  facility: string;
  diagnosisSummary: string;
  keyFindings: string[];
}

export interface ExternalPrescriptionMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface ExternalMedicalDocument {
  id: string;
  fileName: string;
  docType: 'Previous Prescription' | 'Laboratory Report' | 'Diagnostic Scan / Imaging' | 'Discharge Summary' | 'Medical Certificate' | 'Other';
  fileSizeKb: number;
  uploadedAt: string;
}

export interface ExternalMedicalHistoryItem {
  id: string;
  recordCode: string; // e.g. EXT-DEMO-101
  facilityName: string;
  consultantName: string;
  treatmentDate: string;
  specialty: string;
  diagnosis: string;
  treatmentSummary: string;
  medications: ExternalPrescriptionMedication[];
  additionalNotes: string;
  attachments: ExternalMedicalDocument[];
  isPatientProvided: true;
}

export interface LabParameter {
  parameterName: string;
  measuredValue: string;
  unit: string;
  referenceInterval: string;
  isAbnormal: boolean;
  explanation: string;
}

export interface LabReportItem {
  id: string;
  reportCode: string; // e.g. LAB-DEMO-9011
  testName: string;
  orderedBy: string;
  doctorSpecialty: string;
  associatedAppointmentCode?: string;
  branchName: string;
  dateCollected: string;
  dateReported: string;
  status: 'Final Report' | 'Pending Analysis' | 'Processing';
  normalRange: string;
  resultValue: string;
  interpretation: string;
  fastingState: string;
  specimenType: string;
  parameters: LabParameter[];
  generalDescription: string;
  clinicalSignificance: string;
}

export type PrescriptionStatus = 'Active' | 'Completed' | 'Inactive / Expired';

export interface PrescriptionItem {
  id: string;
  rxCode: string; // e.g. RX-DEMO-4412
  prescribedDate: string;
  expiryDate: string;
  doctorName: string;
  doctorSpecialty: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  status: PrescriptionStatus;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string; // e.g. INV-DEMO-8801
  serviceDescription: string;
  date: string;
  branchName: string;
  amount: number;
  status: 'Paid' | 'Pending Settlement' | 'Insurance Processing';
  paymentMode: string;
}

export interface SupportMessage {
  id: string;
  sender: 'patient' | 'desk' | 'system';
  timestamp: string;
  content: string;
}

export type SecondOpinionStatus =
  | 'Draft'
  | 'Submitted (Demo)'
  | 'Under Review (Demo)'
  | 'Completed (Demo)'
  | 'Cancelled';

export interface SecondOpinionRequest {
  id: string;
  requestCode: string; // e.g. 2ND-DEMO-801
  specialtyName: string;
  reviewingCampus: string;
  currentDiagnosis: string;
  specificQuestions: string;
  urgency: 'Routine Review' | 'Priority Specialist Review';
  submissionDate: string;
  status: SecondOpinionStatus;
  reviewingPanel?: string;
  resultSummary?: string;
  recommendations?: string[];
  associatedReportCode?: string;
}

export type NotificationType =
  | 'appointment_booked'
  | 'appointment_rescheduled'
  | 'appointment_cancelled'
  | 'appointment_reminder'
  | 'lab_ready'
  | 'rx_updated'
  | 'external_record_added'
  | 'second_opinion_update'
  | 'general';

export interface InAppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  targetTab: PatientTab;
  targetReference?: string;
}

export interface SearchResultItem {
  id: string;
  referenceNumber: string;
  category: 'Appointment' | 'Lab Report' | 'Prescription' | 'Invoice' | 'Medical Record' | 'External Record' | 'Second Opinion';
  title: string;
  subtitle: string;
  date: string;
  targetTab: PatientTab;
}

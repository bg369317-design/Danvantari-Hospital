import { HospitalBranch } from './publicWebsite';

export type DoctorTab =
  | 'dashboard'
  | 'queue'
  | 'appointments'
  | 'records'
  | 'consultation-notes'
  | 'prescriptions'
  | 'diagnostic-orders'
  | 'lab-results'
  | 'referrals'
  | 'roster'
  | 'messages'
  | 'profile';

export type QueueStatus =
  | 'Scheduled'
  | 'Waiting'
  | 'In Consultation'
  | 'Completed'
  | 'Cancelled';

export interface QueuePatientItem {
  id: string;
  queueNumber: number;
  tokenNumber: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  age: number;
  gender: string;
  appointmentCode: string;
  appointmentTime: string;
  consultationType: 'In-Person Consultation' | 'Tele-Consultation' | 'Follow-up';
  specialty: string;
  branchId: string;
  branchName: string;
  status: QueueStatus;
  reasonForVisit: string;
  checkInTime?: string;
  vitals?: {
    bp: string;
    pulse: string;
    temp: string;
    spo2: string;
  };
}

export interface DoctorAppointment {
  id: string;
  appointmentCode: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  age: number;
  gender: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  type: 'In-Person Consultation' | 'Tele-Consultation' | 'Follow-up';
  status: QueueStatus;
  branchId: string;
  branchName: string;
  notes?: string;
  doctorName: string;
  doctorSpecialty: string;
}

export interface PatientDemographics {
  id: string;
  uhid: string;
  fullName: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contactNumber: string;
  email: string;
  emergencyContact: string;
  primaryBranchId: string;
  primaryBranchName: string;
  allergies: string[];
  chronicConditions: string[];
}

export interface PatientChart {
  demographics: PatientDemographics;
  hospitalRecords: Array<{
    id: string;
    recordCode: string;
    date: string;
    doctorName: string;
    department: string;
    diagnosisSummary: string;
    keyFindings: string[];
  }>;
  externalMedicalHistory: Array<{
    id: string;
    recordCode: string;
    facilityName: string;
    consultantName: string;
    treatmentDate: string;
    specialty: string;
    diagnosis: string;
    treatmentSummary: string;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>;
    notes: string;
  }>;
  externalDocuments: Array<{
    id: string;
    fileName: string;
    docType: string;
    uploadedAt: string;
    fileSizeKb: number;
  }>;
}

export interface SoapNote {
  id: string;
  noteCode: string; // NOTE-DEMO-501
  patientId: string;
  patientName: string;
  patientUhid: string;
  appointmentCode: string;
  consultationDate: string;
  doctorName: string;
  doctorSpecialty: string;
  branchId: string;
  branchName: string;
  // S - Subjective
  chiefComplaint: string;
  historyOfPresentIllness: string;
  relevantMedicalHistory: string;
  // O - Objective
  vitals: {
    bp: string;
    pulse: string;
    temp: string;
    spo2: string;
    weight: string;
  };
  physicalExamination: string;
  // A - Assessment
  assessmentDiagnosis: string;
  clinicalImpression: string;
  // P - Plan
  pharmacologicalPlan: string;
  investigationsOrdered: string;
  dietAndLifestyle: string;
  followUpInstructions: string;
  followUpDate?: string;
  status: 'Draft' | 'Finalized (Demo)';
  savedAt: string;
}

export interface PrescribedMedicationRow {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: 'Oral' | 'Topical' | 'Inhalation' | 'Sublingual' | 'Intravenous';
  instructions: string;
  startDate: string;
  endDate: string;
}

export interface DoctorPrescription {
  id: string;
  rxCode: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  consultationRef: string;
  prescribedDate: string;
  doctorName: string;
  doctorSpecialty: string;
  branchId: string;
  branchName: string;
  medications: PrescribedMedicationRow[];
  status: 'Active' | 'Completed' | 'Inactive / Expired';
  clinicalNotes?: string;
}

export type DiagnosticCategory = 'Laboratory' | 'Imaging';

export type DiagnosticOrderStatus =
  | 'Draft'
  | 'Ordered (Demo)'
  | 'Sample Collected (Demo)'
  | 'Processing (Demo)'
  | 'Completed (Demo)'
  | 'Cancelled';

export interface DiagnosticOrderItem {
  id: string;
  orderCode: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  orderingDoctor: string;
  branchId: string;
  branchName: string;
  category: DiagnosticCategory;
  testName: string;
  clinicalIndication: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
  orderDate: string;
  status: DiagnosticOrderStatus;
}

export interface DoctorLabResultItem {
  id: string;
  reportCode: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  testName: string;
  reportDate: string;
  orderingDoctor: string;
  branchId: string;
  branchName: string;
  status: 'Final Report' | 'Pending Analysis' | 'Processing';
  isAbnormal: boolean;
  summaryFindings: string;
  doctorReviewNote?: string;
  reviewedAt?: string;
  parameters: Array<{
    name: string;
    val: string;
    unit: string;
    ref: string;
    isAbnormal: boolean;
  }>;
}

export type ReferralStatus =
  | 'Draft'
  | 'Sent (Demo)'
  | 'Accepted (Demo)'
  | 'Completed (Demo)'
  | 'Cancelled';

export interface ClinicalReferral {
  id: string;
  referralCode: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  referringDoctor: string;
  referringSpecialty: string;
  originBranchId: string;
  originBranchName: string;
  receivingSpecialty: string;
  receivingDoctor: string;
  destinationBranchId: string;
  destinationBranchName: string;
  priority: 'Routine' | 'Priority / Expedited' | 'Emergency Triage';
  clinicalReason: string;
  clinicalNotes: string;
  referralDate: string;
  status: ReferralStatus;
}

export interface DoctorRosterSlot {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  branchId: string;
  branchName: string;
  opdHours: string;
  roomNumber: string;
  isOnCall: boolean;
  status: 'Available' | 'On Call' | 'Leave / Unavailable';
}

export interface DoctorPatientMessage {
  id: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  sender: 'doctor' | 'patient' | 'system';
  timestamp: string;
  content: string;
}

export interface DoctorConversation {
  patientId: string;
  patientName: string;
  patientUhid: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: DoctorPatientMessage[];
}

export interface DoctorNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  type: 'queue_update' | 'critical_lab' | 'referral_received' | 'appointment_rescheduled' | 'general';
  targetTab: DoctorTab;
  targetId?: string;
}

export interface DoctorProfileData {
  id: string;
  fullName: string;
  title: string;
  specialtyId: string;
  specialtyName: string;
  registrationNumber: string;
  qualifications: string;
  experienceYears: number;
  languages: string[];
  assignedBranches: HospitalBranch[];
  opdTimings: string;
  email: string;
  phone: string;
  bio: string;
  consultationFee: string;
  isOnDuty: boolean;
  isOnCall: boolean;
}

// ---------------------------------------------------------------------------
// Conceptual Relationships for Doctor Branch Assignments & RLS Preparation
// ---------------------------------------------------------------------------

/**
 * Conceptual Doctor entity corresponding to future DB schema:
 * doctors (doctor_id, name, speciality)
 */
export interface DoctorEntity {
  doctor_id: string;
  name: string;
  speciality: string;
}

/**
 * Conceptual Branch entity corresponding to future DB schema:
 * branches (branch_id, branch_name, address)
 */
export interface BranchEntity {
  branch_id: string;
  branch_name: string;
  address: string;
}

/**
 * Conceptual DoctorBranchAssignment entity corresponding to future DB schema:
 * doctor_branch_assignments (assignment_id, doctor_id, branch_id, active_status)
 */
export interface DoctorBranchAssignment {
  assignment_id: string;
  doctor_id: string;
  branch_id: string;
  active_status: boolean;
  assigned_at?: string;
  updated_at?: string;
  notes?: string;
}

/**
 * Result of evaluating doctor branch authorization for a requested record or branch view.
 */
export interface BranchAccessEvaluation {
  allowed: boolean;
  requestedBranchId: string;
  requestedBranchName?: string | undefined;
  allowedBranchIds: string[];
  denialReason?: string | undefined;
}

/**
 * Audit log entry for administration workflows when an admin modifies branch assignments.
 */
export interface DoctorBranchAssignmentAudit {
  id: string;
  timestamp: string;
  performedByAdminId: string;
  doctorId: string;
  branchId: string;
  action: 'ASSIGN' | 'REVOKE' | 'SUSPEND' | 'ACTIVATE';
  reason: string;
}


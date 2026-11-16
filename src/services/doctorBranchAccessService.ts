/**
 * ============================================================================
 * DANVANTARI HOSPITAL MANAGEMENT PLATFORM
 * Centralized Doctor Branch Assignment & Access Control Service
 * ============================================================================
 *
 * ARCHITECTURAL NOTICE & FUTURE BACKEND SECURITY (Supabase RLS):
 * ----------------------------------------------------------------------------
 * This module manages branch-based doctor assignments and client-side view
 * filtering for demonstration purposes.
 *
 * In production, client-side filtering MUST NOT be relied upon as a security
 * boundary. True clinical multi-tenancy and branch data segregation is enforced
 * at the database layer via PostgreSQL Row Level Security (RLS) policies on
 * Supabase, combined with verified JWT claims (e.g., auth.jwt() -> app_metadata).
 *
 * CONCEPTUAL SCHEMA & POSTGRESQL RLS BLUEPRINT:
 *
 * ```sql
 * -- 1. Doctors Table
 * CREATE TABLE public.doctors (
 *     doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     name TEXT NOT NULL,
 *     speciality TEXT NOT NULL,
 *     created_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 * -- 2. Branches Table
 * CREATE TABLE public.branches (
 *     branch_id TEXT PRIMARY KEY,
 *     branch_name TEXT NOT NULL,
 *     address TEXT NOT NULL,
 *     created_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 * -- 3. Doctor Branch Assignments Table (Junction Table)
 * CREATE TABLE public.doctor_branch_assignments (
 *     assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     doctor_id UUID REFERENCES public.doctors(doctor_id) ON DELETE CASCADE,
 *     branch_id TEXT REFERENCES public.branches(branch_id) ON DELETE CASCADE,
 *     active_status BOOLEAN NOT NULL DEFAULT true,
 *     assigned_at TIMESTAMPTZ DEFAULT now(),
 *     updated_at TIMESTAMPTZ DEFAULT now(),
 *     UNIQUE(doctor_id, branch_id)
 * );
 *
 * -- 4. Enable RLS on clinical tables
 * ALTER TABLE public.clinical_records ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.patient_queue ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.diagnostic_orders ENABLE ROW LEVEL SECURITY;
 *
 * -- 5. Standard Row Level Security Policy for Doctors
 * CREATE POLICY "Enforce Doctor Branch Access Restriction"
 * ON public.clinical_records
 * FOR ALL
 * TO authenticated
 * USING (
 *     branch_id IN (
 *         SELECT dba.branch_id
 *         FROM public.doctor_branch_assignments dba
 *         WHERE dba.doctor_id = auth.uid()
 *           AND dba.active_status = true
 *     )
 * );
 * ```
 */

import { HospitalBranch } from '@/types/publicWebsite';
import {
  DoctorEntity,
  BranchEntity,
  DoctorBranchAssignment,
  BranchAccessEvaluation,
  DoctorBranchAssignmentAudit,
  DoctorProfileData,
} from '@/types/doctorPortal';
import { SAMPLE_BRANCHES } from '@/config/publicSampleData';

// ----------------------------------------------------------------------------
// 1. Structured Entities (Doctors & Branches)
// ----------------------------------------------------------------------------

export const CONCEPTUAL_BRANCH_ENTITIES: BranchEntity[] = [
  {
    branch_id: 'branch-central',
    branch_name: 'Danvantari Central Campus',
    address: '108 Healthcare Blvd, Central District, Bengaluru, Karnataka 560001',
  },
  {
    branch_id: 'branch-north',
    branch_name: 'North Specialty Center',
    address: '42 Ring Road, Hebbal Sector 4, Bengaluru, Karnataka 560024',
  },
  {
    branch_id: 'branch-south',
    branch_name: "South Health & Women's Center",
    address: '19 Kanakapura Express Way, Jayanagar 9th Block, Bengaluru, Karnataka 560069',
  },
];

export const CONCEPTUAL_DOCTOR_ENTITIES: DoctorEntity[] = [
  {
    doctor_id: 'doc-1',
    name: 'Dr. Aarav Sharma',
    speciality: 'Cardiology & Interventional Cardiac Care',
  },
  {
    doctor_id: 'doc-2',
    name: 'Dr. Priya Desai',
    speciality: 'Cardiology (Non-Invasive Echocardiography)',
  },
  {
    doctor_id: 'doc-3',
    name: 'Dr. Rajesh Nambiar',
    speciality: 'Endocrinology & Diabetology',
  },
  {
    doctor_id: 'doc-4',
    name: 'Dr. Ananya Iyer',
    speciality: "Obstetrics & Women's Health",
  },
  {
    doctor_id: 'doc-5',
    name: 'Dr. Vikramaditya Kulkarni',
    speciality: 'Neurology & Stroke Care',
  },
  {
    doctor_id: 'doc-6',
    name: 'Dr. Sunita Rao',
    speciality: 'Pediatrics & Neonatology',
  },
];

/**
 * Pre-configured demonstration doctor profiles for access control verification.
 */
export const DEMO_DOCTOR_PROFILES: Record<string, DoctorProfileData> = {
  'doc-1': {
    id: 'doc-1',
    fullName: 'Dr. Aarav Sharma',
    title: 'Senior Consultant – Cardiology & Interventional Cardiac Care',
    specialtyId: 'cardiology',
    specialtyName: 'Cardiology & Heart Care (Sample Dept)',
    registrationNumber: 'MCI-DEMO-2010-84921 (Fictional Registration)',
    qualifications: 'MBBS, MD (Medicine), DM (Cardiology), FACC [Demonstration Credentials]',
    experienceYears: 16,
    languages: ['English', 'Kannada', 'Hindi'],
    assignedBranches: [], // Hydrated dynamically via getAssignedBranchesForDoctor
    opdTimings: '09:00 AM – 01:00 PM (Morning OPD) | 02:00 PM – 05:00 PM (Specialty OPD)',
    email: 'aarav.sharma.demo@danvantari-hospital.org',
    phone: 'DEMO ONLY: (080) 5555-0101 (Non-operational)',
    bio: 'Senior clinical cardiologist evaluating ischemic heart disease, preventive hypertension, and cardiovascular lipidology. Assigned across Central Campus and North Specialty Center.',
    consultationFee: '₹900 (Demonstration Baseline)',
    isOnDuty: true,
    isOnCall: true,
  },
  'doc-2': {
    id: 'doc-2',
    fullName: 'Dr. Priya Desai',
    title: 'Consultant – Non-Invasive Echocardiography & Cardiac Diagnostics',
    specialtyId: 'cardiology',
    specialtyName: 'Cardiology & Heart Care (Sample Dept)',
    registrationNumber: 'MCI-DEMO-2015-61244 (Fictional Registration)',
    qualifications: 'MBBS, MD (Medicine), Fellowship in Non-Invasive Cardiology [Demonstration]',
    experienceYears: 11,
    languages: ['English', 'Kannada', 'Marathi'],
    assignedBranches: [],
    opdTimings: '10:00 AM – 02:00 PM (North Center Only)',
    email: 'priya.desai.demo@danvantari-hospital.org',
    phone: 'DEMO ONLY: (080) 5555-0102 (Non-operational)',
    bio: 'Non-invasive echocardiography lead with exclusive appointment at North Specialty Center (Single-branch access).',
    consultationFee: '₹850 (Demonstration Baseline)',
    isOnDuty: true,
    isOnCall: false,
  },
  'doc-4': {
    id: 'doc-4',
    fullName: 'Dr. Ananya Iyer',
    title: "Senior Consultant – Obstetrics, Gynecology & Women's Health",
    specialtyId: 'obgyn',
    specialtyName: "Obstetrics & Women's Health (Sample Dept)",
    registrationNumber: 'MCI-DEMO-2008-39218 (Fictional Registration)',
    qualifications: 'MBBS, MS (OBG), DNB, FRCOG (UK) [Demonstration Credentials]',
    experienceYears: 18,
    languages: ['English', 'Tamil', 'Kannada', 'Hindi'],
    assignedBranches: [],
    opdTimings: '09:00 AM – 01:00 PM (South Center Only)',
    email: 'ananya.iyer.demo@danvantari-hospital.org',
    phone: 'DEMO ONLY: (080) 5555-0104 (Non-operational)',
    bio: "Head of Maternal-Fetal Medicine with exclusive appointment at South Health & Women's Center (Single-branch access).",
    consultationFee: '₹950 (Demonstration Baseline)',
    isOnDuty: true,
    isOnCall: true,
  },
};

/**
 * Returns a hydrated DoctorProfileData with assignedBranches populated from assignments.
 */
export function getHydratedDoctorProfile(doctorId: string): DoctorProfileData {
  const base = DEMO_DOCTOR_PROFILES[doctorId] || DEMO_DOCTOR_PROFILES['doc-1']!;
  return {
    ...base,
    assignedBranches: getAssignedBranchesForDoctor(base.id),
  };
}

// ----------------------------------------------------------------------------
// 2. Centralized Structured Doctor Branch Assignments Data Source
// ----------------------------------------------------------------------------

/**
 * Initial doctor branch assignments.
 * - Dr. Aarav Sharma (doc-1): Assigned to Central Campus & North Specialty Center (Multi-branch).
 *   Branch-south is NOT assigned.
 * - Dr. Priya Desai (doc-2): Assigned ONLY to North Specialty Center (Single-branch).
 * - Dr. Ananya Iyer (doc-4): Assigned ONLY to South Health & Women's Center (Single-branch).
 * - Dr. Rajesh Nambiar (doc-3): Assigned ONLY to Central Campus (Single-branch).
 */
export const INITIAL_DOCTOR_BRANCH_ASSIGNMENTS: DoctorBranchAssignment[] = [
  // Dr. Aarav Sharma (doc-1): Multi-branch (Central & North; South NOT ASSIGNED)
  {
    assignment_id: 'assign-doc1-central',
    doctor_id: 'doc-1',
    branch_id: 'branch-central',
    active_status: true,
    assigned_at: '2025-01-15T09:00:00Z',
    notes: 'Primary Outpatient & Interventional Cath Lab Duty',
  },
  {
    assignment_id: 'assign-doc1-north',
    doctor_id: 'doc-1',
    branch_id: 'branch-north',
    active_status: true,
    assigned_at: '2025-03-01T09:00:00Z',
    notes: 'Specialty Cardiology Consultation Clinic (Tue & Thu)',
  },

  // Dr. Priya Desai (doc-2): Single branch (North only)
  {
    assignment_id: 'assign-doc2-north',
    doctor_id: 'doc-2',
    branch_id: 'branch-north',
    active_status: true,
    assigned_at: '2025-02-10T09:00:00Z',
    notes: 'Non-invasive Echo & Preventive Cardiology Hub',
  },

  // Dr. Rajesh Nambiar (doc-3): Single branch (Central only)
  {
    assignment_id: 'assign-doc3-central',
    doctor_id: 'doc-3',
    branch_id: 'branch-central',
    active_status: true,
    assigned_at: '2025-01-20T09:00:00Z',
    notes: 'Comprehensive Diabetes & Endocrine Center',
  },

  // Dr. Ananya Iyer (doc-4): Single branch (South only)
  {
    assignment_id: 'assign-doc4-south',
    doctor_id: 'doc-4',
    branch_id: 'branch-south',
    active_status: true,
    assigned_at: '2025-04-01T09:00:00Z',
    notes: 'Maternal-Fetal Medicine & Birthing Suite Service',
  },
];

// Active in-memory state of assignments (supports future administrative assignment updates)
let currentDoctorBranchAssignments: DoctorBranchAssignment[] = [
  ...INITIAL_DOCTOR_BRANCH_ASSIGNMENTS,
];

// In-memory audit trail of administrative assignment actions
let assignmentAuditLogs: DoctorBranchAssignmentAudit[] = [
  {
    id: 'audit-init-1',
    timestamp: '2025-01-15T09:00:00Z',
    performedByAdminId: 'admin-sys',
    doctorId: 'doc-1',
    branchId: 'branch-central',
    action: 'ASSIGN',
    reason: 'Initial staff credentialing and hospital appointment',
  },
  {
    id: 'audit-init-2',
    timestamp: '2025-03-01T09:00:00Z',
    performedByAdminId: 'admin-clinical-dir',
    doctorId: 'doc-1',
    branchId: 'branch-north',
    action: 'ASSIGN',
    reason: 'Expanded outpatient coverage to North Specialty Center',
  },
];

// ----------------------------------------------------------------------------
// 3. Centralized Access Control Helpers & Queries
// ----------------------------------------------------------------------------

/**
 * Retrieve all active branch assignments for a given doctor.
 */
export function getDoctorBranchAssignments(doctorId: string): DoctorBranchAssignment[] {
  return currentDoctorBranchAssignments.filter(
    (a) => a.doctor_id === doctorId && a.active_status === true
  );
}

/**
 * Retrieve the active HospitalBranch objects assigned to a given doctor.
 */
export function getAssignedBranchesForDoctor(doctorId: string): HospitalBranch[] {
  const assignments = getDoctorBranchAssignments(doctorId);
  const assignedIds = new Set(assignments.map((a) => a.branch_id));
  return SAMPLE_BRANCHES.filter((b) => assignedIds.has(b.id));
}

/**
 * Retrieve the active branch IDs assigned to a doctor.
 */
export function getAssignedBranchIdsForDoctor(doctorId: string): string[] {
  return getDoctorBranchAssignments(doctorId).map((a) => a.branch_id);
}

/**
 * Check whether a doctor is authorized to access records at a specific branch.
 */
export function isDoctorAssignedToBranch(doctorId: string, branchId: string): boolean {
  if (branchId === 'all') return true;
  const allowed = getAssignedBranchIdsForDoctor(doctorId);
  return allowed.includes(branchId);
}

/**
 * Evaluate access for a target branch ID and return a structured evaluation.
 */
export function evaluateBranchAccess(
  doctorId: string,
  requestedBranchId: string
): BranchAccessEvaluation {
  const allowedBranchIds = getAssignedBranchIdsForDoctor(doctorId);
  const branchObj = SAMPLE_BRANCHES.find((b) => b.id === requestedBranchId);
  const branchName = branchObj ? branchObj.name : requestedBranchId;

  if (requestedBranchId === 'all') {
    return {
      allowed: true,
      requestedBranchId: 'all',
      requestedBranchName: 'All Assigned Branches',
      allowedBranchIds,
    };
  }

  const isAllowed = allowedBranchIds.includes(requestedBranchId);

  return {
    allowed: isAllowed,
    requestedBranchId,
    requestedBranchName: branchName,
    allowedBranchIds,
    denialReason: isAllowed
      ? undefined
      : `Physician is not credentialed or assigned to "${branchName}". Under Danvantari Hospital healthcare data governance, clinical access is restricted to authorized branch facilities only.`,
  };
}

/**
 * Generic clinical record filter enforcing branch boundaries.
 * If selectedBranchId is 'all', items are scoped strictly to the doctor's allowed branches.
 * Items belonging to unassigned branches are never returned.
 */
export function filterItemsByBranchAccess<T>(
  items: T[],
  getBranchId: (item: T) => string | undefined,
  selectedBranchId: string,
  allowedBranchIds: string[]
): T[] {
  return items.filter((item) => {
    const itemBranch = getBranchId(item);
    if (!itemBranch) return false;

    // Item must belong to one of the doctor's assigned branches
    if (!allowedBranchIds.includes(itemBranch)) {
      return false;
    }

    // If specific branch selected, match it
    if (selectedBranchId !== 'all') {
      return itemBranch === selectedBranchId;
    }

    return true;
  });
}

// ----------------------------------------------------------------------------
// 4. Administration Workflow Capabilities (Future Admin Assignment Management)
// ----------------------------------------------------------------------------

/**
 * Assign a doctor to a branch (for admin portal integration).
 */
export function adminAssignDoctorToBranch(
  adminUserId: string,
  doctorId: string,
  branchId: string,
  notes?: string
): DoctorBranchAssignment {
  const existing = currentDoctorBranchAssignments.find(
    (a) => a.doctor_id === doctorId && a.branch_id === branchId
  );

  let resultAssignment: DoctorBranchAssignment;

  if (existing) {
    existing.active_status = true;
    existing.updated_at = new Date().toISOString();
    if (notes) existing.notes = notes;
    resultAssignment = existing;
  } else {
    resultAssignment = {
      assignment_id: `assign-${doctorId}-${branchId}-${Date.now()}`,
      doctor_id: doctorId,
      branch_id: branchId,
      active_status: true,
      assigned_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: notes || 'Admin assignment update',
    };
    currentDoctorBranchAssignments.push(resultAssignment);
  }

  assignmentAuditLogs.push({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    performedByAdminId: adminUserId,
    doctorId,
    branchId,
    action: 'ASSIGN',
    reason: notes || 'Administrative branch credentialing',
  });

  return resultAssignment;
}

/**
 * Revoke a doctor's assignment to a branch (for admin portal integration).
 */
export function adminRevokeDoctorBranch(
  adminUserId: string,
  doctorId: string,
  branchId: string,
  reason: string
): boolean {
  const target = currentDoctorBranchAssignments.find(
    (a) => a.doctor_id === doctorId && a.branch_id === branchId
  );

  if (!target) return false;

  target.active_status = false;
  target.updated_at = new Date().toISOString();

  assignmentAuditLogs.push({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    performedByAdminId: adminUserId,
    doctorId,
    branchId,
    action: 'REVOKE',
    reason,
  });

  return true;
}

/**
 * Retrieve the current audit log of branch assignment modifications.
 */
export function getDoctorAssignmentAudits(): DoctorBranchAssignmentAudit[] {
  return [...assignmentAuditLogs];
}

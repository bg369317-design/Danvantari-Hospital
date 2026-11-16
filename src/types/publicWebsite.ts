export interface HospitalBranch {
  id: string;
  name: string;
  isMainCampus: boolean;
  address: string;
  city: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  operatingHours: string;
  emergencyHours: string;
  bedCount: string;
  availableSpecialties: string[];
  statusNote: string;
}

export interface MedicalSpecialty {
  id: string;
  name: string;
  iconName: 'heart' | 'brain' | 'bone' | 'baby' | 'stethoscope' | 'shield' | 'eye' | 'activity';
  summary: string;
  detailedDescription: string;
  keyServices: string[];
  headOfDepartment: string;
  availableBranches: string[];
}

export interface DoctorProfile {
  id: string;
  fullName: string;
  title: string;
  specialtyId: string;
  specialtyName: string;
  primaryBranchId: string;
  qualifications: string;
  experienceYears: number;
  languages: string[];
  consultationDays: string[];
  consultationFee: string;
  bio: string;
  isAvailableToday: boolean;
  registrationNumber: string;
}

export interface HealthPackage {
  id: string;
  title: string;
  category: string;
  targetAudience: string;
  priceNote: string;
  isPopular?: boolean;
  testsIncludedCount: number;
  featuredTests: string[];
  fastingRequired: boolean;
  reportingTime: string;
}

export interface BookingFormState {
  fullName: string;
  phone: string;
  email: string;
  branchId: string;
  specialtyId: string;
  doctorId: string;
  preferredDate: string;
  preferredTimeSlot: string;
  patientType: 'new' | 'returning';
  symptomsNote: string;
}

export interface ContactFormState {
  fullName: string;
  phone: string;
  email: string;
  branchId: string;
  subject: string;
  message: string;
}

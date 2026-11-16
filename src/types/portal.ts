export type UserRole = 'public' | 'patient' | 'doctor' | 'admin';

export interface PortalDescriptor {
  id: UserRole;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  features: string[];
}

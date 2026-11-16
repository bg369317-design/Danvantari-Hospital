// Placeholder for future Supabase client service layer
// Note: Read-only audit maintained. No credentials or tables bound in Phase 1.

export interface ServiceClientConfig {
  readonly endpoint?: string;
  readonly initialized: boolean;
}

export const clientStatus: ServiceClientConfig = {
  initialized: false,
};

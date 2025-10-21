
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}
export function validateSupabaseConfig() {
  if (!SUPABASE_CONFIG.url) {
    return false
  }
  if (!SUPABASE_CONFIG.anonKey) {
    return false
  }
  return true
}
export const DEV_CONFIG = {
  mockUserId: 'dev-user-id',
  mockAdminId: 'dev-admin-id',
  allowUnauthenticated: true,
  verboseLogging: true,
}
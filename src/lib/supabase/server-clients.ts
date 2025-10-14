import { createClient } from '@supabase/supabase-js'
export function serverClientWithToken(token?: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      auth: { persistSession: false, autoRefreshToken: false },
    }
  )
}
export function serverAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
export function getToken(req: Request) {
  const authHeader = req.headers.get('authorization') || ''
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined
}
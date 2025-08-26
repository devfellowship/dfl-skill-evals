// Configuração do Supabase
export const SUPABASE_CONFIG = {
  // Verificar se as variáveis de ambiente estão definidas
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

// Verificar configuração
export function validateSupabaseConfig() {
  if (!SUPABASE_CONFIG.url) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL não está definida')
    return false
  }
  
  if (!SUPABASE_CONFIG.anonKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida')
    return false
  }
  
  console.log('✅ Configuração do Supabase válida')
  return true
}

// Configuração para desenvolvimento
export const DEV_CONFIG = {
  // IDs mockados para desenvolvimento
  mockUserId: 'dev-user-id',
  mockAdminId: 'dev-admin-id',
  
  // Permitir operações sem autenticação
  allowUnauthenticated: true,
  
  // Logs detalhados
  verboseLogging: true,
}

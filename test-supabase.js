const { createClient } = require('@supabase/supabase-js')

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testando conexão com Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n🚀 Testando conexão...')
    
    // Testar se conseguimos acessar a API
    const { data, error } = await supabase
      .from('challenges')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.message.includes('relation "challenges" does not exist')) {
        console.log('⚠️  Tabela "challenges" não existe ainda - isso é normal!')
        console.log('✅ Conexão com Supabase funcionando!')
      } else {
        console.error('❌ Erro ao acessar tabela:', error.message)
      }
    } else {
      console.log('✅ Conexão com Supabase funcionando!')
      console.log('✅ Tabela "challenges" existe!')
    }
    
    // Testar autenticação
    console.log('\n🔐 Testando autenticação...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Erro na autenticação:', authError.message)
    } else {
      console.log('✅ Autenticação funcionando!')
      console.log('Sessão atual:', authData.session ? 'Ativa' : 'Nenhuma')
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

testConnection()

import { supabase } from '@/lib/supabase'

/**
 * Função para debugar o sistema de soft delete
 * Verifica se as colunas existem e se as políticas estão funcionando
 */
export const debugSoftDelete = async () => {
  console.log('🔍 Iniciando debug do soft delete...')
  
  try {
    // 1. Verificar se as colunas de soft delete existem
    console.log('1. Verificando estrutura da tabela...')
    let tableInfo = 'Verificando...'
    let tableError = null
    
    try {
      const { data, error } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('id, title, deleted_at, deleted_by, deletion_reason, status, is_active')
        .limit(1)
      
      tableInfo = data ? 'Colunas existem' : 'Erro'
      tableError = error
    } catch (err) {
      tableError = err
      tableInfo = 'Erro ao verificar'
    }

    if (tableError) {
      console.error('❌ Erro ao verificar estrutura:', tableError)
    } else {
      console.log('✅ Estrutura da tabela:', tableInfo)
    }

    // 2. Verificar challenges com deleted_at preenchido
    console.log('2. Verificando challenges deletadas...')
    const { data: deletedChallenges, error: deletedError } = await supabase
      .schema('skill_evals')
      .from('challenges')
      .select('id, title, deleted_at, deleted_by, deletion_reason, status, is_active')
      .not('deleted_at', 'is', null)

    if (deletedError) {
      console.error('❌ Erro ao buscar challenges deletadas:', deletedError)
    } else {
      console.log('📋 Challenges deletadas encontradas:', deletedChallenges?.length || 0)
      if (deletedChallenges && deletedChallenges.length > 0) {
        console.table(deletedChallenges)
      }
    }

    // 3. Verificar challenges ativas (não deletadas)
    console.log('3. Verificando challenges ativas...')
    const { data: activeChallenges, error: activeError } = await supabase
      .schema('skill_evals')
      .from('challenges')
      .select('id, title, deleted_at, status, is_active')
      .is('deleted_at', null)

    if (activeError) {
      console.error('❌ Erro ao buscar challenges ativas:', activeError)
    } else {
      console.log('📋 Challenges ativas encontradas:', activeChallenges?.length || 0)
      if (activeChallenges && activeChallenges.length > 0) {
        console.table(activeChallenges)
      }
    }

    // 4. Verificar todas as challenges (sem filtro)
    console.log('4. Verificando todas as challenges...')
    const { data: allChallenges, error: allError } = await supabase
      .schema('skill_evals')
      .from('challenges')
      .select('id, title, deleted_at, status, is_active, created_at')
      .order('created_at', { ascending: false })

    if (allError) {
      console.error('❌ Erro ao buscar todas as challenges:', allError)
    } else {
      console.log('📋 Total de challenges:', allChallenges?.length || 0)
      if (allChallenges && allChallenges.length > 0) {
        console.table(allChallenges)
      }
    }

    // 5. Verificar políticas RLS
    console.log('5. Verificando políticas RLS...')
    let policies = 'Não foi possível verificar políticas'
    let policiesError = null
    
    try {
      // Tentar verificar políticas de forma indireta
      const { data, error } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('id')
        .limit(1)
      
      policies = error ? 'Erro ao verificar políticas' : 'Políticas funcionando'
      policiesError = error
    } catch (err) {
      policiesError = err
      policies = 'Erro ao verificar políticas'
    }

    if (policiesError) {
      console.warn('⚠️ Não foi possível verificar políticas RLS:', policiesError)
    } else {
      console.log('📋 Status das políticas RLS:', policies)
    }

    console.log('✅ Debug concluído!')
    return {
      tableInfo,
      deletedChallenges: deletedChallenges?.length || 0,
      activeChallenges: activeChallenges?.length || 0,
      totalChallenges: allChallenges?.length || 0
    }

  } catch (error) {
    console.error('❌ Erro geral no debug:', error)
    return { error: error instanceof Error ? error.message : 'Erro desconhecido' }
  }
}

/**
 * Função para testar soft delete em uma challenge específica
 */
export const testSoftDelete = async (challengeId: string) => {
  console.log(`🧪 Testando soft delete para challenge: ${challengeId}`)
  
  try {
    // 1. Verificar estado atual
    const { data: current, error: currentError } = await supabase
      .schema('skill_evals')
      .from('challenges')
      .select('id, title, deleted_at, status, is_active')
      .eq('id', challengeId)
      .single()

    if (currentError) {
      console.error('❌ Erro ao buscar challenge:', currentError)
      return
    }

    console.log('📋 Estado atual:', current)

    // 2. Aplicar soft delete
    const { error: deleteError } = await supabase
      .schema('skill_evals')
      .from('challenges')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: 'test-user-id',
        deletion_reason: 'Teste de soft delete',
        status: 'deleted',
        is_active: false,
        is_public: false
      })
      .eq('id', challengeId)

    if (deleteError) {
      console.error('❌ Erro ao aplicar soft delete:', deleteError)
      return
    }

    console.log('✅ Soft delete aplicado com sucesso!')

    // 3. Verificar estado após soft delete
    const { data: after, error: afterError } = await supabase
      .schema('skill_evals')
      .from('challenges')
      .select('id, title, deleted_at, status, is_active')
      .eq('id', challengeId)
      .single()

    if (afterError) {
      console.error('❌ Erro ao verificar estado após soft delete:', afterError)
      return
    }

    console.log('📋 Estado após soft delete:', after)

  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

// Expor no window para uso no console
if (typeof window !== 'undefined') {
  (window as any).debugSoftDelete = debugSoftDelete
  // Para testar soft delete: testSoftDelete('challenge-id')
}

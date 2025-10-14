import { supabase } from '@/lib/supabase'

/**
 * @param userId
 * @param fullName 
 * @param email 
 */
export const setupUserProfile = async (userId: string, fullName: string, email: string) => {
  try {
    // Buscar perfil existente e dados do users_with_roles
    const [profileResult, userRolesResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', userId)
        .maybeSingle(),
      supabase
        .from('users_with_roles')
        .select('id, name, roles')
        .eq('id', userId)
        .maybeSingle()
    ])

    if (profileResult.error) {
      return { success: false, error: profileResult.error.message }
    }

    const existingProfile = profileResult.data
    const existingUserRoles = userRolesResult.data

    // Atualizar ou criar perfil
    if (existingProfile) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          email: email,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        return { success: false, error: updateError.message }
      }
    } else {
      // Criar novo perfil
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: fullName,
          email: email,
          role: 'admin',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        return { success: false, error: insertError.message }
      }
    }

    // Atualizar users_with_roles se existir
    if (existingUserRoles) {
      const { error: updateUserRolesError } = await supabase
        .from('users_with_roles')
        .update({
          name: fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateUserRolesError) {
        // Não falha a operação principal por causa disso
      }
    }

    return { success: true, action: existingProfile ? 'updated' : 'created' }
  } catch (error) {
    return { success: false, error: 'Erro interno' }
  }
}

/**
 * Função para configurar o perfil do usuário atual
 * Pode ser chamada no console do navegador para configurar rapidamente
 */
export const setupCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return
  }

  const fullName = prompt('Digite seu nome completo:')
  if (!fullName) {
    return
  }

  const result = await setupUserProfile(user.id, fullName, user.email || '')
}

/**
 * Função específica para atualizar apenas o nome na tabela users_with_roles
 * Mais simples e direta para o seu caso
 */
export const updateUserNameInRoles = async (userId: string, fullName: string) => {
  try {
    const { error } = await supabase
      .from('users_with_roles')
      .update({
        name: fullName,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, action: 'updated' }
  } catch (error) {
    return { success: false, error: 'Erro interno' }
  }
}

/**
 * Função para atualizar o nome do usuário atual
 * Pode ser chamada no console do navegador
 */
export const updateCurrentUserName = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return
  }

  const fullName = prompt('Digite seu nome completo:')
  if (!fullName) {
    return
  }

  const result = await updateUserNameInRoles(user.id, fullName)
}

// Expor no window para uso no console
if (typeof window !== 'undefined') {
  (window as any).setupProfile = setupCurrentUserProfile
  // Para atualizar apenas o nome: updateCurrentUserName()
}

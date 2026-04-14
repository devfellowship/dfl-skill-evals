import { supabase } from '@/lib/supabase'

export const setupUserProfile = async (userId: string, fullName: string, email: string) => {
  try {
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', userId)
      .maybeSingle()

    if (profileError) {
      return { success: false, error: profileError.message }
    }

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

    return { success: true, action: existingProfile ? 'updated' : 'created' }
  } catch (error) {
    return { success: false, error: 'Erro interno' }
  }
}

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

export const updateUserNameInRoles = async (userId: string, fullName: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
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

if (typeof window !== 'undefined') {
  (window as any).setupProfile = setupCurrentUserProfile
}

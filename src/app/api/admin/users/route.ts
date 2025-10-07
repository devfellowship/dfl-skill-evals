import { NextRequest, NextResponse } from 'next/server'
import { serverClientWithToken, getToken } from '@/lib/supabase/server-clients'
import { UserRole } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request)
    const supabase = serverClientWithToken(token)

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .schema('portfolio')
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    const id = (searchParams.get('id') || '').trim()
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    let query = supabase
      .schema('portfolio')
      .from('users')
      .select(`
        id,
        email,
        full_name,
        role,
        is_active,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })

    if (id) {
      query = query.eq('id', id)
    } else if (q) {
      query = query.or([
        `full_name.ilike.%${q}%`,
        `email.ilike.%${q}%`
      ].join(','))
    }

    if (from) query = query.gte('created_at', from)
    if (to) query = query.lte('created_at', to)

    const { data: users, error: usersError } = await query

    if (usersError) {
      return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
    }

    return NextResponse.json({ users: users || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = getToken(request)
    const supabase = serverClientWithToken(token)
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores podem alterar roles.' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId e role são obrigatórios' }, { status: 400 })
    }

    const validRoles: UserRole[] = ['superadmin', 'admin', 'community_member']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Role inválida' }, { status: 400 })
    }

    const { data: existingUser, error: userError } = await supabase
      .schema('portfolio')
      .from('users')
      .select('id, email, role')
      .eq('id', userId)
      .single()

    if (userError || !existingUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const { data: updatedUser, error: updateError } = await supabase
      .schema('portfolio')
      .from('users')
      .update({ 
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Erro ao atualizar role do usuário' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Role atualizada com sucesso',
      user: updatedUser
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getToken(request)
    const supabase = serverClientWithToken(token)
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores podem atualizar usuários.' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, full_name, email, role, is_active, password } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
    }

    const { data: targetUser, error: targetUserError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (targetUserError || !targetUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const updateData: any = {}
    const changes: string[] = []

    if (full_name && full_name !== targetUser.full_name) {
      updateData.full_name = full_name
      changes.push(`Nome: "${targetUser.full_name}" → "${full_name}"`)
    }

    if (email && email !== targetUser.email) {
      updateData.email = email
      changes.push(`Email: "${targetUser.email}" → "${email}"`)
    }

    if (role && role !== targetUser.role) {
      updateData.role = role
      changes.push(`Role: "${targetUser.role}" → "${role}"`)
    }

    if (typeof is_active === 'boolean' && is_active !== targetUser.is_active) {
      updateData.is_active = is_active
      changes.push(`Status: "${targetUser.is_active ? 'Ativo' : 'Inativo'}" → "${is_active ? 'Ativo' : 'Inativo'}"`)
    }

    updateData.updated_at = new Date().toISOString()

    if (Object.keys(updateData).length > 1) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)

      if (updateError) {
        return NextResponse.json({ error: 'Erro ao atualizar perfil do usuário' }, { status: 500 })
      }
    }

    if (password) {
      const { error: passwordError } = await supabase.auth.admin.updateUserById(userId, {
        password: password
      })

      if (passwordError) {
        return NextResponse.json({ error: 'Erro ao atualizar senha do usuário' }, { status: 500 })
      }
      changes.push('Senha: [alterada]')
    }

    const { data: updatedUser, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Erro ao buscar dados atualizados' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Usuário atualizado com sucesso',
      user: updatedUser,
      changes: changes
    })

  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

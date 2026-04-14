import { NextRequest, NextResponse } from 'next/server'
import { serverClientWithToken, getToken } from '@/lib/supabase/server-clients'
import { UserRole } from '@/lib/supabase'
export async function POST(request: NextRequest) {
  try {
    const token = getToken(request)
    const supabase = serverClientWithToken(token)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    const { data: iamData, error: iamError } = await supabase.rpc('get_my_iam_role')
    const iamRoles = (iamData as { role_id: string; level: number }[] | null) || []
    const iamRole = iamRoles[0]
    if (iamError || !iamRole || iamRole.level < 80) {
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores podem criar perfis.' }, { status: 403 })
    }
    const body = await request.json()
    const { userId, email, fullName, role = 'community_member' } = body
    if (!userId || !email || !fullName) {
      return NextResponse.json({ error: 'userId, email e fullName são obrigatórios' }, { status: 400 })
    }
    const validRoles: UserRole[] = ['admin', 'mentor', 'community_member']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Role inválida' }, { status: 400 })
    }
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()
    if (existingProfile) {
      return NextResponse.json({ error: 'Perfil já existe para este usuário' }, { status: 409 })
    }
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName,
        role: role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    if (createError) {
      return NextResponse.json({ error: 'Erro ao criar perfil' }, { status: 500 })
    }
    return NextResponse.json({
      message: 'Perfil criado com sucesso',
      profile: newProfile
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
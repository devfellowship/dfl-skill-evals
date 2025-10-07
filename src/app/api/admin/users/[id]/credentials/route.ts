import { NextRequest, NextResponse } from 'next/server'
import { serverClientWithToken, serverAdminClient, getToken } from '@/lib/supabase/server-clients'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores podem atualizar credenciais.' }, { status: 403 })
    }

    const { id: userId } = params
    const { email, password } = await request.json() as Partial<{ 
      email: string
      password: string 
    }>

    if (!email && !password) {
      return NextResponse.json({ error: 'Email ou senha deve ser fornecido' }, { status: 400 })
    }
    const { data: before, error: beforeError } = await supabase
      .schema('portfolio')
      .from('users')
      .select('email')
      .eq('id', userId)
      .single()

    if (beforeError || !before) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'Configuração do servidor incompleta. Service role key não encontrada.' 
      }, { status: 500 })
    }
    const admin = serverAdminClient()
    const updateData: any = {}
    if (email) updateData.email = email
    if (password) updateData.password = password

    const { data: authUser, error: updateError } = await admin.auth.admin.updateUserById(userId, updateData)

    if (updateError) {
      return NextResponse.json({ 
        error: `Erro ao atualizar credenciais: ${updateError.message}` 
      }, { status: 500 })
    }
    if (email && email !== before.email) {
      await supabase
        .schema('portfolio')
        .from('users')
        .update({ email, updated_at: new Date().toISOString() })
        .eq('id', userId)
    }
    try {
      await supabase.from('app_logs').insert({
        actor_id: user.id,   
        target_id: userId,   
        action: 'update_credentials',
        details: {
          email_changed: Boolean(email),
          password_changed: Boolean(password),
          old_email: before.email,
          new_email: email || before.email,
        }
      })
    } catch (logError) {
      console.error('Erro ao logar mudança de credenciais:', logError)
    }

    return NextResponse.json({ 
      message: 'Credenciais atualizadas com sucesso',
      user: authUser 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: `Erro interno do servidor: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
    }, { status: 500 })
  }
}

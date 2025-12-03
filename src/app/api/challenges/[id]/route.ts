import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getToken, serverClientWithToken } from '@/lib/supabase/server-clients'
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do challenge é obrigatório' },
        { status: 400 }
      )
    }
    
    const { data: challenges, error: challengesError } = await supabase
      .schema('skill_evals')
      .from('challenges')
      .select('*')
      .eq('id', id)
    
    let challenge = null
    let error = challengesError
    
    if (challenges && challenges.length > 0) {
      challenge = challenges[0]
      error = null
    } else if (challengesError) {
      error = challengesError
    }
    
    if (error) {
      return NextResponse.json(
        { error: 'Erro ao buscar challenge', details: error.message },
        { status: 500 }
      )
    }
    
    if (!challenge) {
      const { data: deletedChallenge, error: deletedError } = await supabase
        .schema('skill_evals')
        .from('challenges')
        .select('id, title, status, deleted_at, deleted_by')
        .eq('id', id)
        .not('deleted_at', 'is', null)
        .single()
      
      if (deletedChallenge) {
        return NextResponse.json(
          { error: 'Challenge não encontrada - pode ter sido excluída' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Challenge não encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ data: challenge })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getToken(request)
    const supabaseAuth = serverClientWithToken(token)
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    if (!id) {
      return NextResponse.json(
        { error: 'ID do challenge é obrigatório' },
        { status: 400 }
      )
    }

    const { data: challenge, error: checkError } = await supabase
      .schema('skill_evals')
      .from('challenges')
      .select('created_by')
      .eq('id', id)
      .single()

    if (checkError || !challenge) {
      return NextResponse.json(
        { error: 'Challenge não encontrado' },
        { status: 404 }
      )
    }

    const { data: profile } = await supabaseAuth
      .from('users_with_roles')
      .select('roles')
      .eq('id', user.id)
      .single()

    const isOwner = challenge.created_by === user.id
    const isAdmin = profile?.roles?.includes('admin')

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }
    const { data: updatedChallenge, error } = await supabase
      .schema('skill_evals')
      .from('challenges')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    if (error) {
      return NextResponse.json(
        { error: 'Erro ao atualizar challenge' },
        { status: 500 }
      )
    }
    return NextResponse.json({ data: updatedChallenge })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getToken(request)
    const supabaseAuth = serverClientWithToken(token)
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { error: 'ID do challenge é obrigatório' },
        { status: 400 }
      )
    }

    const { data: challenge, error: checkError } = await supabase
      .schema('skill_evals')
      .from('challenges')
      .select('created_by')
      .eq('id', id)
      .single()

    if (checkError || !challenge) {
      return NextResponse.json(
        { error: 'Challenge não encontrado' },
        { status: 404 }
      )
    }

    const { data: profile } = await supabaseAuth
      .from('users_with_roles')
      .select('roles')
      .eq('id', user.id)
      .single()

    const isOwner = challenge.created_by === user.id
    const isAdmin = profile?.roles?.includes('admin')

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .schema('skill_evals')
      .from('challenges')
      .delete()
      .eq('id', id)
    if (error) {
      return NextResponse.json(
        { error: 'Erro ao deletar challenge' },
        { status: 500 }
      )
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

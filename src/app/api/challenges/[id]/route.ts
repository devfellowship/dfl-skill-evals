import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'ID do challenge é obrigatório' },
        { status: 400 }
      )
    }

    const { data: challenge, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar challenge:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar challenge' },
        { status: 500 }
      )
    }

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: challenge })
  } catch (error) {
    console.error('Erro na API de challenge:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID do challenge é obrigatório' },
        { status: 400 }
      )
    }

    const { data: challenge, error } = await supabase
      .from('challenges')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar challenge:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar challenge' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: challenge })
  } catch (error) {
    console.error('Erro na API de atualização de challenge:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'ID do challenge é obrigatório' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar challenge:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar challenge' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro na API de exclusão de challenge:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

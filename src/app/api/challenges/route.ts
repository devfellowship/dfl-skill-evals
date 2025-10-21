import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { data: challenges, error } = await supabase
      .schema('skill_evals')
      .from('challenges')
      .select('id, title, status, deleted_at, created_by, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao buscar challenges', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      data: challenges || [],
      count: challenges?.length || 0
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/supabase'

interface ChallengeDetails extends Tables<'challenges'> {
  challenge_examples?: Array<{
    id: string
    challenge_id: string
    input: string
    output: string
    explanation?: string
    order_index: number
    created_at: string
    created_by?: string
  }>
  challenge_test_cases?: Array<{
    id: string
    challenge_id: string
    input: string
    expected_output: string
    is_hidden: boolean
    order_index: number
    created_at: string
    created_by?: string
  }>
}

export function useChallengeDetails(challengeId: string) {
  const [challenge, setChallenge] = useState<ChallengeDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!challengeId) return

    const fetchChallenge = async () => {
      try {
        setLoading(true)
        setError(null)

        const searchTitle = challengeId.replace(/-/g, ' ')
        
        const { data, error: fetchError } = await supabase
          .schema('skill_evals')
          .from('challenges')
          .select(`
            *,
            challenge_examples (
              id,
              input,
              output,
              explanation,
              order_index
            ),
            challenge_test_cases (
              id,
              input,
              expected_output,
              is_hidden,
              order_index
            )
          `)
          .eq('status', 'approved')
          .eq('is_public', true)
          .ilike('title', `%${searchTitle}%`)
          .single()

        if (fetchError) {
          throw fetchError
        }

        if (!data) {
          throw new Error('Challenge não encontrado')
        }

        setChallenge(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        setChallenge(null)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenge()
  }, [challengeId])

  return {
    challenge,
    loading,
    error,
  }
}

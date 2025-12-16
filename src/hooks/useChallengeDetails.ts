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

        console.group('🔍 [useChallengeDetails] Fetching challenge')
        console.log('challengeId (slug):', challengeId)
        console.log('searchTitle:', searchTitle)

        const { data: allData, error: fetchError } = await supabase
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

        console.log('fetchError:', fetchError)
        console.log('allData length:', allData?.length)
        console.groupEnd()

        if (fetchError) {
          throw fetchError
        }

        if (!allData || allData.length === 0) {
          throw new Error('Challenge não encontrado')
        }

        const generateSlug = (title: string): string => {
          return title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
        }

        const matchedChallenge = allData.find(challenge =>
          generateSlug(challenge.title) === challengeId.toLowerCase()
        )

        if (!matchedChallenge) {
          console.error('No challenge matched slug:', challengeId)
          console.error('Available titles:', allData.map(c => ({ title: c.title, slug: generateSlug(c.title) })))
          throw new Error('Challenge não encontrado')
        }

        const data = matchedChallenge
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
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/supabase'

interface ChallengeDetails extends Tables<'challenges'> {
  // Campos adicionais processados
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

        // Buscar por título (convertendo slug)
        const searchTitle = challengeId.replace(/-/g, ' ')
        
        // Buscar por título usando ilike para melhor compatibilidade
        const { data, error: fetchError } = await supabase
          .from('challenges')
          .select('*')
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

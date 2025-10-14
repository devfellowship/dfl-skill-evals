import { useState } from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { Badge } from '@/components/atoms/Badge/Badge'
import { Star, StarOff, Settings } from 'lucide-react'
import { useTrendingChallenges } from '@/hooks/useTrendingChallenges'
import { invalidateChallengesCache } from '@/hooks/useChallenges'
import { toast } from 'sonner'

interface TrendingManagerProps {
  challenges: Array<{
    id: string
    title: string
    trending?: boolean
    trending_priority?: number | null
  }>
  onUpdate?: () => void
}

export function TrendingManager({ challenges, onUpdate }: TrendingManagerProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const { setTrending, removeTrending, updateTrendingPriority } = useTrendingChallenges()

  const trendingChallenges = challenges.filter(c => c.trending)
  const regularChallenges = challenges.filter(c => !c.trending)

  const handleToggleTrending = async (challengeId: string, isCurrentlyTrending: boolean) => {
    if (isUpdating) return

    setIsUpdating(challengeId)
    try {
      if (isCurrentlyTrending) {
        await removeTrending(challengeId)
      } else {
        await setTrending(challengeId, 1)
      }
      
      // Invalida o cache para garantir que as mudanças sejam refletidas
      invalidateChallengesCache()
      onUpdate?.()
    } catch (error) {
      console.error('Erro ao atualizar trending:', error)
    } finally {
      setIsUpdating(null)
    }
  }

  const handleUpdatePriority = async (challengeId: string, newPriority: number) => {
    if (isUpdating) return

    setIsUpdating(challengeId)
    try {
      await updateTrendingPriority(challengeId, newPriority)
      onUpdate?.()
    } catch (error) {
      console.error('Erro ao atualizar prioridade:', error)
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      {trendingChallenges.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">🔥 Challenges Trending</h3>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {trendingChallenges.length}
            </Badge>
          </div>
          
          <div className="grid gap-3">
            {trendingChallenges
              .sort((a, b) => (a.trending_priority || 0) - (b.trending_priority || 0))
              .map((challenge, index) => (
                <div
                  key={challenge.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-orange-50/50 border-orange-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-orange-700">
                      #{challenge.trending_priority || index + 1}
                    </span>
                    <span className="font-medium">{challenge.title}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdatePriority(challenge.id, (challenge.trending_priority || 1) - 1)}
                        disabled={isUpdating === challenge.id || (challenge.trending_priority || 1) <= 1}
                        className="h-6 w-6 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdatePriority(challenge.id, (challenge.trending_priority || 1) + 1)}
                        disabled={isUpdating === challenge.id}
                        className="h-6 w-6 p-0"
                      >
                        ↓
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleTrending(challenge.id, true)}
                      disabled={isUpdating === challenge.id}
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      <Star className="w-4 h-4 fill-current mr-1" />
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Seção Regular */}
      {regularChallenges.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">📋 Todas as Challenges</h3>
            <Badge variant="secondary">
              {regularChallenges.length}
            </Badge>
          </div>
          
          <div className="grid gap-2">
            {regularChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <span className="font-medium">{challenge.title}</span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleTrending(challenge.id, false)}
                  disabled={isUpdating === challenge.id}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <StarOff className="w-4 h-4 mr-1" />
                  Marcar Trending
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {challenges.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma challenge encontrada</p>
        </div>
      )}
    </div>
  )
}


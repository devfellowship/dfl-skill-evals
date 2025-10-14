import { useState } from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { Badge } from '@/components/atoms/Badge/Badge'
import { Star, StarOff, ArrowUp, ArrowDown } from 'lucide-react'
import { useTrendingChallenges } from '@/hooks/useTrendingChallenges'
import { invalidateChallengesCache } from '@/hooks/useChallenges'
import { toast } from 'sonner'
interface TrendingToggleProps {
  challengeId: string
  isTrending: boolean
  trendingPriority?: number | null
  onUpdate?: () => void
  showPriority?: boolean
}
export function TrendingToggle({ 
  challengeId, 
  isTrending, 
  trendingPriority = null,
  onUpdate,
  showPriority = true
}: TrendingToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toggleTrending, updateTrendingPriority } = useTrendingChallenges()
  const handleToggleTrending = async () => {
    if (isUpdating) return
    setIsUpdating(true)
    try {
      await toggleTrending(challengeId, isTrending, 1)
      toast.success(isTrending ? 'Removido das novidades' : 'Adicionado às novidades')
      invalidateChallengesCache()
      onUpdate?.()
    } catch (error) {
      console.error('Erro ao atualizar novidade:', error)
      toast.error('Erro ao atualizar novidade')
    } finally {
      setIsUpdating(false)
    }
  }
  const handleUpdatePriority = async (newPriority: number) => {
    if (isUpdating || !isTrending) return
    setIsUpdating(true)
    try {
      await updateTrendingPriority(challengeId, newPriority)
      toast.success('Prioridade atualizada')
      onUpdate?.()
    } catch (error) {
      toast.error('Erro ao atualizar prioridade')
    } finally {
      setIsUpdating(false)
    }
  }
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isTrending ? "default" : "outline"}
        size="sm"
        onClick={handleToggleTrending}
        disabled={isUpdating}
        className="flex items-center gap-1"
      >
        {isTrending ? (
          <>
            <Star className="w-4 h-4 fill-current" />
            Novidade
          </>
        ) : (
          <>
            <StarOff className="w-4 h-4" />
            Marcar Novidade
          </>
        )}
      </Button>
      {isTrending && showPriority && (
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-xs">
            Prioridade: {trendingPriority || 1}
          </Badge>
          <div className="flex flex-col gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdatePriority((trendingPriority || 1) - 1)}
              disabled={isUpdating || (trendingPriority || 1) <= 1}
              className="h-4 w-4 p-0"
            >
              <ArrowUp className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdatePriority((trendingPriority || 1) + 1)}
              disabled={isUpdating}
              className="h-4 w-4 p-0"
            >
              <ArrowDown className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
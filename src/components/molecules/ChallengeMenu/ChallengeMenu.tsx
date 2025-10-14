import { useState } from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { MoreVertical, Star, StarOff } from 'lucide-react'
import { useTrendingChallenges } from '@/hooks/useTrendingChallenges'
import { invalidateChallengesCache } from '@/hooks/useChallenges'
import { toast } from 'sonner'

interface ChallengeMenuProps {
  challengeId: string
  isTrending: boolean
  onUpdate?: () => void
}

export function ChallengeMenu({ challengeId, isTrending, onUpdate }: ChallengeMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toggleTrending } = useTrendingChallenges()

  const handleToggleTrending = async () => {
    if (isUpdating) return

    setIsUpdating(true)
    try {
      await toggleTrending(challengeId, isTrending, 1)
      toast.success(isTrending ? 'Removido do trending' : 'Adicionado ao trending')
      
      // Invalida o cache e aguarda um pouco antes de chamar onUpdate
      invalidateChallengesCache()
      setTimeout(() => {
        onUpdate?.()
      }, 500)
    } catch (error) {
      console.error('Erro ao atualizar trending:', error)
      toast.error('Erro ao atualizar trending')
    } finally {
      setIsUpdating(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/80 hover:bg-white/90 shadow-sm"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {isOpen && (
        <>
          {/* Overlay para fechar o menu */}
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu dropdown */}
          <div className="absolute top-10 right-0 z-30 bg-white border rounded-lg shadow-lg py-1 min-w-[160px]">
            <button
              onClick={handleToggleTrending}
              disabled={isUpdating}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              {isTrending ? (
                <>
                  <StarOff className="w-4 h-4 text-gray-600" />
                  Remover do Trending
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 text-orange-500" />
                  Marcar como Trending
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Button } from '@/components/atoms/Button/Button'
import { MoreVertical, Star, StarOff, Edit, Eye } from 'lucide-react'
import { useTrendingChallenges } from '@/hooks/useTrendingChallenges'
import { invalidateChallengesCache } from '@/hooks/useChallenges'
import { useUserRole } from '@/hooks/useUserRole'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface ChallengeMenuProps {
  challengeId: string
  isTrending: boolean
  onUpdate?: () => void
  challenge?: {
    created_by?: string
    title?: string
  }
}

export function ChallengeMenu({ challengeId, isTrending, onUpdate, challenge }: ChallengeMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toggleTrending } = useTrendingChallenges()
  const { isAdmin } = useUserRole()
  const { user } = useAuth()

  const canEdit = isAdmin || (user?.id && challenge?.created_by === user.id)

  const handleToggleTrending = async () => {
    if (isUpdating) return

    setIsUpdating(true)
    try {
      await toggleTrending(challengeId, isTrending, 1)
      toast.success(isTrending ? 'Removido do trending' : 'Adicionado ao trending')
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

  const handleEdit = () => {
    window.open(`/admin/challenge/${challengeId}`, '_blank')
    setIsOpen(false)
  }

  const handleView = () => {
    window.open(`/challenge/${challengeId}`, '_blank')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {canEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="absolute top-2 right-2 z-40 h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg border-2 border-white"
        >
          <Edit className="w-5 h-5 text-white" />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-2 z-40 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm ${canEdit ? 'right-12' : 'right-2'}`}
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-10 right-0 z-30 bg-white border rounded-lg shadow-lg py-1 min-w-[160px]">
            <button
              onClick={handleView}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-gray-600" />
              Visualizar
            </button>
            
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

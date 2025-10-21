import { useMemo, useState } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Edit, Trash2, Eye, RefreshCw, Plus, Archive } from "lucide-react"
import { AdminChallenge as Challenge, DIFFICULTY_OPTIONS, STATUS_OPTIONS } from "@/types/admin/admin-dashboard"
import { SortButton } from "@/components/atoms/SortButton/SortButton"
import { ChallengeSorter, SortType } from "@/lib/challenge-sorter"
import { TrendingToggle } from "@/components/molecules/TrendingToggle/TrendingToggle"
import { ViewChallengeOverlay } from "@/components/molecules/ViewChallengeOverlay/ViewChallengeOverlay"
import { EditChallengeOverlay } from "@/components/molecules/EditChallengeOverlay/EditChallengeOverlay"
interface ChallengeListProps {
  challenges: Challenge[]
  isInitialLoading: boolean
  onEdit: (challenge: Challenge) => void
  onUpdateChallenge?: (challenge: Challenge) => void
  onDelete: (id: string) => void
  onSendBackForReview: (id: string) => void
  onArchive: (id: string) => void
  isDeleting?: string | null
  isArchiving?: string | null
  onCreateNew: () => void
  searchQuery?: string
}
export function ChallengeList({
  challenges,
  isInitialLoading,
  onEdit,
  onDelete,
  onSendBackForReview,
  onArchive,
  isDeleting,
  isArchiving,
  onCreateNew,
  onUpdateChallenge,
  searchQuery = ""
}: ChallengeListProps) {
  const [sortType, setSortType] = useState<SortType>('created_desc')
  const [viewingChallenge, setViewingChallenge] = useState<Challenge | null>(null)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [isViewOverlayOpen, setIsViewOverlayOpen] = useState(false)
  const [isEditOverlayOpen, setIsEditOverlayOpen] = useState(false)
  const filteredAndSortedChallenges = useMemo(() => {
    let filtered = challenges
    if (searchQuery.trim()) {
      filtered = challenges.filter(challenge => 
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return ChallengeSorter.sortChallenges(filtered, sortType)
  }, [challenges, sortType, searchQuery])
  const getDifficultyColor = useMemo(() => (difficulty: string) => {
    return DIFFICULTY_OPTIONS.find((opt: any) => opt.value === difficulty)?.color || ""
  }, [])
  const getStatusColor = useMemo(() => (status: string) => {
    return STATUS_OPTIONS.find((opt: any) => opt.value === status)?.color || ""
  }, [])
  const getStatusLabel = useMemo(() => (status: string) => {
    return STATUS_OPTIONS.find((opt: any) => opt.value === status)?.label || status
  }, [])
  if (isInitialLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
    )
  }
  if (challenges.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Nenhum challenge encontrado</p>
        <Button onClick={onCreateNew} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Criar Primeiro Challenge
        </Button>
      </div>
    )
  }
  return (
    <div className="space-y-4">
             <div className="flex items-center justify-between">
         <div className="text-sm text-muted-foreground">
           {filteredAndSortedChallenges.length} challenge{filteredAndSortedChallenges.length !== 1 ? 's' : ''} encontrado{filteredAndSortedChallenges.length !== 1 ? 's' : ''}
           {searchQuery && (
             <span className="ml-2 text-blue-600">
               (filtrado por: "{searchQuery}")
             </span>
           )}
         </div>
        <SortButton 
          currentSort={sortType} 
          onSortChange={(sort) => setSortType(sort as SortType)}
        />
      </div>
             {filteredAndSortedChallenges.map(challenge => (
        <div
          key={challenge.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:border-border/60 transition-all duration-200 group w-full"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                {challenge.title}
              </h3>
              <Badge className={getDifficultyColor(challenge.difficulty)}>
                {DIFFICULTY_OPTIONS.find(opt => opt.value === challenge.difficulty)?.label || challenge.difficulty}
              </Badge>
              <Badge className={getStatusColor(challenge.status)}>
                {STATUS_OPTIONS.find(opt => opt.value === challenge.status)?.label || challenge.status}
              </Badge>
              {challenge.trending && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  🔥 Novidade
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-2 group-hover:text-foreground transition-colors duration-200">
              {challenge.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
              <span>📁 {Array.isArray(challenge.category) ? challenge.category.join(', ') : challenge.category}</span>
              <span>⚡ {challenge.functionName}</span>
              <span>👤 Criado por: {challenge.mentor || 'Usuário'}</span>
              <span>📅 Criado: {challenge.createdAt}</span>
              {challenge.createdAt !== challenge.updatedAt && (
                <span>🔄 Atualizado: {challenge.updatedAt}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingChallenge(challenge)
                setIsEditOverlayOpen(true)
              }}
              className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
              title="Editar Challenge"
            >
              <Edit className="w-4 h-4" />
            </Button>
                                    <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setViewingChallenge(challenge)
                            setIsViewOverlayOpen(true)
                          }}
                          className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                          title="Visualizar Challenge"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
            {}
            {challenge.status === 'published' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSendBackForReview(challenge.id)}
                className="text-orange-600 hover:text-orange-700 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                title="Enviar de volta para análise"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            {}
            {challenge.status === 'published' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onArchive(challenge.id)}
                disabled={isArchiving === challenge.id}
                className="text-gray-600 hover:text-gray-700 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                title="Arquivar challenge"
              >
                <Archive className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(challenge.id)}
              disabled={isDeleting === challenge.id}
              className="text-red-600 hover:text-red-700 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      {viewingChallenge && (() => {
        const challengeData = {
          id: viewingChallenge.id,
          title: viewingChallenge.title,
          description: viewingChallenge.description,
          difficulty: viewingChallenge.difficulty,
          category: Array.isArray(viewingChallenge.category) ? viewingChallenge.category[0] : viewingChallenge.category,
          function_name: viewingChallenge.functionName || '',
          initial_code: viewingChallenge.initialCode || '',
          testCases: viewingChallenge.testCases || [],
          examples: [],
          status: viewingChallenge.status,
          mentor: viewingChallenge.mentor,
          createdAt: viewingChallenge.createdAt,
          updatedAt: viewingChallenge.updatedAt
        }
        return (
          <ViewChallengeOverlay
            challenge={challengeData}
            isOpen={isViewOverlayOpen}
            onClose={() => {
              setIsViewOverlayOpen(false)
              setViewingChallenge(null)
            }}
          />
        )
      })()}

      {editingChallenge && (() => {
        const challengeData = {
          id: editingChallenge.id,
          title: editingChallenge.title,
          description: editingChallenge.description,
          difficulty: editingChallenge.difficulty,
          category: Array.isArray(editingChallenge.category) ? editingChallenge.category[0] : editingChallenge.category,
          function_name: editingChallenge.functionName || '',
          initial_code: editingChallenge.initialCode || '',
          testCases: editingChallenge.testCases || [],
          examples: [],
          status: editingChallenge.status,
          mentor: editingChallenge.mentor,
          createdAt: editingChallenge.createdAt,
          updatedAt: editingChallenge.updatedAt
        }
        
        const handleSave = (updatedChallenge: any) => {
          if (onUpdateChallenge) {
            const adminChallenge: Challenge = {
              id: updatedChallenge.id,
              title: updatedChallenge.title,
              description: updatedChallenge.description,
              difficulty: updatedChallenge.difficulty,
              category: updatedChallenge.category,
              functionName: updatedChallenge.function_name,
              initialCode: updatedChallenge.initial_code,
              testCases: updatedChallenge.testCases,
              slug: updatedChallenge.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
              status: updatedChallenge.status,
              mentor: updatedChallenge.mentor || 'Usuário',
              createdAt: updatedChallenge.createdAt || editingChallenge.createdAt,
              updatedAt: new Date().toISOString()
            }
            onUpdateChallenge(adminChallenge)
          }
        }
        
        return (
          <EditChallengeOverlay
            challenge={challengeData}
            isOpen={isEditOverlayOpen}
            onClose={() => {
              setIsEditOverlayOpen(false)
              setEditingChallenge(null)
            }}
            onSave={handleSave}
          />
        )
      })()}
    </div>
  )
}

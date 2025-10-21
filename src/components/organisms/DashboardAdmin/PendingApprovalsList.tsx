import { useMemo, useState } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Edit, Trash2, Eye, CheckCircle, XCircle, Archive, GitCompare } from "lucide-react"
import { AdminChallenge as Challenge, DIFFICULTY_OPTIONS, STATUS_OPTIONS } from "@/types/admin/admin-dashboard"
import { EditChallengeOverlay } from "@/components/molecules/EditChallengeOverlay/EditChallengeOverlay"
import { ViewChallengeOverlay } from "@/components/molecules/ViewChallengeOverlay/ViewChallengeOverlay"
interface PendingApprovalsListProps {
  challenges: Challenge[]
  isInitialLoading: boolean
  onEdit: (challenge: Challenge) => void
  onDelete: (id: string) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onArchive: (id: string) => void
  onCompare?: (id: string) => void
  onUpdateChallenge?: (challenge: Challenge) => void
  isDeleting?: string | null
  isApproving?: string | null
  isArchiving?: string | null
  searchQuery?: string
}
export function PendingApprovalsList({
  challenges,
  isInitialLoading,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onArchive,
  onCompare,
  onUpdateChallenge,
  isDeleting,
  isApproving,
  isArchiving,
  searchQuery = ""
}: PendingApprovalsListProps) {
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [viewingChallenge, setViewingChallenge] = useState<Challenge | null>(null)
  const [isEditOverlayOpen, setIsEditOverlayOpen] = useState(false)
  const [isViewOverlayOpen, setIsViewOverlayOpen] = useState(false)
  const getDifficultyColor = useMemo(() => (difficulty: string) => {
    return DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty)?.color || ""
  }, [])
  const getStatusColor = useMemo(() => (status: string) => {
    return STATUS_OPTIONS.find(opt => opt.value === status)?.color || ""
  }, [])
  const getStatusLabel = useMemo(() => (status: string) => {
    return STATUS_OPTIONS.find(opt => opt.value === status)?.label || status
  }, [])
  const filteredChallenges = useMemo(() => {
    if (!searchQuery.trim()) return challenges
    return challenges.filter(challenge => 
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [challenges, searchQuery])

  const handleViewClick = (challenge: Challenge) => {
    setViewingChallenge(challenge)
    setIsViewOverlayOpen(true)
  }

  const handleEditClick = (challenge: Challenge) => {
    setEditingChallenge(challenge)
    setIsEditOverlayOpen(true)
  }

  const handleViewOverlayClose = () => {
    setIsViewOverlayOpen(false)
    setViewingChallenge(null)
  }

  const handleEditOverlayClose = () => {
    setIsEditOverlayOpen(false)
    setEditingChallenge(null)
  }

  const handleOverlaySave = (updatedChallenge: any) => {
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
        createdAt: updatedChallenge.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      onUpdateChallenge(adminChallenge)
    }
    handleEditOverlayClose()
  }
  if (isInitialLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
    )
  }
  if (filteredChallenges.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">Nenhum challenge pendente</h3>
        <p>Todos os challenges foram revisados!</p>
      </div>
    )
  }
  return (
    <>
      <div className="space-y-4">
               {filteredChallenges.map(challenge => (
          <div
            key={challenge.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:border-border/60 transition-all duration-200 group w-full"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                  {challenge.title}
                </h3>
                <Badge className="bg-yellow-100 text-yellow-800">A ser aprovado</Badge>
                <Badge className={getDifficultyColor(challenge.difficulty)}>
                  {DIFFICULTY_OPTIONS.find(opt => opt.value === challenge.difficulty)?.label}
                </Badge>
                <Badge className="bg-gray-100 text-gray-800">{Array.isArray(challenge.category) ? challenge.category.join(', ') : challenge.category || "Algoritmos"}</Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-2 group-hover:text-foreground transition-colors duration-200">
                {challenge.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                <span>👤 Criado por: {challenge.mentor || 'Usuário'}</span>
                <span>📅 Criado: {challenge.createdAt}</span>
                <span>⚡ {challenge.functionName}</span>
              </div>
            </div>
                       <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewClick(challenge)}
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                title="Visualizar Challenge"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(challenge)}
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                title="Editar Challenge"
              >
                <Edit className="w-4 h-4" />
              </Button>
              {onCompare && (() => {
                let hasRevisions = false
                try {
                  const created = new Date(challenge.createdAt)
                  const updated = new Date(challenge.updatedAt)
                  if (!isNaN(created.getTime()) && !isNaN(updated.getTime())) {
                    hasRevisions = updated.getTime() > created.getTime()
                  }
                } catch {
                  hasRevisions = false
                }
                return hasRevisions ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCompare(challenge.id)}
                  className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                  title="Analisar Alterações"
                >
                  <GitCompare className="w-4 h-4" />
                </Button>
                ) : null
              })()}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApprove(challenge.id)}
                disabled={isApproving === challenge.id}
                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                title="Aprovar Challenge"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(challenge.id)}
                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                title="Rejeitar Challenge"
              >
                <XCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onArchive(challenge.id)}
                disabled={isArchiving === challenge.id}
                className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                title="Arquivar Challenge"
              >
                <Archive className="w-4 h-4" />
              </Button>
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
      </div>

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
          examples: [], // AdminChallenge não tem examples
          status: editingChallenge.status,
          mentor: editingChallenge.mentor,
          createdAt: editingChallenge.createdAt,
          updatedAt: editingChallenge.updatedAt
        }
        return (
          <EditChallengeOverlay
            challenge={challengeData}
            isOpen={isEditOverlayOpen}
            onClose={handleEditOverlayClose}
            onSave={handleOverlaySave}
          />
        )
      })()}

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
            onClose={handleViewOverlayClose}
          />
        )
      })()}
    </>
  )
}

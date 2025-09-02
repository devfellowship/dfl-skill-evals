import { useMemo } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Edit, Trash2, Eye, RefreshCw, Plus, Archive } from "lucide-react"
import { AdminChallenge as Challenge, DIFFICULTY_OPTIONS, STATUS_OPTIONS } from "@/types/admin-dashboard"

interface ChallengeListProps {
  challenges: Challenge[]
  isInitialLoading: boolean
  onEdit: (challenge: Challenge) => void
  onDelete: (id: string) => void
  onSendBackForReview: (id: string) => void
  onArchive: (id: string) => void
  isDeleting?: string | null
  isArchiving?: string | null
  onCreateNew: () => void
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
  onCreateNew
}: ChallengeListProps) {
  const getDifficultyColor = useMemo(() => (difficulty: string) => {
    return DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty)?.color || ""
  }, [])

  const getStatusColor = useMemo(() => (status: string) => {
    return STATUS_OPTIONS.find(opt => opt.value === status)?.color || ""
  }, [])

  const getStatusLabel = useMemo(() => (status: string) => {
    return STATUS_OPTIONS.find(opt => opt.value === status)?.label || status
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
      {challenges.map(challenge => (
        <div
          key={challenge.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:border-border/60 transition-all duration-200 group"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                {challenge.title}
              </h3>
              <Badge className={getDifficultyColor(challenge.difficulty)}>
                {DIFFICULTY_OPTIONS.find(opt => opt.value === challenge.difficulty)?.label}
              </Badge>
              <Badge className={getStatusColor(challenge.status)}>
                {getStatusLabel(challenge.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-2 group-hover:text-foreground transition-colors duration-200">
              {challenge.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors duration-200">
              <span>📁 {challenge.category}</span>
              <span>⚡ {challenge.functionName}</span>
              <span>📅 Criado: {challenge.createdAt}</span>
              {challenge.createdAt !== challenge.updatedAt && (
                <span>🔄 Atualizado: {challenge.updatedAt}</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(challenge)}
              className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/challenges/${challenge.slug}`, '_blank')}
              className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Eye className="w-4 h-4" />
            </Button>

            {/* Botão "Voltar para Análise" apenas para challenges aprovadas */}
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

            {/* Botão "Arquivar" apenas para challenges aprovadas */}
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
    </div>
  )
}

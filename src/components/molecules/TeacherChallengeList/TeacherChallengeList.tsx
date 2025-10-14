"use client"
import { useMemo } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Edit, Trash2, CheckCircle, Plus, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
interface TeacherChallenge {
  id: string
  title: string
  slug: string
  difficulty: string
  status: string
  category: string | string[]
  createdAt: string
  mentor?: string
  created_by?: string
}
interface TeacherChallengeListProps {
  challenges: TeacherChallenge[]
  onDelete: (id: string) => void
  onSendBackForReview?: (id: string) => void
  searchQuery?: string
}
export function TeacherChallengeList({ challenges, onDelete, onSendBackForReview, searchQuery = "" }: TeacherChallengeListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-600 transition-colors'
      case 'draft': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900 transition-colors'
      case 'to_approve': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900 transition-colors'
      case 'rejected': return 'bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900 transition-colors'
      case 'archived': return 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 transition-colors'
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 transition-colors'
    }
  }
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado'
      case 'draft': return 'Rascunho'
      case 'to_approve': return 'Aguardando Aprovação'
      case 'rejected': return 'Rejeitado'
      case 'archived': return 'Arquivado'
      default: return status
    }
  }
  const filteredChallenges = useMemo(() => {
    if (!searchQuery.trim()) return challenges
    return challenges.filter(challenge => 
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [challenges, searchQuery])
  if (filteredChallenges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">Você ainda não criou nenhum challenge</div>
        <Button asChild>
          <Link href="/teacher/create">
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Challenge
          </Link>
        </Button>
      </div>
    )
  }
  return (
    <div className="space-y-4">
             {filteredChallenges.map((challenge) => (
        <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:border-border/60 transition-all duration-200 group w-full">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">{challenge.title}</h3>
              <Badge className={getStatusColor(challenge.status)}>
                {getStatusLabel(challenge.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-2 group-hover:text-foreground transition-colors duration-200">
              {Array.isArray(challenge.category) ? challenge.category.join(', ') : challenge.category}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors duration-200">
              <span>👤 Criado por: {challenge.mentor || 'Usuário'}</span>
              <span>Dificuldade: {challenge.difficulty}</span>
              <span>Categoria: {Array.isArray(challenge.category) ? challenge.category.join(', ') : challenge.category}</span>
              <span>Criado: {new Date(challenge.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Link href={`/edit/${challenge.id}`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/teacher/challenge/${challenge.id}`, '_blank')}
              className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {challenge.status === 'to_approve' && (
              <Button
                variant="outline"
                size="sm"
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-200 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                title="Aguardando Aprovação"
                disabled
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
            {}
            {(challenge.status === 'draft' || challenge.status === 'rejected' || challenge.status === 'archived') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(challenge.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                title="Excluir challenge"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            {}
            {challenge.status === 'to_approve' && (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-gray-400 opacity-50 cursor-not-allowed"
                title="Não é possível excluir challenges pendentes de aprovação"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            {}
            {challenge.status === 'approved' && onSendBackForReview && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSendBackForReview(challenge.id)}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                title="Enviar de volta para análise (necessário para exclusão)"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {}
            {challenge.status === 'approved' && !onSendBackForReview && (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-gray-400 opacity-50 cursor-not-allowed"
                title="Challenges publicadas devem ser enviadas de volta para análise antes da exclusão"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
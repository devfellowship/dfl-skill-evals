"use client"

import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Edit, Eye, Trash2, CheckCircle, Plus } from "lucide-react"
import Link from "next/link"

interface TeacherChallenge {
  id: string
  title: string
  slug: string
  difficulty: string
  status: string
  category: string | string[]
  createdAt: string
}

interface TeacherChallengeListProps {
  challenges: TeacherChallenge[]
  onDelete: (id: string) => void
}

export function TeacherChallengeList({ challenges, onDelete }: TeacherChallengeListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'to_approve': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado'
      case 'draft': return 'Rascunho'
      case 'to_approve': return 'Aguardando Aprovação'
      case 'rejected': return 'Rejeitado'
      default: return status
    }
  }

  if (challenges.length === 0) {
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
      {challenges.map((challenge) => (
        <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 hover:border-border/60 transition-all duration-200 group">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">{challenge.title}</h3>
              <Badge className={getStatusColor(challenge.status)}>
                {getStatusLabel(challenge.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-2 group-hover:text-foreground transition-colors duration-200">
              {challenge.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors duration-200">
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
              <Link href={`/teacher/edit/${challenge.id}`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Link href={`/challenges/${challenge.slug}`} target="_blank">
                <Eye className="w-4 h-4" />
              </Link>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(challenge.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { RotateCcw, Trash2, Calendar, User, MessageSquare, Eye } from "lucide-react"
import { AdminChallenge } from "@/types/admin/admin-dashboard"
import { convertToBrazilianTime } from "@/lib/utils/timezone"
import { DIFFICULTY_OPTIONS, STATUS_OPTIONS } from "@/types/admin/admin-dashboard"
import { supabase } from "@/lib/supabase"
import { ViewChallengeOverlay } from "@/components/molecules/ViewChallengeOverlay/ViewChallengeOverlay"
interface DeletedChallengesListProps {
  challenges: AdminChallenge[]
  isInitialLoading: boolean
  onRestore: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onPermanentDelete: (id: string) => Promise<void>
  isRestoring: string | null
  isDeleting: string | null
  searchQuery: string
}
export function DeletedChallengesList({
  challenges,
  isInitialLoading,
  onRestore,
  onDelete,
  onPermanentDelete,
  isRestoring,
  isDeleting,
  searchQuery
}: DeletedChallengesListProps) {
  const [userNames, setUserNames] = useState<Record<string, string>>({})
  const [viewingChallenge, setViewingChallenge] = useState<AdminChallenge | null>(null)
  const [isViewOverlayOpen, setIsViewOverlayOpen] = useState(false)
  const filteredChallenges = challenges
  useEffect(() => {
    const fetchUserNames = async () => {
      const uniqueUserIds = [...new Set(challenges.map(c => c.deleted_by).filter(Boolean))]
      if (uniqueUserIds.length === 0) return
      try {
        const nameMap: Record<string, string> = {}
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', uniqueUserIds)
        if (!profilesError && profiles) {
          profiles.forEach(profile => {
            if (profile.full_name) {
              nameMap[profile.id] = profile.full_name
            }
          })
        }
        const { data: usersWithRoles, error: rolesError } = await supabase
          .from('users_with_roles')
          .select('id, name')
          .in('id', uniqueUserIds)
        if (!rolesError && usersWithRoles) {
          usersWithRoles.forEach(user => {
            if (user.name && !nameMap[user.id]) {
              nameMap[user.id] = user.name
            }
          })
        }
        uniqueUserIds.forEach(id => {
          if (!nameMap[id]) {
            nameMap[id] = 'Usuário'
          }
        })
        setUserNames(nameMap)
      } catch (error) {
        const fallbackMap: Record<string, string> = {}
        uniqueUserIds.forEach(id => {
          fallbackMap[id] = 'Usuário'
        })
        setUserNames(fallbackMap)
      }
    }
    fetchUserNames()
  }, [challenges])
  const getDifficultyColor = (difficulty: string) => {
    return DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty)?.color || "bg-gray-100 text-gray-800"
  }
  const getDifficultyLabel = (difficulty: string) => {
    return DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty)?.label || "Desconhecido"
  }
  const getStatusColor = (status: string) => {
    return STATUS_OPTIONS.find(opt => opt.value === status)?.color || "bg-gray-100 text-gray-800"
  }
  const getStatusLabel = (status: string) => {
    return STATUS_OPTIONS.find(opt => opt.value === status)?.label || "Desconhecido"
  }
  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Challenges Deletadas</h2>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Challenges Deletadas</h2>
          <p className="text-muted-foreground">
            {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''} deletada{filteredChallenges.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      {filteredChallenges.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
          <Trash2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma challenge deletada
          </h3>
          <p className="text-muted-foreground text-center">
            As challenges deletadas aparecerão aqui
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChallenges.map((challenge) => (
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
                    {getDifficultyLabel(challenge.difficulty)}
                  </Badge>
                  <Badge className={getStatusColor(challenge.status)}>
                    {getStatusLabel(challenge.status)}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-2 group-hover:text-foreground transition-colors duration-200">
                  {challenge.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                  <span>📁 {Array.isArray(challenge.category) ? challenge.category.join(', ') : challenge.category}</span>
                  <span>⚡ {challenge.functionName}</span>
                  <span>👤 Criado por: {challenge.mentor || 'Usuário'}</span>
                  <span>📅 Criado: {challenge.createdAt}</span>
                  {challenge.deleted_at && (
                    <span>🗑️ Deletada em: {convertToBrazilianTime(challenge.deleted_at)}</span>
                  )}
                  {challenge.deleted_by && (
                    <span>👤 Deletada por: {userNames[challenge.deleted_by] || challenge.deleted_by}</span>
                  )}
                </div>
                {}
                {challenge.deletion_reason && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Motivo:</span> {challenge.deletion_reason}
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setViewingChallenge(challenge)
                    setIsViewOverlayOpen(true)
                  }}
                  className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                  title="Visualizar challenge"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRestore(challenge.id)}
                  disabled={isRestoring === challenge.id}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                  title="Restaurar challenge"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPermanentDelete(challenge.id)}
                  disabled={isDeleting === challenge.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                  title="Excluir permanentemente"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

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
    </div>
  )
}

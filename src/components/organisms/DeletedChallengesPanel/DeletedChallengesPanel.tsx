import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/atoms/Button/Button'
import { Badge } from '@/components/atoms/Badge/Badge'
import { useSoftDeleteAudit, DeletedChallenge } from '@/hooks/useSoftDeleteAudit'
import { useUserRole } from '@/hooks/useUserRole'
import { convertToBrazilianTime } from '@/lib/utils/timezone'

interface DeletedChallengesPanelProps {
  className?: string
}

export const DeletedChallengesPanel: React.FC<DeletedChallengesPanelProps> = ({ 
  className = '' 
}) => {
  const { isAdmin } = useUserRole()
  const {
    deletedChallenges,
    fetchDeletedChallenges,
    restoreChallenge,
    permanentDeleteChallenge,
    isRestoring,
    getDeletionStats,
    getDeletionReasonStats
  } = useSoftDeleteAudit()

  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState<any[]>([])
  const [reasonStats, setReasonStats] = useState<any[]>([])

  useEffect(() => {
    if (isAdmin) {
      fetchDeletedChallenges()
    }
  }, [isAdmin, fetchDeletedChallenges])

  const handleShowStats = async () => {
    if (!showStats) {
      const [deletionStats, reasonStats] = await Promise.all([
        getDeletionStats(),
        getDeletionReasonStats()
      ])
      setStats(deletionStats)
      setReasonStats(reasonStats)
    }
    setShowStats(!showStats)
  }

  const handleRestore = async (challenge: DeletedChallenge) => {
    try {
      await restoreChallenge(challenge.id)
      await fetchDeletedChallenges() // Recarregar lista
    } catch (error) {
      console.error('Erro ao restaurar challenge:', error)
    }
  }

  const handlePermanentDelete = async (challenge: DeletedChallenge) => {
    try {
      await permanentDeleteChallenge(challenge.id)
      await fetchDeletedChallenges() // Recarregar lista
    } catch (error) {
      console.error('Erro ao deletar permanentemente:', error)
    }
  }

  if (!isAdmin) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Apenas administradores podem ver challenges deletadas
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Challenges Deletadas
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowStats}
            >
              {showStats ? 'Ocultar' : 'Ver'} Estatísticas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDeletedChallenges()}
            >
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {deletedChallenges.length} challenge(s) deletada(s)
          </p>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estatísticas por usuário */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exclusões por Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{stat.deleted_by_name}</span>
                    <Badge variant="secondary">{stat.total_deletions}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas por motivo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Motivos Mais Comuns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reasonStats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm truncate">{stat.deletion_reason}</span>
                    <Badge variant="outline">{stat.frequency}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de Challenges Deletadas */}
      <div className="space-y-4">
        {deletedChallenges.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">
                Nenhuma challenge deletada encontrada
              </p>
            </CardContent>
          </Card>
        ) : (
          deletedChallenges.map((challenge) => (
            <Card key={challenge.id} className="border-red-200 bg-red-50/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{challenge.title}</h3>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Motivo:</strong> {challenge.deletion_reason}
                      </p>
                      <p>
                        <strong>Deletado por:</strong> {challenge.profiles?.full_name || 'Usuário desconhecido'}
                      </p>
                      <p>
                        <strong>Data:</strong> {convertToBrazilianTime(challenge.deleted_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(challenge)}
                      disabled={isRestoring === challenge.id}
                    >
                      {isRestoring === challenge.id ? 'Restaurando...' : 'Restaurar'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handlePermanentDelete(challenge)}
                    >
                      Deletar Permanentemente
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

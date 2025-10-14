import React from "react"
import { AssessmentCard } from "@/components/organisms/AssessmentCard/AssessmentCard"
import type { Challenge } from "@/types/challenges/challenge"

interface AssessmentGridProps {
  assessments: Challenge[]
  isLoading?: boolean
}

export const AssessmentGrid: React.FC<AssessmentGridProps> = ({ 
  assessments, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!assessments || assessments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum assessment encontrado.</p>
      </div>
    )
  }

  // Separar challenges trending das normais
  // Ordenar challenges: trending primeiro (por trending_priority), depois os demais
  const sortedAssessments = [...assessments].sort((a, b) => {
    // Se ambos são trending, ordenar por trending_priority
    if (a.trending && b.trending) {
      return (a.trending_priority || 0) - (b.trending_priority || 0)
    }
    // Se apenas 'a' é trending, 'a' vem primeiro
    if (a.trending && !b.trending) return -1
    // Se apenas 'b' é trending, 'b' vem primeiro
    if (!a.trending && b.trending) return 1
    // Se nenhum é trending, manter ordem original
    return 0
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAssessments.map((assessment) => (
          <AssessmentCard 
            key={assessment.id} 
            assessment={assessment} 
            isTrending={assessment.trending || false}
          />
        ))}
      </div>
    </div>
  )
} 
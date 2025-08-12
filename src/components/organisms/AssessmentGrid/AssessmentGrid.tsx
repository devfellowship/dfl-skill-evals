import React from "react"
import { AssessmentCard } from "@/components/organisms/AssessmentCard/AssessmentCard"
import type { Challenge } from "@/types"

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assessments.map((assessment) => (
        <AssessmentCard key={assessment.id} assessment={assessment} />
      ))}
    </div>
  )
} 
import React from "react"
import { AssessmentCard } from "@/components/organisms/AssessmentCard/AssessmentCard"
import type { AdminChallenge } from "@/types/admin/admin-dashboard"
interface AssessmentGridProps {
  assessments: AdminChallenge[]
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
  const sortedAssessments = [...assessments].sort((a, b) => {
    if (a.trending && b.trending) {
      return (a.trending_priority || 0) - (b.trending_priority || 0)
    }
    if (a.trending && !b.trending) return -1
    if (!a.trending && b.trending) return 1
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
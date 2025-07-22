import * as React from "react"
import { Filter } from "lucide-react"
import { AssessmentCard } from "../AssessmentCard"
import { Button } from "../../atoms/Button/Button"
import type { Assessment, SearchFilters } from "@/types"
import { cn } from "@/lib/utils"

interface AssessmentGridProps {
  assessments: Assessment[]
  isLoading?: boolean
  emptyStateTitle?: string
  emptyStateDescription?: string
  onClearFilters?: () => void
  className?: string
}

export const AssessmentGrid = React.forwardRef<
  HTMLDivElement,
  AssessmentGridProps
>(({ 
  assessments, 
  isLoading = false,
  emptyStateTitle = "No assessments found",
  emptyStateDescription = "Try adjusting your search query or filters",
  onClearFilters,
  className,
  ...props 
}, ref) => {
  
  if (isLoading) {
    return (
      <div 
        ref={ref}
        className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}
        {...props}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-80 rounded-lg border bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (assessments.length === 0) {
    return (
      <div 
        ref={ref}
        className={cn("flex h-64 items-center justify-center", className)}
        {...props}
      >
        <div className="text-center">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">{emptyStateTitle}</h3>
          <p className="text-muted-foreground mb-4">{emptyStateDescription}</p>
          {onClearFilters && (
            <Button variant="outline" onClick={onClearFilters}>
              Clear all filters
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={ref}
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}
      {...props}
    >
      {assessments.map((assessment) => (
        <AssessmentCard key={assessment.id} assessment={assessment} />
      ))}
    </div>
  )
}) 
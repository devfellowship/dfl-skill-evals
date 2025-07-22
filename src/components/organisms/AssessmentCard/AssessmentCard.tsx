import * as React from "react"
import Link from "next/link"
import { Play, TrendingUp } from "lucide-react"
import { Card } from "../../atoms/Card/Card"
import { Button } from "../../atoms/Button/Button"
import { Badge } from "../../atoms/Badge/Badge"
import { DifficultyIndicator } from "../../molecules/DifficultyIndicator"
import { SkillTags } from "../../molecules/SkillTags"
import { AssessmentMeta } from "../../molecules/AssessmentMeta"
import type { Assessment } from "@/types"
import { cn } from "@/lib/utils"

interface AssessmentCardProps {
  assessment: Assessment
  className?: string
}

export const AssessmentCard = React.forwardRef<
  HTMLDivElement,
  AssessmentCardProps
>(({ assessment, className, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        "group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {assessment.title}
              </h3>
              {assessment.trending && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {assessment.description}
            </p>
          </div>
        </div>

        {/* Skills */}
        <SkillTags skills={assessment.skills} maxVisible={3} />
      </div>

      {/* Content */}
      <div className="px-6 pb-4 space-y-3">
        {/* Difficulty */}
        <DifficultyIndicator difficulty={assessment.difficulty} />
        
        {/* Meta information */}
        <AssessmentMeta
          duration={assessment.duration}
          participants={assessment.participants}
          rating={assessment.rating}
          problems={assessment.problems}
        />
      </div>

      {/* Footer */}
      <div className="p-6 pt-0">
        <Button
          asChild
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
        >
          <Link href={`/pre-assessment/${assessment.id}`}>
            <Play className="mr-2 h-4 w-4" />
            Start Assessment
          </Link>
        </Button>
      </div>
    </Card>
  )
}) 
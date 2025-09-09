import React from "react"
import Link from "next/link"
import { ArrowRight, Code, Star, Users } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Card, CardContent } from "@/components/ui/card"
import { DifficultyIndicator } from "@/components/molecules/DifficultyIndicator/DifficultyIndicator"
import { ChallengeImage } from "@/components/atoms/ChallengeImage/ChallengeImage"
import type { Challenge } from "@/types/challenges/challenge"
import { formatParticipants, generateSlug } from "@/lib/utils"

interface AssessmentCardProps {
  assessment: Challenge
  className?: string
}

export const AssessmentCard = React.forwardRef<
  HTMLDivElement,
  AssessmentCardProps
>(({ assessment, className, ...props }, ref) => {
  return (
    <Card className="group overflow-hidden border border-border/50 bg-background transition-all duration-200 hover:border-border hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
          <ChallengeImage
            imageUrl={assessment.image}
            category={[assessment.category]}
            difficulty={assessment.difficulty.toString()}
            title={assessment.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {assessment.trending && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                Trending
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {assessment.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {assessment.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-1">
            {assessment.skills.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {assessment.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{assessment.skills.length - 3} more
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <DifficultyIndicator difficulty={assessment.difficulty} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">

                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {formatParticipants(assessment.participants)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{assessment.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              asChild
              className="w-full"
              variant="outline"
            >
              <Link href={`/challenge/pre/${generateSlug(assessment.title)}`}>
                Start Challenge
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}) 
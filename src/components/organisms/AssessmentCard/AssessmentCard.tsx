import React from "react"
import { Link } from 'react-router-dom'
import { ArrowRight, Code, Star, Users } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Card, CardContent } from "@/components/ui/card"
import { DifficultyIndicator } from "@/components/molecules/DifficultyIndicator/DifficultyIndicator"
import { ChallengeImage } from "@/components/atoms/ChallengeImage/ChallengeImage"
import { ChallengeMenu } from "@/components/molecules/ChallengeMenu/ChallengeMenu"
import { useBasePath } from "@/contexts/BasePathContext"
import type { AdminChallenge } from "@/types/admin/admin-dashboard"
import { formatParticipants, generateSlug } from "@/lib/utils"
interface AssessmentCardProps {
  assessment: AdminChallenge
  className?: string
  isTrending?: boolean
}
export const AssessmentCard = React.forwardRef<
  HTMLDivElement,
  AssessmentCardProps
>(({ assessment, className, isTrending = false, ...props }, ref) => {
  const { buildRoute } = useBasePath()
  return (
    <Card className="group overflow-hidden border border-border/50 bg-background transition-all duration-200 hover:shadow-md hover:border-border">
      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
          <ChallengeImage
            imageUrl={assessment.image}
            category={assessment.category}
            difficulty={assessment.difficulty}
            title={assessment.title}
            className="w-full h-full object-cover"
          />
          <ChallengeMenu
            challengeId={assessment.id}
            isTrending={assessment.trending || false}
            challenge={{
              created_by: assessment.created_by,
              title: assessment.title
            }}
            onUpdate={() => {
              window.location.reload()
            }}
          />
          {isTrending && (
            <div className="absolute top-3 right-12 z-30">
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-semibold shadow-lg">
                🔥 Novidade
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
            {assessment.skills && assessment.skills.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {assessment.skills && assessment.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{assessment.skills.length - 3} mais
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <DifficultyIndicator difficulty={assessment.difficulty} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {formatParticipants(assessment.participants || 0)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{(assessment.rating || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <Button
              asChild
              className="w-full"
              variant="outline"
            >
              <Link to={buildRoute(`/challenge/pre/${generateSlug(assessment.title)}`)}>
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
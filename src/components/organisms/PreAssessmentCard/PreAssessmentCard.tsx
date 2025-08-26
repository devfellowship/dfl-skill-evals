"use client"

import { Clock, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Separator } from "@/components/ui/separator"
import { DifficultyIndicator } from "@/components/molecules/DifficultyIndicator"

interface Challenge {
  title: string
  description: string
  rating: number
  skills: string[]
  duration: string
  difficulty: number
}

interface PreAssessmentCardProps {
  assessment: Challenge
}

export function PreAssessmentCard({ assessment }: PreAssessmentCardProps) {
  return (
    <Card className="border-border/40">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{assessment.title}</CardTitle>
            <CardDescription className="mt-2">{assessment.description}</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{assessment.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h4 className="mb-2 font-medium">Skills Tested</h4>
          <div className="flex flex-wrap gap-2">
            {assessment.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Duration</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{assessment.duration}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Difficulty</span>
            <DifficultyIndicator difficulty={assessment.difficulty} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

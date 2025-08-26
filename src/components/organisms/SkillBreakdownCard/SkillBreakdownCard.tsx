"use client"

import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Progress } from "@/components/atoms/Progress/Progress"
import type { SkillBreakdown } from "@/types/results"

interface SkillBreakdownCardProps {
  skillBreakdown: SkillBreakdown[]
}

export function SkillBreakdownCard({ skillBreakdown }: SkillBreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Skill Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skillBreakdown.map((skill) => (
          <div key={skill.skill} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{skill.skill}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {skill.score}/{skill.maxScore}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {skill.improvement}
                </Badge>
              </div>
            </div>
            <Progress value={(skill.score / skill.maxScore) * 100} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

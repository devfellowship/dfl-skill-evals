"use client"

import { Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuickStatsCardProps {
  overallScore: number
  percentile: number
  totalTime: string
  problemsCompleted: number
  totalProblems: number
}

export function QuickStatsCard({ 
  overallScore, 
  percentile, 
  totalTime, 
  problemsCompleted, 
  totalProblems 
}: QuickStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{overallScore}</div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{percentile}%</div>
            <div className="text-sm text-muted-foreground">Percentile</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{totalTime}</div>
            <div className="text-sm text-muted-foreground">Time Taken</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">
              {problemsCompleted}/{totalProblems}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Clock, Target } from "lucide-react"

interface ScoreCircleProps {
  score: number
  percentile: number
  totalTime: string
  problemsCompleted: number
  totalProblems: number
}

export function ScoreCircle({ score, percentile, totalTime, problemsCompleted, totalProblems }: ScoreCircleProps) {
  return (
    <div className="text-center space-y-6">
      <div className="relative inline-block">
        <svg className="h-32 w-32 transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted-foreground/20"
          />
          <circle
            cx="60"
            cy="60"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - score / 100)}`}
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{score}</span>
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-2">Great Performance!</h2>
      <p className="text-lg text-muted-foreground mb-4">
        You scored better than {percentile}% of candidates
      </p>
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Completed in {totalTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          <span>{problemsCompleted}/{totalProblems} Problems</span>
        </div>
      </div>
    </div>
  )
}

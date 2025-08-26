"use client"

import { Code, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/atoms/Badge/Badge"
import type { ProblemResult } from "@/types/results"

interface ProblemAnalysisCardProps {
  problemResults: ProblemResult[]
}

export function ProblemAnalysisCard({ problemResults }: ProblemAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Problem-by-Problem Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {problemResults.map((problem, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-4">
                {problem.status === "completed" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <h4 className="font-medium">{problem.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{problem.difficulty}</span>
                    <span>{problem.timeSpent}</span>
                    <span>
                      {problem.testsPassed}/{problem.totalTests} tests passed
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{problem.score}%</div>
                <Badge
                  variant={problem.status === "completed" ? "secondary" : "destructive"}
                >
                  {problem.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

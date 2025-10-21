"use client"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Separator } from "@/components/ui/separator"
import { ProblemExamples } from "@/components/molecules/ProblemExamples/ProblemExamples"
import type { Problem } from "@/types/challenges/problems"
interface ProblemPanelProps {
  problem: Problem
}
export function ProblemPanel({ problem }: ProblemPanelProps) {
  return (
    <div className="w-[35%] min-w-[250px] border-r border-border/40 overflow-auto bg-background">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">{problem.title}</h2>
          <Badge variant="secondary" className="mb-4">
            {problem.difficulty}
          </Badge>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {problem.description}
          </p>
        </div>
        <Separator />
        <ProblemExamples examples={problem.examples} />
      </div>
    </div>
  )
}
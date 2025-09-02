"use client"

import { useChallenges } from "@/hooks/useChallenges"
import { mockResults } from "@/consts/results"
import { generateSlug } from "@/lib/utils"
import { ResultsHeader } from "@/components/organisms/ResultsHeader/ResultsHeader"
import { ResultsHero } from "@/components/molecules/ResultsHero/ResultsHero"
import { ScoreCircle } from "@/components/molecules/ScoreCircle/ScoreCircle"
import { SkillBreakdownCard } from "@/components/organisms/SkillBreakdownCard/SkillBreakdownCard"
import { QuickStatsCard } from "@/components/organisms/QuickStatsCard/QuickStatsCard"
import { ProblemAnalysisCard } from "@/components/organisms/ProblemAnalysisCard/ProblemAnalysisCard"
import { ResultsActions } from "@/components/molecules/ResultsActions/ResultsActions"
import { LoadingState } from "@/components/molecules/LoadingState/LoadingState"

export default function Results() {
  const { challenges } = useChallenges()
  const assessment = challenges.length > 0 ? challenges[0] : null
  const challengeSlug = assessment ? generateSlug(assessment.title) : 'challenge'
  
  if (!assessment) {
    return <LoadingState title="Carregando resultados..." message="Aguarde enquanto buscamos os dados do desafio." />
  }
  
  return (
    <div className="flex h-screen flex-col bg-background">
      <ResultsHeader challengeSlug={challengeSlug} />

      <div className="flex-1 overflow-auto p-6">
        <ResultsHero assessmentTitle={assessment.title} />
        
        <div className="mx-auto max-w-6xl space-y-8">
          <ScoreCircle
            score={mockResults.overallScore}
            percentile={mockResults.percentile}
            totalTime={mockResults.totalTime}
            problemsCompleted={mockResults.problemsCompleted}
            totalProblems={mockResults.totalProblems}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <SkillBreakdownCard skillBreakdown={mockResults.skillBreakdown} />
            <QuickStatsCard
              overallScore={mockResults.overallScore}
              percentile={mockResults.percentile}
              totalTime={mockResults.totalTime}
              problemsCompleted={mockResults.problemsCompleted}
              totalProblems={mockResults.totalProblems}
            />
          </div>

          <ProblemAnalysisCard problemResults={mockResults.problemResults} />

          <ResultsActions />
        </div>
      </div>
    </div>
  )
}

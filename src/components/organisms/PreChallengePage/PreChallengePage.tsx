"use client"
import { useState } from "react"
import { useChallenges } from "@/hooks/useChallenges"
import { generateSlug } from "@/lib/utils"
import { PreChallengeHeader } from "@/components/organisms/PreChallengeHeader/PreChallengeHeader"
import { PreChallengeHero } from "@/components/molecules/PreChallengeHero/PreChallengeHero"
import { PreAssessmentCard } from "@/components/organisms/PreAssessmentCard/PreAssessmentCard"
import { SystemCheckCard } from "@/components/organisms/SystemCheckCard/SystemCheckCard"
import { PreChallengeActions } from "@/components/molecules/PreChallengeActions/PreChallengeActions"
import { LoadingState } from "@/components/molecules/LoadingState/LoadingState"
import { NotFoundState } from "@/components/molecules/NotFoundState/NotFoundState"
import type { PreChallengePageProps } from "@/types/challenges/pre-challenge-page"
export function PreChallengePage({ challengeId }: PreChallengePageProps) {
  const { challenges, loading } = useChallenges()
  const [systemChecks] = useState({
    browser: true,
    internet: true,
  })
  const assessment = challenges.find(challenge => 
    generateSlug(challenge.title) === challengeId
  )
  if (loading) {
    return <LoadingState message="Buscando informações do desafio." />
  }
  if (!assessment) {
    return <NotFoundState title="Desafio não encontrado" message={`O desafio "${challengeId}" não foi encontrado.`} />
  }
  return (
    <div className="flex h-screen flex-col">
      <PreChallengeHeader />
      <div className="flex-1 overflow-auto p-6">
        <PreChallengeHero title={assessment.title} />
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <PreAssessmentCard assessment={assessment} />
            </div>
            <div className="lg:col-span-3">
              <div className="space-y-6">
                <SystemCheckCard systemChecks={systemChecks} />
                <PreChallengeActions challengeId={challengeId} systemChecks={systemChecks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

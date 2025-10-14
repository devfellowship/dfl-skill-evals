"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChallengePage } from "@/components/organisms/ChallengePage/ChallengePage"
import { PreChallengePage } from "@/components/organisms/PreChallengePage/PreChallengePage"
interface UnifiedChallengePageProps {
  mode: 'pre' | 'challenge'
  challengeId: string
}
export function UnifiedChallengePage({ mode, challengeId }: UnifiedChallengePageProps) {
  if (mode === 'pre') {
    return <PreChallengePage challengeId={challengeId} />
  }
  return <ChallengePage challengeId={challengeId} />
}
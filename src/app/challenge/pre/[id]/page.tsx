"use client"
import { use } from "react"
import { UnifiedChallengePage } from "@/components/organisms/UnifiedChallengePage/UnifiedChallengePage"
export default function PreChallengePageRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <UnifiedChallengePage mode="pre" challengeId={id} />
}
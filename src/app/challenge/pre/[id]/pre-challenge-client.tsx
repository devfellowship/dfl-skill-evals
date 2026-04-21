"use client"
import { useParams } from "next/navigation"
import { UnifiedChallengePage } from "@/components/organisms/UnifiedChallengePage/UnifiedChallengePage"
export default function PreChallengePageRoute() {
  const params = useParams()
  const id = params.id as string
  return <UnifiedChallengePage mode="pre" challengeId={id} />
}

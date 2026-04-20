"use client"
import { useParams } from "next/navigation"
import { UnifiedChallengePage } from "@/components/organisms/UnifiedChallengePage/UnifiedChallengePage"
export default function ChallengePageRoute() {
  const params = useParams()
  const id = params.id as string
  return <UnifiedChallengePage mode="challenge" challengeId={id} />
}

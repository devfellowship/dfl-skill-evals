"use client"

import { use } from "react"
import { PreChallengePage } from "@/components/organisms/PreChallengePage/PreChallengePage"

export default function PreChallengePageRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  return <PreChallengePage challengeId={id} />
}

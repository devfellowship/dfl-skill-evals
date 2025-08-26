"use client"

import { use } from "react"
import { ChallengePage } from "@/components/organisms/ChallengePage"

export default function ChallengePageRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  return <ChallengePage challengeId={id} />
}

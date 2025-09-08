"use client"

import { useParams } from "next/navigation"
import { ChallengeViewBySlug } from "@/components/organisms/ChallengeViewBySlug/ChallengeViewBySlug"

export default function ChallengePage() {
  const params = useParams()
  
  return <ChallengeViewBySlug slug={params.slug as string} />
}
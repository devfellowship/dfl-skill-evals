"use client"

import { useParams } from "next/navigation"
import { AdminChallengeView } from "@/components/organisms/AdminChallengeView/AdminChallengeView"

export default function AdminChallengePage() {
  const params = useParams()
  
  return <AdminChallengeView challengeId={params.id as string} />
}
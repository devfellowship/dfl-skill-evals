"use client"

import { useParams } from "next/navigation"
import { TeacherChallengeView } from "@/components/organisms/TeacherChallengeView"

export default function TeacherChallengePage() {
  const params = useParams()
  
  return <TeacherChallengeView challengeId={params.id as string} />
}


"use client"
import { useParams } from "next/navigation"
import { TeacherChallengeView } from "@/components/organisms/TeacherChallengeView/TeacherChallengeView"
export default function TeacherChallengeClient() {
  const params = useParams()
  return <TeacherChallengeView challengeId={params.id as string} />
}
"use client"

import { useParams } from "next/navigation"
import { EditChallenge } from "@/components/organisms/EditChallenge/EditChallenge"

export default function EditChallengePage() {
  const params = useParams()
  
  return <EditChallenge challengeId={params.id as string} />
}

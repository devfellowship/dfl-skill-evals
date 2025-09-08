"use client"

import { use } from "react"
import { ChallengeViewBySlug } from "@/components/organisms/ChallengeViewBySlug/ChallengeViewBySlug"

export default function ChallengeSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
  return <ChallengeViewBySlug slug={slug} />
}

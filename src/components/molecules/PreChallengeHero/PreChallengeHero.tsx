"use client"

import { UI_MESSAGES } from "@/consts/ui"

interface PreChallengeHeroProps {
  title: string
}

export function PreChallengeHero({ title }: PreChallengeHeroProps) {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-semibold text-primary mb-2">{title}</h1>
      <p className="text-muted-foreground">{UI_MESSAGES.PRE_CHALLENGE.SUBTITLE}</p>
    </div>
  )
}

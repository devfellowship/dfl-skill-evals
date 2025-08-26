"use client"

import { UI_MESSAGES } from "@/consts/ui"

interface ResultsHeroProps {
  assessmentTitle: string
}

export function ResultsHero({ assessmentTitle }: ResultsHeroProps) {
  return (
    <div className="text-center py-12 mb-12">
      <h1 className="text-2xl font-semibold text-primary mb-2">{UI_MESSAGES.RESULTS.TITLE}</h1>
      <p className="text-lg text-muted-foreground font-medium">{assessmentTitle}</p>
    </div>
  )
}

"use client"

import { Button } from "@/components/atoms/Button/Button"
import Link from "next/link"

interface PreChallengeActionsProps {
  challengeId: string
  systemChecks: {
    browser: boolean
    internet: boolean
  }
}

export function PreChallengeActions({ challengeId, systemChecks }: PreChallengeActionsProps) {
  const isSystemReady = systemChecks.browser && systemChecks.internet

  return (
    <div className="flex gap-4">
      <Button variant="outline" asChild className="flex-1 bg-transparent">
        <Link href="/">Cancel</Link>
      </Button>
      <Button
        asChild
        className="flex-1"
        disabled={!isSystemReady}
      >
        <Link href={`/challenge/${challengeId}`}>Begin Assessment</Link>
      </Button>
    </div>
  )
}

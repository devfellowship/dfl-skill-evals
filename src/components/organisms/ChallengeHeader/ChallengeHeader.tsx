"use client"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { ProfileSelector } from "@/components/molecules/ProfileSelector/ProfileSelector"

interface ChallengeHeaderProps {
  title: string
  backHref?: string
}

export function ChallengeHeader({ title, backHref = "/" }: ChallengeHeaderProps) {
  return (
    <header className="shrink-0 border-b border-border/40 bg-background/95 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">
            ← Voltar ao Dashboard
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <ProfileSelector />
      </div>
    </header>
  )
}
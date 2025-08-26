"use client"

import { RotateCcw, ArrowRight } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"
import Link from "next/link"

export function ResultsActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button size="lg" asChild>
        <Link href="/">
          <RotateCcw className="h-4 w-4 mr-2" />
          Take Another Assessment
        </Link>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <Link href="/">
          <ArrowRight className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  )
}

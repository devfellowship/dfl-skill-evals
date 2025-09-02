"use client"

import { Button } from "@/components/atoms/Button/Button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderButtonsProps {
  onCreateClick?: () => void
  createButtonText?: string
  createButtonHref?: string
  isSubmitting?: boolean
  showHomeButton?: boolean
  homeButtonText?: string
  homeButtonHref?: string
}

export function DashboardHeaderButtons({
  onCreateClick,
  createButtonText = "Novo Challenge",
  createButtonHref,
  isSubmitting = false,
  showHomeButton = true,
  homeButtonText = "Inicio",
  homeButtonHref = "/"
}: DashboardHeaderButtonsProps) {
  return (
    <div className="flex gap-4">
      {createButtonHref ? (
        <Button asChild>
          <Link href={createButtonHref}>
            <Plus className="h-4 w-4 mr-2" />
            {createButtonText}
          </Link>
        </Button>
      ) : (
        <Button 
          onClick={onCreateClick}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 font-medium text-lg"
          disabled={isSubmitting}
        >
          <Plus className="w-5 h-5 mr-2" />
          {isSubmitting ? "Salvando..." : createButtonText}
        </Button>
      )}
      
      {showHomeButton && (
        <Button variant="outline" asChild>
          <Link href={homeButtonHref}>
            {homeButtonText}
          </Link>
        </Button>
      )}
    </div>
  )
}

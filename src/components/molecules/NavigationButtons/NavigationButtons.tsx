"use client"

import { Button } from "@/components/atoms/Button/Button"
import Link from "next/link"

interface NavigationButtonsProps {
  isAdmin: boolean
  isTeacher: boolean
  canCreateChallenges: boolean
  roleLoading: boolean
}

export function NavigationButtons({ 
  isAdmin, 
  isTeacher, 
  canCreateChallenges, 
  roleLoading 
}: NavigationButtonsProps) {
  if (roleLoading) return null

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Button 
          asChild 
          variant="outline"
          className="px-4 py-2 text-sm"
        >
          <Link href="/admin">
            Admin
          </Link>
        </Button>
      )}

      {isTeacher && (
        <Button 
          asChild 
          variant="outline"
          className="px-4 py-2 text-sm"
        >
          <Link href="/admin">
            Mentor
          </Link>
        </Button>
      )}

      {canCreateChallenges && (
        <Button 
          asChild 
          variant="outline"
          className="px-4 py-2 text-sm"
        >
          <Link href="/teacher/create">
            Criar
          </Link>
        </Button>
      )}
    </div>
  )
}

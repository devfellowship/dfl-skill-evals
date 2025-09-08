"use client"

import { Button } from "@/components/atoms/Button/Button"
import { User, LogOut } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface UserMenuProps {
  user: any
  onSignOut: () => void
  getUserDisplayName: () => string
  getUserInitials: () => string
}

export function UserMenu({ user, onSignOut, getUserDisplayName, getUserInitials }: UserMenuProps) {
  if (!user) {
    return (
      <Button asChild variant="outline" className="flex items-center gap-2">
        <Link href="/login">
          <User className="w-4 h-4" />
          Login
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-3 px-3 py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserDisplayName()} />
            <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium">
              {getUserDisplayName()}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Meu Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSignOut} className="flex items-center gap-2 text-red-600">
          <LogOut className="w-4 h-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

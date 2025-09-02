"use client"

import { BrandLogo } from "@/components/atoms/Logo/Logo"
import { Button } from "@/components/atoms/Button/Button"
import { SearchButton } from "@/components/atoms/SearchButton/SearchButton"
import { MainSortButton } from "@/components/atoms/MainSortButton/MainSortButton"
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar/Avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import Link from "next/link"
import type { MainSortType } from "@/lib/main-challenge-sorter"

interface MainHeaderProps {
  searchQuery: string
  onSearch: (query: string) => void
  sortBy: MainSortType
  onSortChange: (sort: MainSortType) => void
  showNavigation?: boolean
}

export function MainHeader({ 
  searchQuery, 
  onSearch, 
  sortBy, 
  onSortChange, 
  showNavigation = true 
}: MainHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex items-center gap-3">
          <Link href="https://devfellowship.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <BrandLogo />
            <span className="text-foreground font-bold text-xl">Devfellowship</span>
          </Link>
        </div>
        {showNavigation && (
          <div className="flex-1 flex items-center justify-center gap-3">
            <Button 
              asChild 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 font-medium shadow-md min-w-[160px]"
            >
              <Link href="/admin">
                🚀 Admin
              </Link>
            </Button>

            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-medium shadow-md min-w-[160px]"
            >
              <Link href="/teacher">
                👨‍🏫 Teacher
              </Link>
            </Button>

            <Button 
              asChild 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium shadow-md min-w-[160px]"
            >
              <Link href="/teacher/create">
                ➕ Criar
              </Link>
            </Button>
          </div>
        )}
        <div className="flex items-center gap-4">
          <SearchButton 
            onSearch={onSearch}
            placeholder="Pesquisar challenges..."
            currentQuery={searchQuery}
          />

          <MainSortButton 
            currentSort={sortBy} 
            onSortChange={onSortChange}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

"use client"

import { useState, useMemo } from "react"
import { Award, Filter, BarChart3, LogOut, User, Home } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"
import { AssessmentGrid } from "@/components/organisms/AssessmentGrid/AssessmentGrid"
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar/Avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useChallenges } from "@/hooks/useChallenges"
import { useAuth } from "@/hooks/useAuth"
import type { SearchFilters } from "@/types"

export default function AssessmentLibrary() {
  const { challenges, loading: challengesLoading } = useChallenges()
  const { user, signOut } = useAuth()
  
  // Debug removido para performance
  
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    skills: [],
    difficulties: [],
    durations: [],
    categories: [],
    minRating: 0,
    trending: false,
  })
  const [sortBy, setSortBy] = useState("relevance")

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query)
    setSearchFilters(filters)
  }

  const filteredAssessments = useMemo(() => {
    let filtered = challenges

    if (searchQuery) {
      filtered = filtered.filter(
        (assessment) =>
          assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assessment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assessment.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (searchFilters.skills.length > 0) {
      filtered = filtered.filter((assessment) =>
        searchFilters.skills.some((skill: string) => assessment.skills.includes(skill))
      )
    }

    if (searchFilters.difficulties.length > 0) {
      filtered = filtered.filter((assessment) => searchFilters.difficulties.includes(assessment.difficulty.toString()))
    }

    if (searchFilters.durations.length > 0) {
      filtered = filtered.filter((assessment) => searchFilters.durations.includes(assessment.duration))
    }

    if (searchFilters.categories.length > 0) {
      filtered = filtered.filter((assessment) => searchFilters.categories.includes(assessment.category))
    }

    // Removendo filtros que não existem no Supabase por enquanto
    // if (searchFilters.minRating > 0) {
    //   filtered = filtered.filter((assessment) => assessment.rating >= searchFilters.minRating)
    // }

    // if (searchFilters.trending) {
    //   filtered = filtered.filter((assessment) => assessment.trending)
    // }

    return filtered
  }, [searchQuery, searchFilters])

  const sortedAssessments = useMemo(() => {
    const sorted = [...(filteredAssessments || [])]
    
    switch (sortBy) {
      // case "rating":
      //   return sorted.sort((a, b) => b.rating - a.rating)
      // case "popularity":
      //   return sorted.sort((a, b) => b.participants - a.participants)
      case "difficulty-asc":
        return sorted.sort((a, b) => a.difficulty - b.difficulty)
      case "difficulty-desc":
        return sorted.sort((a, b) => b.difficulty - a.difficulty)
      case "duration-asc":
        return sorted.sort((a, b) => {
          const getDurationMinutes = (duration: string) => parseInt(duration.split(" ")[0])
          return getDurationMinutes(a.duration) - getDurationMinutes(b.duration)
        })
      case "duration-desc":
        return sorted.sort((a, b) => {
          const getDurationMinutes = (duration: string) => parseInt(duration.split(" ")[0])
          return getDurationMinutes(b.duration) - getDurationMinutes(a.duration)
        })
      default:
        return sorted
    }
  }, [filteredAssessments, sortBy])

  const activeFiltersCount =
    searchFilters.skills.length +
    searchFilters.difficulties.length +
    searchFilters.durations.length +
    searchFilters.categories.length +
    (searchFilters.minRating > 0 ? 1 : 0) +
    (searchFilters.trending ? 1 : 0)

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="shrink-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user ? user.email?.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{user?.email || 'Usuário'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto p-6">
        <AssessmentGrid
          assessments={sortedAssessments as any}
          isLoading={challengesLoading}
        />
      </div>
    </div>
  )
}

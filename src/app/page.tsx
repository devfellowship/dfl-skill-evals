"use client"

import { useState, useMemo } from "react"
import { Award, Filter, BarChart3, LogOut, User } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar/Avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdvancedSearch } from "@/components/organisms/AdvancedSearch/AdvancedSearch"
import { AssessmentGrid } from "@/components/organisms/AssessmentGrid/AssessmentGrid"
import type { Assessment, SearchFilters } from "@/types"
import { mockAssessments, getDifficultyLabel } from "@/consts"

export default function AssessmentLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    skills: [],
    difficulties: [],
    durations: [],
    minRating: 0,
    categories: [],
    trending: false,
  })
  const [sortBy, setSortBy] = useState("relevance")

  const filteredAndSortedAssessments = useMemo(() => {
    const filtered = mockAssessments.filter((assessment) => {
      const matchesSearch =
        searchQuery === "" ||
        assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assessment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assessment.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        assessment.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSkills =
        searchFilters.skills.length === 0 || searchFilters.skills.some((skill) => assessment.skills.includes(skill))

      const matchesDifficulty =
        searchFilters.difficulties.length === 0 || searchFilters.difficulties.includes(assessment.difficulty.toString())

      const matchesDuration =
        searchFilters.durations.length === 0 || searchFilters.durations.includes(assessment.duration)

      const matchesRating = assessment.rating >= searchFilters.minRating

      const matchesCategory =
        searchFilters.categories.length === 0 || searchFilters.categories.includes(assessment.category)

      const matchesTrending = !searchFilters.trending || assessment.trending

      return (
        matchesSearch &&
        matchesSkills &&
        matchesDifficulty &&
        matchesDuration &&
        matchesRating &&
        matchesCategory &&
        matchesTrending
      )
    })

    // Sort results
    switch (sortBy) {
      case "difficulty-asc":
        filtered.sort((a, b) => a.difficulty - b.difficulty)
        break
      case "difficulty-desc":
        filtered.sort((a, b) => b.difficulty - a.difficulty)
        break
      case "duration-asc":
        filtered.sort((a, b) => Number.parseInt(a.duration) - Number.parseInt(b.duration))
        break
      case "duration-desc":
        filtered.sort((a, b) => Number.parseInt(b.duration) - Number.parseInt(a.duration))
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "popularity":
        filtered.sort((a, b) => b.participants - a.participants)
        break
      default: // relevance
        filtered.sort((a, b) => {
          if (a.trending && !b.trending) return -1
          if (!a.trending && b.trending) return 1
          return b.rating - a.rating
        })
    }

    return filtered
  }, [searchQuery, searchFilters, sortBy])

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query)
    setSearchFilters(filters)
  }

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
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h2 className="text-lg font-semibold">Skill Assessments</h2>
          </div>
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
      </header>
      <div className="shrink-0 border-b border-border/40 bg-background/50 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <AdvancedSearch
              onSearch={handleSearch}
              currentQuery={searchQuery}
              currentFilters={searchFilters}
              assessments={mockAssessments}
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="difficulty-asc">Easiest First</SelectItem>
                <SelectItem value="difficulty-desc">Hardest First</SelectItem>
                <SelectItem value="duration-asc">Shortest First</SelectItem>
                <SelectItem value="duration-desc">Longest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchFilters.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <button
                  onClick={() =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      skills: prev.skills.filter((s) => s !== skill),
                    }))
                  }
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            {searchFilters.categories.map((category) => (
              <Badge key={category} variant="secondary" className="gap-1">
                {category}
                <button
                  onClick={() =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      categories: prev.categories.filter((c) => c !== category),
                    }))
                  }
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            {searchFilters.difficulties.map((diff) => (
              <Badge key={diff} variant="secondary" className="gap-1">
                Difficulty {diff}
                <button
                  onClick={() =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      difficulties: prev.difficulties.filter((d) => d !== diff),
                    }))
                  }
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
            {searchFilters.trending && (
              <Badge variant="secondary" className="gap-1">
                Trending
                <button
                  onClick={() =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      trending: false,
                    }))
                  }
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        <AssessmentGrid
          assessments={filteredAndSortedAssessments}
          onClearFilters={() => {
            setSearchQuery("")
            setSearchFilters({
              skills: [],
              difficulties: [],
              durations: [],
              minRating: 0,
              categories: [],
              trending: false,
            })
          }}
        />
      </div>
    </div>
  )
}

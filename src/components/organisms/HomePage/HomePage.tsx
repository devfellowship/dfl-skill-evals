"use client"

import { useState, useMemo } from "react"
import { AssessmentGrid } from "@/components/organisms/AssessmentGrid/AssessmentGrid"
import { MainHeader } from "@/components/organisms/MainHeader/MainHeader"
import { useChallenges } from "@/hooks/useChallenges"
import { MainChallengeSorter, MainSortType } from "@/lib/main-challenge-sorter"
import type { SearchFilters } from "@/types/challenges/challenge"

export function HomePage() {
  const { challenges, loading: challengesLoading, error: challengesError } = useChallenges()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    skills: [],
    difficulties: [],
    categories: [],
    minRating: 0,
    trending: false,
  })
  const [sortBy, setSortBy] = useState<MainSortType>("order_index")

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query)
    setSearchFilters(filters)
  }

  const handleTitleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const filteredAssessments = useMemo(() => {
    if (!challenges.length) return []
    
    if (searchQuery) {
      return challenges.filter(
        (assessment) =>
          assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assessment.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return challenges
  }, [challenges, searchQuery])

  const sortedAssessments = useMemo(() => {
    return MainChallengeSorter.sortChallenges(filteredAssessments, sortBy)
  }, [filteredAssessments, sortBy])

  const activeFiltersCount = 
    searchFilters.skills.length +
    searchFilters.difficulties.length +
    searchFilters.categories.length +
    (searchFilters.minRating > 0 ? 1 : 0) +
    (searchFilters.trending ? 1 : 0)

  return (
    <div className="min-h-screen bg-background">
      <MainHeader 
        searchQuery={searchQuery}
        onSearch={handleTitleSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showNavigation={true}
      />
      
      <main className="p-6">
        {challengesError ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-destructive mb-2">Erro de Conexão</h2>
              <p className="text-muted-foreground">{challengesError}</p>
            </div>
          </div>
        ) : (
          <AssessmentGrid
            assessments={sortedAssessments as any}
            isLoading={challengesLoading}
          />
        )}
      </main>
    </div>
  )
}

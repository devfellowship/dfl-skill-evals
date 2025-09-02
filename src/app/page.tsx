"use client"

import { useState, useMemo } from "react"
import { Award, Filter, BarChart3, LogOut, User, Home } from "lucide-react"
import { Button } from "@/components/atoms/Button/Button"
import { AssessmentGrid } from "@/components/organisms/AssessmentGrid/AssessmentGrid"
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar/Avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useChallenges } from "@/hooks/useChallenges"
import type { SearchFilters } from "@/types"
import Link from "next/link"

export default function AssessmentLibrary() {
  const { challenges, loading: challengesLoading, error: challengesError } = useChallenges()
  
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
    if (!challenges.length) return []
    
    // Filtro simples apenas por título/descrição para performance
    if (searchQuery) {
      return challenges.filter(
        (assessment) =>
          assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assessment.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return challenges
  }, [challenges, searchQuery])

  // Simplificado para performance - retorna diretamente os filtrados
  const sortedAssessments = filteredAssessments

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Dashboard</h2>
            </div>
            {/* Botão Admin - Entre esquerda e centro */}
            <Button 
              asChild 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 font-medium shadow-md"
            >
              <Link href="/admin">
                🚀 Dashboard Admin
              </Link>
            </Button>
            {/* Botão Teacher - Entre esquerda e centro */}
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-medium shadow-md"
            >
              <Link href="/teacher">
                👨‍🏫 Dashboard Teacher
              </Link>
            </Button>
            {/* Botão Criar Challenge - Entre esquerda e centro */}
            <Button 
              asChild 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium shadow-md"
            >
              <Link href="/teacher/create">
                ➕ Criar Challenge
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      U
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Usuário</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Award className="mr-2 h-4 w-4" />
                  <span>Desenvolvedor</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-auto p-6">
        {challengesError ? (
          <div className="flex h-full items-center justify-center">
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
      </div>
    </div>
  )
}

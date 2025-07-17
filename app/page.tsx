"use client"

import { useState, useMemo } from "react"
import { Clock, Users, Star, Play, TrendingUp, Award, Filter, BarChart3, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdvancedSearch, type SearchFilters, type Assessment } from "@/components/advanced-search"
import Link from "next/link"

const assessments: Assessment[] = [
  {
    id: 1,
    title: "Full-Stack JavaScript Challenge",
    description:
      "Test your React, Node.js, and database skills with real-world scenarios including authentication, API design, and data modeling",
    skills: ["React", "Node.js", "MongoDB", "REST APIs"],
    difficulty: 4,
    duration: "90 min",
    problems: 5,
    participants: 1247,
    rating: 4.8,
    category: "Full-Stack",
    trending: true,
  },
  {
    id: 2,
    title: "Python Data Structures & Algorithms",
    description:
      "Core CS fundamentals with Python implementation, covering arrays, linked lists, trees, graphs, and dynamic programming",
    skills: ["Python", "Algorithms", "Data Structures"],
    difficulty: 3,
    duration: "60 min",
    problems: 4,
    participants: 2156,
    rating: 4.9,
    category: "Algorithms",
    trending: false,
  },
  {
    id: 3,
    title: "System Design Fundamentals",
    description:
      "Design scalable systems and architecture patterns including load balancing, caching, and microservices",
    skills: ["System Design", "Architecture", "Scalability"],
    difficulty: 5,
    duration: "120 min",
    problems: 3,
    participants: 892,
    rating: 4.7,
    category: "System Design",
    trending: true,
  },
  {
    id: 4,
    title: "Frontend React Mastery",
    description: "Advanced React patterns, hooks, performance optimization, and modern development practices",
    skills: ["React", "TypeScript", "Performance", "Testing"],
    difficulty: 4,
    duration: "75 min",
    problems: 4,
    participants: 1543,
    rating: 4.8,
    category: "Frontend",
    trending: false,
  },
  {
    id: 5,
    title: "Backend API Development",
    description:
      "Build robust APIs with authentication, database integration, error handling, and security best practices",
    skills: ["Node.js", "Express", "JWT", "PostgreSQL"],
    difficulty: 3,
    duration: "80 min",
    problems: 5,
    participants: 967,
    rating: 4.6,
    category: "Backend",
    trending: false,
  },
  {
    id: 6,
    title: "DevOps & Cloud Basics",
    description: "Docker containerization, CI/CD pipelines, AWS deployment, and infrastructure as code",
    skills: ["Docker", "AWS", "CI/CD", "Linux"],
    difficulty: 3,
    duration: "70 min",
    problems: 4,
    participants: 734,
    rating: 4.5,
    category: "DevOps",
    trending: false,
  },
]

const difficultyColors = {
  1: "bg-green-500",
  2: "bg-green-400",
  3: "bg-yellow-500",
  4: "bg-orange-500",
  5: "bg-red-500",
}

const difficultyLabels = {
  1: "Beginner",
  2: "Easy",
  3: "Medium",
  4: "Hard",
  5: "Expert",
}

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
    const filtered = assessments.filter((assessment) => {
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
      {/* Header */}
      <header className="shrink-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-end gap-4 px-6">
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

      {/* Search and Filters */}
      <div className="shrink-0 border-b border-border/40 bg-background/50 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <AdvancedSearch
              onSearch={handleSearch}
              currentQuery={searchQuery}
              currentFilters={searchFilters}
              assessments={assessments}
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
                {difficultyLabels[Number.parseInt(diff) as keyof typeof difficultyLabels]}
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

      {/* Assessment Grid */}
      <div className="flex-1 overflow-auto p-6">
        {filteredAndSortedAssessments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedAssessments.map((assessment) => (
              <Card
                key={assessment.id}
                className="group relative overflow-hidden border-border/40 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-1 line-clamp-2">{assessment.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {assessment.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Difficulty and Duration */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Difficulty:</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-2 w-2 rounded-full ${
                                level <= assessment.difficulty
                                  ? difficultyColors[assessment.difficulty as keyof typeof difficultyColors]
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {difficultyLabels[assessment.difficulty as keyof typeof difficultyLabels]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {assessment.duration}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  >
                    <Link href={`/pre-assessment/${assessment.id}`}>
                      <Play className="mr-2 h-4 w-4" />
                      Start Assessment
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No assessments found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search query or filters</p>
              <Button
                variant="outline"
                onClick={() => {
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
              >
                Clear all filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

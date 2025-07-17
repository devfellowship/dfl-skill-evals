"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter, X, Clock, Star, Users, TrendingUp } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void
  currentQuery: string
  currentFilters: SearchFilters
  assessments: Assessment[]
}

export interface SearchFilters {
  skills: string[]
  difficulties: string[]
  durations: string[]
  minRating: number
  categories: string[]
  trending: boolean
}

export interface Assessment {
  id: number
  title: string
  description: string
  skills: string[]
  difficulty: number
  duration: string
  problems: number
  participants: number
  rating: number
  category: string
  trending: boolean
}

const availableSkills = [
  "React",
  "Node.js",
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "Go",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Docker",
  "System Design",
  "Algorithms",
  "Data Structures",
  "Express",
  "JWT",
  "REST APIs",
  "GraphQL",
  "Redis",
]

const difficulties = [
  { value: "1", label: "Beginner", color: "bg-green-500" },
  { value: "2", label: "Easy", color: "bg-green-400" },
  { value: "3", label: "Medium", color: "bg-yellow-500" },
  { value: "4", label: "Hard", color: "bg-orange-500" },
  { value: "5", label: "Expert", color: "bg-red-500" },
]

const durations = ["30 min", "45 min", "60 min", "75 min", "90 min", "120 min"]
const categories = [
  "Full-Stack",
  "Frontend",
  "Backend",
  "Algorithms",
  "System Design",
  "DevOps",
  "Mobile",
  "Data Science",
]

export function AdvancedSearch({ onSearch, currentQuery, currentFilters, assessments }: AdvancedSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(currentQuery)
  const [filters, setFilters] = useState<SearchFilters>(currentFilters)
  const [searchResults, setSearchResults] = useState<Assessment[]>([])
  const [recentSearches, setRecentSearches] = useState([
    "React advanced patterns",
    "Python algorithms",
    "System design scalability",
    "Node.js backend API",
    "JavaScript fundamentals",
  ])

  // Real-time search as user types
  const performSearch = useCallback(
    (searchQuery: string, searchFilters: SearchFilters) => {
      const filtered = assessments.filter((assessment) => {
        const matchesText =
          searchQuery === "" ||
          assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assessment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assessment.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
          assessment.category.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesSkills =
          searchFilters.skills.length === 0 || searchFilters.skills.some((skill) => assessment.skills.includes(skill))

        const matchesDifficulty =
          searchFilters.difficulties.length === 0 ||
          searchFilters.difficulties.includes(assessment.difficulty.toString())

        const matchesDuration =
          searchFilters.durations.length === 0 || searchFilters.durations.includes(assessment.duration)

        const matchesRating = assessment.rating >= searchFilters.minRating

        const matchesCategory =
          searchFilters.categories.length === 0 || searchFilters.categories.includes(assessment.category)

        const matchesTrending = !searchFilters.trending || assessment.trending

        return (
          matchesText &&
          matchesSkills &&
          matchesDifficulty &&
          matchesDuration &&
          matchesRating &&
          matchesCategory &&
          matchesTrending
        )
      })

      setSearchResults(filtered.slice(0, 5)) // Show top 5 results
    },
    [assessments],
  )

  useEffect(() => {
    if (open) {
      performSearch(query, filters)
    }
  }, [query, filters, open, performSearch])

  const handleSkillToggle = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleDifficultyToggle = (difficulty: string) => {
    setFilters((prev) => ({
      ...prev,
      difficulties: prev.difficulties.includes(difficulty)
        ? prev.difficulties.filter((d) => d !== difficulty)
        : [...prev.difficulties, difficulty],
    }))
  }

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSearch = () => {
    onSearch(query, filters)
    if (query.trim()) {
      setRecentSearches((prev) => [query, ...prev.filter((s) => s !== query)].slice(0, 5))
    }
    setOpen(false)
  }

  const clearFilters = () => {
    setFilters({
      skills: [],
      difficulties: [],
      durations: [],
      minRating: 0,
      categories: [],
      trending: false,
    })
  }

  const activeFiltersCount =
    filters.skills.length +
    filters.difficulties.length +
    filters.durations.length +
    filters.categories.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.trending ? 1 : 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assessments, skills, or topics..."
            value={currentQuery}
            className="pl-10 pr-20 cursor-pointer"
            readOnly
          />
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="absolute right-12 top-1/2 -translate-y-1/2 h-5 px-1.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search & Filters
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Input & Results */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search assessments, skills, or topics..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>

              {/* Recent Searches */}
              {query === "" && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Recent Searches</h4>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <Button
                        key={search}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery(search)}
                        className="h-8 text-xs hover:bg-primary/10"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Search Results */}
              {query && searchResults.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Search Results ({searchResults.length} found)</h4>
                  <div className="space-y-2">
                    {searchResults.map((assessment) => (
                      <Card key={assessment.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-medium text-sm">{assessment.title}</h5>
                                {assessment.trending && (
                                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Trending
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {assessment.description}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {assessment.duration}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  {assessment.rating}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {assessment.participants}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filters Panel */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear ({activeFiltersCount})
                  </Button>
                )}
              </div>

              {/* Categories */}
              <div>
                <Label className="text-sm font-medium">Categories</Label>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Skills */}
              <div>
                <Label className="text-sm font-medium">Skills & Technologies</Label>
                <div className="mt-2 grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {availableSkills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${skill}`}
                        checked={filters.skills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <Label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Difficulty */}
              <div>
                <Label className="text-sm font-medium">Difficulty Level</Label>
                <div className="mt-2 space-y-2">
                  {difficulties.map((diff) => (
                    <div key={diff.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`diff-${diff.value}`}
                        checked={filters.difficulties.includes(diff.value)}
                        onCheckedChange={() => handleDifficultyToggle(diff.value)}
                      />
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${diff.color}`} />
                        <Label htmlFor={`diff-${diff.value}`} className="text-sm cursor-pointer">
                          {diff.label}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Rating */}
              <div>
                <Label className="text-sm font-medium">Minimum Rating</Label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[filters.minRating]}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, minRating: value[0] }))}
                    max={5}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span className="font-medium">{filters.minRating.toFixed(1)} stars</span>
                    <span>5</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Special Filters */}
              <div>
                <Label className="text-sm font-medium">Special Filters</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trending"
                      checked={filters.trending}
                      onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, trending: !!checked }))}
                    />
                    <Label htmlFor="trending" className="text-sm cursor-pointer flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Trending Only
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSearch} className="flex-1">
            Apply Search
            {activeFiltersCount > 0 && ` (${activeFiltersCount} filters)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

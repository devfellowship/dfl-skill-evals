"use client"

import { useState, useEffect, useCallback } from "react"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/atoms/Input/Input"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { Assessment, SearchFilters } from "@/types"
import { availableSkills, categories } from "@/consts"
import { getDifficultyLabel } from "@/lib/utils"

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void
  currentQuery: string
  currentFilters: SearchFilters
  assessments: Assessment[]
}

import { DIFFICULTY_OPTIONS as difficulties } from "@/consts/advanced-search"

export function AdvancedSearch({ onSearch, currentQuery, currentFilters, assessments }: AdvancedSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(currentQuery)
  const [filters, setFilters] = useState(currentFilters)
  const [searchResults, setSearchResults] = useState<Assessment[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const performSearch = useCallback(
    (term: string) => {
      if (!term.trim()) {
        setSearchResults([])
        return
      }

      const filtered = assessments.filter((assessment) =>
        assessment.title.toLowerCase().includes(term.toLowerCase()) ||
        assessment.description.toLowerCase().includes(term.toLowerCase()) ||
        assessment.skills.some((skill) => skill.toLowerCase().includes(term.toLowerCase())) ||
        assessment.category.toLowerCase().includes(term.toLowerCase())
      )

      setSearchResults(filtered.slice(0, 5))
    },
    [assessments]
  )

  useEffect(() => {
    performSearch(query)
  }, [query, performSearch])

  const handleSearchSubmit = () => {
    if (query.trim()) {
      setRecentSearches(prev => {
        const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5)
        localStorage.setItem('recentSearches', JSON.stringify(updated))
        return updated
      })
      onSearch(query, filters)
      setOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearchSubmit()
    }
  }

  const clearAllFilters = () => {
    setFilters({
      skills: [],
      difficulties: [],
      durations: [],
      categories: [],
      minRating: 0,
      trending: false,
    })
  }

  const activeFiltersCount = filters.skills.length + 
    filters.difficulties.length + 
    filters.durations.length + 
    filters.categories.length + 
    (filters.minRating > 0 ? 1 : 0) + 
    (filters.trending ? 1 : 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative w-full max-w-sm justify-start text-sm text-muted-foreground"
        >
          <Search className="mr-2 h-4 w-4" />
          Search assessments...
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-auto h-5 w-5 rounded-full p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="flex">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by title, description, skills, or category..."
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                  autoFocus
                />
                <Button onClick={handleSearchSubmit} disabled={!query.trim()}>
                  Search
                </Button>
              </div>

              {recentSearches.length > 0 && !query && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => {
                          setQuery(search)
                          onSearch(search, filters)
                          setOpen(false)
                        }}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.length > 0 && query && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Search Results</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {searchResults.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="p-2 rounded-md border cursor-pointer hover:bg-accent"
                        onClick={() => {
                          onSearch(assessment.title, filters)
                          setOpen(false)
                        }}
                      >
                        <div className="font-medium text-sm">{assessment.title}</div>
                        <div className="text-xs text-muted-foreground">{assessment.category}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-80 border-l bg-muted/30">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear all
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Categories</Label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              setFilters(prev => ({
                                ...prev,
                                categories: [...prev.categories, category]
                              }))
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                categories: prev.categories.filter(c => c !== category)
                              }))
                            }
                          }}
                        />
                        <label htmlFor={category} className="text-sm">{category}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Skills</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableSkills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={filters.skills.includes(skill)}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              setFilters(prev => ({
                                ...prev,
                                skills: [...prev.skills, skill]
                              }))
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                skills: prev.skills.filter(s => s !== skill)
                              }))
                            }
                          }}
                        />
                        <label htmlFor={skill} className="text-sm">{skill}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Difficulty</Label>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((difficulty) => (
                      <div key={difficulty} className="flex items-center space-x-2">
                        <Checkbox
                          id={`difficulty-${difficulty}`}
                          checked={filters.difficulties.includes(difficulty.toString())}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              setFilters(prev => ({
                                ...prev,
                                difficulties: [...prev.difficulties, difficulty.toString()]
                              }))
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                difficulties: prev.difficulties.filter(d => d !== difficulty.toString())
                              }))
                            }
                          }}
                        />
                        <label htmlFor={`difficulty-${difficulty}`} className="text-sm">
                          {getDifficultyLabel(difficulty)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Minimum Rating</Label>
                  <Slider
                    value={[filters.minRating]}
                    onValueChange={([value]: number[]) => 
                      setFilters(prev => ({ ...prev, minRating: value }))
                    }
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>{filters.minRating}</span>
                    <span>5</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trending"
                      checked={filters.trending}
                      onCheckedChange={(checked: boolean) => 
                        setFilters(prev => ({ ...prev, trending: !!checked }))
                      }
                    />
                    <label htmlFor="trending" className="text-sm">Show only trending</label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      onSearch(query, filters)
                      setOpen(false)
                    }}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

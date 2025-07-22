"use client"

import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/atoms/Input/Input"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface SearchDialogProps {
  onSearch: (query: string, filters: SearchFilters) => void
  currentQuery: string
  currentFilters: SearchFilters
}

export interface SearchFilters {
  skills: string[]
  difficulties: string[]
  durations: string[]
  minRating: number
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
]

const difficulties = [
  { value: "1", label: "Beginner" },
  { value: "2", label: "Easy" },
  { value: "3", label: "Medium" },
  { value: "4", label: "Hard" },
  { value: "5", label: "Expert" },
]

const durations = ["30 min", "45 min", "60 min", "75 min", "90 min", "120 min"]

export function SearchDialog({ onSearch, currentQuery, currentFilters }: SearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(currentQuery)
  const [filters, setFilters] = useState<SearchFilters>(currentFilters)
  const [recentSearches] = useState([
    "React advanced patterns",
    "Python algorithms",
    "System design",
    "Node.js backend",
  ])

  useEffect(() => {
    setQuery(currentQuery)
    setFilters(currentFilters)
  }, [currentQuery, currentFilters])

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

  const handleDurationToggle = (duration: string) => {
    setFilters((prev) => ({
      ...prev,
      durations: prev.durations.includes(duration)
        ? prev.durations.filter((d) => d !== duration)
        : [...prev.durations, duration],
    }))
  }

  const handleSearch = () => {
    onSearch(query, filters)
    setOpen(false)
  }

  const clearFilters = () => {
    setFilters({
      skills: [],
      difficulties: [],
      durations: [],
      minRating: 0,
    })
  }

  const activeFiltersCount =
    filters.skills.length + filters.difficulties.length + filters.durations.length + (filters.minRating > 0 ? 1 : 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assessments, skills, or topics..."
            value={currentQuery}
            className="pl-10 pr-12"
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search & Filter Assessments</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search assessments, skills, or topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                    className="h-8 text-xs"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Filters */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Filters</h4>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            {/* Skills Filter */}
            <div>
              <Label className="text-sm font-medium">Skills & Technologies</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {availableSkills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={filters.skills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill)}
                    />
                    <Label htmlFor={skill} className="text-sm cursor-pointer">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <Label className="text-sm font-medium">Difficulty Level</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {difficulties.map((diff) => (
                  <div key={diff.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={diff.value}
                      checked={filters.difficulties.includes(diff.value)}
                      onCheckedChange={() => handleDifficultyToggle(diff.value)}
                    />
                    <Label htmlFor={diff.value} className="text-sm cursor-pointer">
                      {diff.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <Label className="text-sm font-medium">Duration</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {durations.map((duration) => (
                  <div key={duration} className="flex items-center space-x-2">
                    <Checkbox
                      id={duration}
                      checked={filters.durations.includes(duration)}
                      onCheckedChange={() => handleDurationToggle(duration)}
                    />
                    <Label htmlFor={duration} className="text-sm cursor-pointer">
                      {duration}
                    </Label>
                  </div>
                ))}
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
            Search ({activeFiltersCount > 0 ? `${activeFiltersCount} filters` : "All"})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
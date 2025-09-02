"use client"

import { useState } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Input } from "@/components/atoms/Input/Input"
import { Search, X } from "lucide-react"

interface SearchButtonProps {
  onSearch: (query: string) => void
  placeholder?: string
  currentQuery?: string
}

export function SearchButton({ 
  onSearch, 
  placeholder = "Pesquisar por título...",
  currentQuery = ""
}: SearchButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState(currentQuery)

  const handleSearch = () => {
    onSearch(searchQuery.trim())
  }

  const handleClear = () => {
    setSearchQuery("")
    onSearch("")
    setIsExpanded(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      handleClear()
    }
  }

  const handleToggle = () => {
    if (isExpanded) {
      handleClear()
    } else {
      setIsExpanded(true)
    }
  }

  if (isExpanded) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onKeyDown={handleKeyPress}
            autoFocus
            className="w-64 pr-8"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSearch}
          disabled={!searchQuery.trim()}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={handleToggle}
      className="flex items-center gap-2"
    >
      <Search className="w-4 h-4" />
      Pesquisar
      {currentQuery && (
        <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">
          "{currentQuery}"
        </span>
      )}
    </Button>
  )
}

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
      <div className="relative w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onKeyDown={handleKeyPress}
            autoFocus
            className="w-full pl-10 pr-10 h-10 border-0 bg-transparent focus:ring-0 focus:outline-none text-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        <div className="absolute inset-0 -z-10 rounded-md border border-border bg-background" />
      </div>
    )
  }

  return (
    <div 
      onClick={handleToggle}
      className="flex items-center gap-3 w-full max-w-md px-4 py-2 text-muted-foreground border border-border rounded-md hover:border-muted-foreground/50 transition-colors cursor-pointer"
    >
      <Search className="w-4 h-4" />
      <span className="text-sm">
        {currentQuery ? `"${currentQuery}"` : placeholder}
      </span>
    </div>
  )
}

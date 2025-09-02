"use client"

import { useState } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar, Zap } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type SortOption = {
  value: string
  label: string
  icon: React.ReactNode
  direction: 'asc' | 'desc'
}

export interface SortButtonProps {
  currentSort: string
  onSortChange: (sort: string) => void
  className?: string
}

const SORT_OPTIONS: SortOption[] = [
  {
    value: 'created_desc',
    label: 'Mais Recentes',
    icon: <Calendar className="w-4 h-4" />,
    direction: 'desc'
  },
  {
    value: 'created_asc',
    label: 'Mais Antigos',
    icon: <Calendar className="w-4 h-4" />,
    direction: 'asc'
  },
  {
    value: 'difficulty_asc',
    label: 'Fácil → Difícil',
    icon: <Zap className="w-4 h-4" />,
    direction: 'asc'
  },
  {
    value: 'difficulty_desc',
    label: 'Difícil → Fácil',
    icon: <Zap className="w-4 h-4" />,
    direction: 'desc'
  },

  {
    value: 'title_asc',
    label: 'Título A-Z',
    icon: <ArrowUp className="w-4 h-4" />,
    direction: 'asc'
  },
  {
    value: 'title_desc',
    label: 'Título Z-A',
    icon: <ArrowDown className="w-4 h-4" />,
    direction: 'desc'
  }
]

export function SortButton({ currentSort, onSortChange, className = "" }: SortButtonProps) {
  const currentOption = SORT_OPTIONS.find(option => option.value === currentSort) || SORT_OPTIONS[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`gap-2 ${className}`}>
          {currentOption.icon}
          <span className="hidden sm:inline">{currentOption.label}</span>
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {option.icon}
            <span>{option.label}</span>
            {currentSort === option.value && (
              <Badge variant="secondary" className="ml-auto text-xs">
                Ativo
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

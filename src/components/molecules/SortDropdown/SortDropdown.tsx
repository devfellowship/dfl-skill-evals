"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@devfellowship/components';
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { ArrowUpDown, Hash, Calendar, Zap, Star, Users, ArrowUp, ArrowDown } from "lucide-react"

import type { MainSortType } from "@/lib/main-challenge-sorter"
const MAIN_SORT_OPTIONS = [
  {
    value: 'difficulty_asc' as MainSortType,
    label: 'Fácil → Difícil',
    icon: <Zap className="w-4 h-4" />
  },
  {
    value: 'difficulty_desc' as MainSortType,
    label: 'Difícil → Fácil',
    icon: <Zap className="w-4 h-4" />
  },
  {
    value: 'title_asc' as MainSortType,
    label: 'Título A-Z',
    icon: <ArrowUp className="w-4 h-4" />
  },
  {
    value: 'title_desc' as MainSortType,
    label: 'Título Z-A',
    icon: <ArrowDown className="w-4 h-4" />
  },
  {
    value: 'rating_desc' as MainSortType,
    label: 'Melhor Avaliados',
    icon: <Star className="w-4 h-4" />
  },
  {
    value: 'rating_asc' as MainSortType,
    label: 'Pior Avaliados',
    icon: <Star className="w-4 h-4" />
  },
  {
    value: 'participants_desc' as MainSortType,
    label: 'Mais Populares',
    icon: <Users className="w-4 h-4" />
  },
  {
    value: 'participants_asc' as MainSortType,
    label: 'Menos Populares',
    icon: <Users className="w-4 h-4" />
  }
]
interface SortDropdownProps {
  sortBy: MainSortType
  onSortChange: (sort: MainSortType) => void
}
export function SortDropdown({ sortBy, onSortChange }: SortDropdownProps) {
  const currentOption = MAIN_SORT_OPTIONS.find(option => option.value === sortBy) || MAIN_SORT_OPTIONS[0]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 px-3 py-2"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-sm">Ordem</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {MAIN_SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {option.icon}
            <span>{option.label}</span>
            {sortBy === option.value && (
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
"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@devfellowship/components';
import { Button } from "@/components/atoms/Button/Button"
import { Badge } from "@/components/atoms/Badge/Badge"
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar, Zap, Star, Users, Hash } from "lucide-react"

import { MainSortType } from "@/lib/main-challenge-sorter"
export interface MainSortButtonProps {
  currentSort: MainSortType
  onSortChange: (sort: MainSortType) => void
  className?: string
}
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
export function MainSortButton({ currentSort, onSortChange, className = "" }: MainSortButtonProps) {
  const currentOption = MAIN_SORT_OPTIONS.find(option => option.value === currentSort) || MAIN_SORT_OPTIONS[0]
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
        {MAIN_SORT_OPTIONS.map((option) => (
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
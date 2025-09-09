import type { MainSortType } from "@/lib/main-challenge-sorter"

export const MAIN_SORT_OPTIONS = [
  {
    value: 'order_index' as MainSortType,
    label: 'Ordem Padrão',
    iconName: 'Hash'
  },
  {
    value: 'created_desc' as MainSortType,
    label: 'Mais Recentes',
    iconName: 'Calendar'
  },
  {
    value: 'created_asc' as MainSortType,
    label: 'Mais Antigos',
    iconName: 'Calendar'
  },
  {
    value: 'difficulty_asc' as MainSortType,
    label: 'Fácil → Difícil',
    iconName: 'Zap'
  },
  {
    value: 'difficulty_desc' as MainSortType,
    label: 'Difícil → Fácil',
    iconName: 'Zap'
  },
  {
    value: 'title_asc' as MainSortType,
    label: 'Título A-Z',
    iconName: 'ArrowUp'
  },
  {
    value: 'title_desc' as MainSortType,
    label: 'Título Z-A',
    iconName: 'ArrowDown'
  },
  {
    value: 'rating_desc' as MainSortType,
    label: 'Melhor Avaliados',
    iconName: 'Star'
  },
  {
    value: 'rating_asc' as MainSortType,
    label: 'Pior Avaliados',
    iconName: 'Star'
  },
  {
    value: 'participants_desc' as MainSortType,
    label: 'Mais Populares',
    iconName: 'Users'
  }
]

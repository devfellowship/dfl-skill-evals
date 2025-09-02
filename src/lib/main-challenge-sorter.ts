import { Challenge } from '@/types'

export type MainSortType = 
  | 'order_index' 
  | 'created_desc' 
  | 'created_asc' 
  | 'difficulty_asc' 
  | 'difficulty_desc' 
  | 'title_asc' 
  | 'title_desc'
  | 'rating_desc'
  | 'rating_asc'
  | 'participants_desc'
  | 'participants_asc'

export class MainChallengeSorter {
  private static difficultyOrder = {
    1: 1, // easy
    2: 2, // medium  
    3: 3, // hard
    4: 4  // expert
  }

  static sortChallenges(challenges: Challenge[], sortType: MainSortType): Challenge[] {
    const sorted = [...challenges]

    switch (sortType) {
      case 'order_index':
        return sorted.sort((a, b) => a.id - b.id)

      case 'created_desc':
        return sorted.sort((a, b) => b.id - a.id)

      case 'created_asc':
        return sorted.sort((a, b) => a.id - b.id)

      case 'difficulty_asc':
        return sorted.sort((a, b) => {
          const difficultyA = this.difficultyOrder[a.difficulty as keyof typeof this.difficultyOrder] || 0
          const difficultyB = this.difficultyOrder[b.difficulty as keyof typeof this.difficultyOrder] || 0
          return difficultyA - difficultyB
        })

      case 'difficulty_desc':
        return sorted.sort((a, b) => {
          const difficultyA = this.difficultyOrder[a.difficulty as keyof typeof this.difficultyOrder] || 0
          const difficultyB = this.difficultyOrder[b.difficulty as keyof typeof this.difficultyOrder] || 0
          return difficultyB - difficultyA
        })



      case 'title_asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))

      case 'title_desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title, 'pt-BR'))

      case 'rating_desc':
        return sorted.sort((a, b) => b.rating - a.rating)

      case 'rating_asc':
        return sorted.sort((a, b) => a.rating - b.rating)

      case 'participants_desc':
        return sorted.sort((a, b) => b.participants - a.participants)

      case 'participants_asc':
        return sorted.sort((a, b) => a.participants - b.participants)

      default:
        return sorted
    }
  }

  static getSortLabel(sortType: MainSortType): string {
    const labels = {
      'order_index': 'Ordem Padrão',
      'created_desc': 'Mais Recentes',
      'created_asc': 'Mais Antigos',
      'difficulty_asc': 'Fácil → Difícil',
      'difficulty_desc': 'Difícil → Fácil',
      'title_asc': 'Título A-Z',
      'title_desc': 'Título Z-A',
      'rating_desc': 'Melhor Avaliados',
      'rating_asc': 'Pior Avaliados',
      'participants_desc': 'Mais Populares',
      'participants_asc': 'Menos Populares'
    }
    return labels[sortType] || 'Padrão'
  }
}

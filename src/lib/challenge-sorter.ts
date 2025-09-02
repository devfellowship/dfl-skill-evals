import { AdminChallenge } from '@/types/admin'

export type SortType = 
  | 'created_desc' 
  | 'created_asc' 
  | 'difficulty_asc' 
  | 'difficulty_desc' 
  | 'title_asc' 
  | 'title_desc'

export class ChallengeSorter {
  private static difficultyOrder = {
    'easy': 1,
    'medium': 2,
    'hard': 3,
    'expert': 4
  }

  static sortChallenges(challenges: AdminChallenge[], sortType: SortType): AdminChallenge[] {
    const sorted = [...challenges]

    switch (sortType) {
      case 'created_desc':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt.split('/').reverse().join('-'))
          const dateB = new Date(b.createdAt.split('/').reverse().join('-'))
          return dateB.getTime() - dateA.getTime()
        })

      case 'created_asc':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt.split('/').reverse().join('-'))
          const dateB = new Date(b.createdAt.split('/').reverse().join('-'))
          return dateA.getTime() - dateB.getTime()
        })

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

      default:
        return sorted
    }
  }

  static getSortLabel(sortType: SortType): string {
    const labels = {
      'created_desc': 'Mais Recentes',
      'created_asc': 'Mais Antigos',
      'difficulty_asc': 'Fácil → Difícil',
      'difficulty_desc': 'Difícil → Fácil',
      'title_asc': 'Título A-Z',
      'title_desc': 'Título Z-A'
    }
    return labels[sortType] || 'Padrão'
  }
}

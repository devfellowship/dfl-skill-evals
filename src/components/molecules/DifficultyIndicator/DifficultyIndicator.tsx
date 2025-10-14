"use client"

interface DifficultyIndicatorProps {
  difficulty: number | string
  maxLevel?: number
}

export function DifficultyIndicator({ difficulty, maxLevel = 4 }: DifficultyIndicatorProps) {
  const difficultyNumber = typeof difficulty === 'string' 
    ? getDifficultyNumber(difficulty) 
    : difficulty

  const getDifficultyColor = () => {
    // Até médio (1 e 2) = Azul
    if (difficultyNumber <= 2) {
      return "bg-blue-500 group-hover:bg-blue-600 group-hover:scale-110"
    }
    // Acima do médio (3 e 4) = Vermelho
    return "bg-red-500 group-hover:bg-red-600 group-hover:scale-110"
  }

  return (
    <div className="flex gap-1 group">
      {Array.from({ length: maxLevel }, (_, index) => {
        const level = index + 1
        const isActive = level <= difficultyNumber
        return (
          <div
            key={level}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              isActive 
                ? getDifficultyColor()
                : "bg-gray-300 group-hover:bg-gray-400"
            }`}
          />
        )
      })}
    </div>
  )
}

function getDifficultyNumber(difficulty: string): number {
  const difficultyMap: Record<string, number> = {
    'easy': 1,
    'medium': 2,
    'hard': 3,
    'expert': 4
  }
  return difficultyMap[difficulty.toLowerCase()] || 1
}
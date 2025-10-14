"use client"

interface DifficultyIndicatorProps {
  difficulty: number | string
  maxLevel?: number
}

export function DifficultyIndicator({ difficulty, maxLevel = 4 }: DifficultyIndicatorProps) {
  // Converter string para número se necessário
  const difficultyNumber = typeof difficulty === 'string' 
    ? getDifficultyNumber(difficulty) 
    : difficulty

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxLevel }, (_, index) => {
        const level = index + 1
        return (
          <div
            key={level}
            className={`h-2 w-2 rounded-full ${
              level <= difficultyNumber ? "bg-orange-500" : "bg-muted"
            }`}
          />
        )
      })}
    </div>
  )
}

// Função auxiliar para converter string de dificuldade para número
function getDifficultyNumber(difficulty: string): number {
  const difficultyMap: Record<string, number> = {
    'easy': 1,
    'medium': 2,
    'hard': 3,
    'expert': 4,
    'beginner': 1
  }
  return difficultyMap[difficulty.toLowerCase()] || 1
}
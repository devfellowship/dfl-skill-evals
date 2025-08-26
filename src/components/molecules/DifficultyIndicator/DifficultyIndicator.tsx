"use client"

interface DifficultyIndicatorProps {
  difficulty: number
  maxLevel?: number
}

export function DifficultyIndicator({ difficulty, maxLevel = 5 }: DifficultyIndicatorProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxLevel }, (_, index) => {
        const level = index + 1
        return (
          <div
            key={level}
            className={`h-2 w-2 rounded-full ${
              level <= difficulty ? "bg-orange-500" : "bg-muted"
            }`}
          />
        )
      })}
    </div>
  )
}
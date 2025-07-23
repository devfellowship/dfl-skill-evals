import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDifficultyLabel(level: number): string {
  switch (level) {
    case 1:
      return "Beginner"
    case 2:
      return "Easy"
    case 3:
      return "Medium"
    case 4:
      return "Hard"
    case 5:
      return "Expert"
    default:
      return "Unknown"
  }
}

export function formatParticipants(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}k`
  return `${(count / 1000000).toFixed(1)}M`
} 
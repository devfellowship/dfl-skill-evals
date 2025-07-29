import type { DifficultyLevel } from "@/types"
import { difficultyColors, difficultyLabels } from "./challenges"

/**
 * Retorna a cor correspondente ao nível de dificuldade
 */
export const getDifficultyColor = (difficulty: number): string => {
  return difficultyColors[difficulty as DifficultyLevel] || "bg-gray-500"
}

/**
 * Retorna o rótulo correspondente ao nível de dificuldade
 */
export const getDifficultyLabel = (difficulty: number): string => {
  return difficultyLabels[difficulty as DifficultyLevel] || "Unknown"
}

/**
 * Formata o número de participantes com pontos/vírgulas
 */
export const formatParticipants = (participants: number): string => {
  return participants.toLocaleString()
}

/**
 * Calcula a largura da barra de progresso baseada na avaliação
 */
export const getProgressFromRating = (rating: number): number => {
  return (rating / 5) * 100
} 
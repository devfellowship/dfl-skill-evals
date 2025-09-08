export const DEFAULT_CHALLENGE_IMAGES = {
  // Imagens por categoria - usando imagens locais
  'Array': '/images/challenges/defaults/array.svg',
  'String': '/images/challenges/defaults/string.svg',
  'Math': '/images/challenges/defaults/math.svg',
  'Searching': '/images/challenges/defaults/searching.svg',
  'Sorting': '/images/challenges/defaults/sorting.svg',
  'Dynamic Programming': '/images/challenges/defaults/dp.svg',
  'Graph': '/images/challenges/defaults/graph.svg',
  'Tree': '/images/challenges/defaults/tree.svg',
  'Hash Table': '/images/challenges/defaults/hash.svg',
  'Two Pointers': '/images/challenges/defaults/two-pointers.svg',
  'Greedy': '/images/challenges/defaults/greedy.svg',
  'Backtracking': '/images/challenges/defaults/backtracking.svg',
  'Stack': '/images/challenges/defaults/stack.svg',
  'Queue': '/images/challenges/defaults/queue.svg',
  'Linked List': '/images/challenges/defaults/linked-list.svg',
  'Binary Search': '/images/challenges/defaults/binary-search.svg',
  'Sliding Window': '/images/challenges/defaults/sliding-window.svg',
  'Bit Manipulation': '/images/challenges/defaults/bit-manipulation.svg',
  'Recursion': '/images/challenges/defaults/recursion.svg',
  'Design': '/images/challenges/defaults/design.svg',
  
  // Imagens por dificuldade
  'easy': '/images/challenges/defaults/easy.svg',
  'medium': '/images/challenges/defaults/medium.svg',
  'hard': '/images/challenges/defaults/hard.svg',
  
  // Imagem padrão genérica
  'default': '/images/challenges/defaults/algorithm.svg'
}

export const getDefaultImageForChallenge = (category?: string[], difficulty?: string): string => {
  // Primeiro, tenta encontrar por categoria
  if (category && category.length > 0) {
    const firstCategory = category[0]
    if (DEFAULT_CHALLENGE_IMAGES[firstCategory as keyof typeof DEFAULT_CHALLENGE_IMAGES]) {
      return DEFAULT_CHALLENGE_IMAGES[firstCategory as keyof typeof DEFAULT_CHALLENGE_IMAGES]
    }
  }
  
  // Se não encontrar por categoria, tenta por dificuldade
  if (difficulty && DEFAULT_CHALLENGE_IMAGES[difficulty as keyof typeof DEFAULT_CHALLENGE_IMAGES]) {
    return DEFAULT_CHALLENGE_IMAGES[difficulty as keyof typeof DEFAULT_CHALLENGE_IMAGES]
  }
  
  // Retorna imagem padrão
  return DEFAULT_CHALLENGE_IMAGES.default
}

export const CHALLENGE_IMAGE_CATEGORIES = [
  'Array', 'String', 'Math', 'Searching', 'Sorting', 'Dynamic Programming',
  'Graph', 'Tree', 'Hash Table', 'Two Pointers', 'Greedy', 'Backtracking',
  'Stack', 'Queue', 'Linked List', 'Binary Search', 'Sliding Window',
  'Bit Manipulation', 'Recursion', 'Design'
] as const

export type ChallengeImageCategory = typeof CHALLENGE_IMAGE_CATEGORIES[number]

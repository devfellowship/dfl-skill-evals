/**
 * Gera um slug único baseado no título da challenge
 * @param title - Título da challenge
 * @param existingSlugs - Array de slugs existentes para verificar duplicatas
 * @returns Slug único
 */
export function generateUniqueSlug(title: string, existingSlugs: string[] = []): string {
  // Converter para minúsculas e remover acentos
  let baseSlug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-+|-+$/g, '') // Remove hífens no início e fim
    .trim()

  // Garantir que o slug não esteja vazio
  if (!baseSlug) {
    baseSlug = 'challenge'
  }

  // Se o slug base já existe, adicionar um número
  let finalSlug = baseSlug
  let counter = 1
  
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`
    counter++
  }

  return finalSlug
}

/**
 * Verifica se um slug já existe
 * @param slug - Slug a ser verificado
 * @param existingSlugs - Array de slugs existentes
 * @returns true se o slug já existe
 */
export function slugExists(slug: string, existingSlugs: string[]): boolean {
  return existingSlugs.includes(slug)
}

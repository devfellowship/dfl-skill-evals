
export function generateUniqueSlug(title: string, existingSlugs: string[] = []): string {
  let baseSlug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/[^a-z0-9\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-') 
    .replace(/^-+|-+$/g, '') 
    .trim()
  if (!baseSlug) {
    baseSlug = 'challenge'
  }
  let finalSlug = baseSlug
  let counter = 1
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`
    counter++
  }
  return finalSlug
}
export function slugExists(slug: string, existingSlugs: string[]): boolean {
  return existingSlugs.includes(slug)
}
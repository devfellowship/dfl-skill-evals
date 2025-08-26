import { listAvailableLanguages } from '../judge0-config'

let languagesCache: any[] | null = null
let cacheExpiry: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export async function getCachedLanguages() {
  const now = Date.now()
  
  if (languagesCache && now < cacheExpiry) {
    return languagesCache
  }
  
  const languages = await listAvailableLanguages()
  languagesCache = languages
  cacheExpiry = now + CACHE_DURATION
  
  return languages
}

export function isLanguageSupported(languageId: number): boolean {
  const supportedLanguages = [63, 74, 71] // JavaScript, TypeScript, Python
  return supportedLanguages.includes(languageId)
}

export function getLanguageName(languageId: number): string {
  const languageMap: Record<number, string> = {
    63: 'JavaScript (Node.js 12.14.0)',
    74: 'TypeScript (3.7.4)',
    71: 'Python (3.8.1)'
  }
  return languageMap[languageId] || 'Unknown Language'
}

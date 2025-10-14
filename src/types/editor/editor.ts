import type { LANGUAGES, THEMES } from "@/consts/editor"
export type Language = typeof LANGUAGES[number]["value"]
export type Theme = typeof THEMES[number]["value"]
export interface EditorLanguage {
  value: Language
  label: string
  extension: string
}
export interface EditorTheme {
  value: Theme
  label: string
} 
export const LANGUAGES = [
  { value: "javascript", label: "JavaScript", extension: "js" },
  { value: "typescript", label: "TypeScript", extension: "ts" },
  { value: "python", label: "Python", extension: "py" },
] as const
export const THEMES = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "high-contrast", label: "High Contrast" },
] as const
export const EDITOR_CONFIG = {
  AUTO_SAVE_DELAY: 2000,
  DEFAULT_THEME: "dark",
} as const 
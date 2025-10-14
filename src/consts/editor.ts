export const LANGUAGES = [
  { value: "javascript", label: "JavaScript", extension: "js" },
  { value: "typescript", label: "TypeScript", extension: "ts" },
  { value: "python", label: "Python", extension: "py" },
  { value: "java", label: "Java", extension: "java" },
  { value: "cpp", label: "C++", extension: "cpp" },
  { value: "go", label: "Go", extension: "go" },
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
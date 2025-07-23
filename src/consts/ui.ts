export const MOBILE_BREAKPOINT = 768

export const ASSESSMENT_TIMER = {
  DURATION_MINUTES: 90,
  WARNING_THRESHOLD: 900, // 15 minutes in seconds
  CRITICAL_THRESHOLD: 300, // 5 minutes in seconds
} as const

export const EXECUTION_LIMITS = {
  TIMEOUT_MS: 5000,
  MAX_HINTS: 3,
} as const

export const BREADCRUMB_LABELS = {
  HOME: "Dashboard",
  PRE_ASSESSMENT: "Pre-Assessment", 
  ASSESSMENT: "Assessment",
  RESULTS: "Results",
} as const

export const UI_MESSAGES = {
  PRE_ASSESSMENT: {
    SUBTITLE: "Prepare-se para o seu assessment",
  },
  ASSESSMENT: {
    SUBTITLE: "Assessment em andamento",
  },
  RESULTS: {
    TITLE: "Assessment Results",
  },
  SYSTEM_CHECK: {
    BROWSER: "Browser Compatibility",
    INTERNET: "Internet Connection",
    TITLE: "System Check",
    DESCRIPTION: "Ensure your system is ready for the assessment",
  },
} as const

export const CODE_EXECUTION = {
  RETRY_MESSAGE: "Failed to execute code. Please try again.",
  COMPILATION_ERROR_TITLE: "Compilation Error",
} as const 
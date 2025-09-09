export const MOBILE_BREAKPOINT = 768

export const CHALLENGE_TIMER = {
  DURATION_MINUTES: 60,
  WARNING_THRESHOLD: 10 * 60,
  CRITICAL_THRESHOLD: 3 * 60,
}

export const PRE_CHALLENGE = "Pre-Challenge"
export const CHALLENGE = "Challenge"
export const PRE_CHALLENGE_ROUTE = "/challenge/pre"
export const CHALLENGE_ROUTE = "/challenge"

export const EXECUTION_LIMITS = {
  TIMEOUT_MS: 5000,
  MAX_HINTS: 3,
} as const

export const BREADCRUMB_LABELS = {
  HOME: "Dashboard",
  PRE_CHALLENGE: "Pre-Challenge", 
  CHALLENGE: "Challenge",
  RESULTS: "Results",
} as const

export const UI_MESSAGES = {
  PRE_CHALLENGE: {
    SUBTITLE: "Prepare-se para o seu challenge",
  },
  CHALLENGE: {
    SUBTITLE: "Challenge em andamento",
  },
  RESULTS: {
    TITLE: "Challenge Results",
  },
  SYSTEM_CHECK: {
    BROWSER: "Browser Compatibility",
    INTERNET: "Internet Connection",
    TITLE: "System Check",
    DESCRIPTION: "Ensure your system is ready for the challenge",
  },
} as const

export const CODE_EXECUTION = {
  RETRY_MESSAGE: "Failed to execute code. Please try again.",
  COMPILATION_ERROR_TITLE: "Compilation Error",
} as const 
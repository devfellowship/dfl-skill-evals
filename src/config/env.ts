const getEnv = (key: string): string => {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const ENV = {
  SUPABASE_URL: getEnv('VITE_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnv('VITE_SUPABASE_ANON_KEY'),
  JUDGE0_API_URL: import.meta.env.VITE_JUDGE0_API_URL || 'https://judge0.devfellowship.com',
} as const

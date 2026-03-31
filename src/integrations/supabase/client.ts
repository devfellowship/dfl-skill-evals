/**
 * src/integrations/supabase/client.ts
 *
 * Standard DFL Supabase client for dfl-skill-evals.
 * Provides the canonical typed client re-export at the DFL-standard path.
 *
 * Usage:
 *   import { supabase } from '@/integrations/supabase/client'
 *
 * For server-side (API routes), use:
 *   import { createClient } from '@/lib/supabase/server-clients'
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Typed Supabase client for client-side usage.
 * Do NOT use this in API routes — use server-clients.ts instead.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type { Database } from './types'

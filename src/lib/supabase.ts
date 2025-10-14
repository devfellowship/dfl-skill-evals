import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'admin' | 'mentor' | 'community_member'
export type ChallengeStatus = 'to_approve' | 'approved' | 'rejected' | 'archived'
export type DifficultyLevel = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert'
export type ProgrammingLanguage = 'typescript' | 'javascript' | 'python' | 'java' | 'cpp' | 'csharp'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          role: UserRole
          institution?: string
          bio?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          role?: UserRole
          institution?: string
          bio?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          role?: UserRole
          institution?: string
          bio?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description?: string
          created_by?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          created_by?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          created_by?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description?: string
          order_index: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string
          order_index?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string
          order_index?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          slug?: string
          description: string
          difficulty: number
          category: string
          skills: string[]
          problem_statement?: string
          function_name?: string
          initial_code?: string
          tags?: string[]
          is_active?: boolean
          created_at: string
          updated_at: string
          order_index?: number
          status: string
          constraints?: string[]
          is_public: boolean
          mentor: string
          max_score?: number
          created_by?: string
          image_url?: string
          trending?: boolean
          trending_priority?: number
        }
        Insert: {
          id?: string
          title: string
          slug?: string
          description: string
          difficulty?: number
          category?: string
          skills?: string[]
          problem_statement?: string
          function_name?: string
          initial_code?: string
          tags?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
          order_index?: number
          status?: string
          constraints?: string[]
          is_public?: boolean
          mentor?: string
          max_score?: number
          created_by?: string
          image_url?: string
          trending?: boolean
          trending_priority?: number
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          difficulty?: number
          category?: string
          skills?: string[]
          problem_statement?: string
          function_name?: string
          initial_code?: string
          tags?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
          order_index?: number
          status?: string
          constraints?: string[]
          is_public?: boolean
          mentor?: string
          max_score?: number
          created_by?: string
          image_url?: string
          trending?: boolean
          trending_priority?: number
        }
      }
      challenge_templates: {
        Row: {
          id: string
          challenge_id: string
          language: ProgrammingLanguage
          initial_code: string
          created_at: string
        }
        Insert: {
          id?: string
          challenge_id: string
          language: ProgrammingLanguage
          initial_code: string
          created_at?: string
        }
        Update: {
          id?: string
          challenge_id?: string
          language?: ProgrammingLanguage
          initial_code?: string
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          code: string
          language: ProgrammingLanguage
          status: string
          test_results: any
          compilation_error?: string
          runtime_error?: string
          execution_time?: number
          memory_used?: number
          score: number
          tests_passed: number
          total_tests: number
          attempts_count: number
          is_final_submission: boolean
          hints_used: number
          created_at: string
          completed_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          code: string
          language?: ProgrammingLanguage
          status?: string
          test_results?: any
          compilation_error?: string
          runtime_error?: string
          execution_time?: number
          memory_used?: number
          score?: number
          tests_passed?: number
          total_tests?: number
          attempts_count?: number
          is_final_submission?: boolean
          hints_used?: number
          created_at?: string
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          code?: string
          language?: ProgrammingLanguage
          status?: string
          test_results?: any
          compilation_error?: string
          runtime_error?: string
          execution_time?: number
          memory_used?: number
          score?: number
          tests_passed?: number
          total_tests?: number
          attempts_count?: number
          is_final_submission?: boolean
          hints_used?: number
          created_at?: string
          completed_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          completed_at?: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          completed_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
          completed_at?: string
          is_active?: boolean
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          status: string
          best_score: number
          total_attempts: number
          hints_used: number
          time_spent: number
          started_at?: string
          completed_at?: string
          last_attempt_at: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          status?: string
          best_score?: number
          total_attempts?: number
          hints_used?: number
          time_spent?: number
          started_at?: string
          completed_at?: string
          last_attempt_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          status?: string
          best_score?: number
          total_attempts?: number
          hints_used?: number
          time_spent?: number
          started_at?: string
          completed_at?: string
          last_attempt_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

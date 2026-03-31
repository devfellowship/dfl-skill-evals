/**
 * src/integrations/supabase/types.ts
 *
 * Canonical Supabase database type definitions for dfl-skill-evals.
 * Re-exports the Database interface from src/lib/supabase.ts and provides
 * convenience type helpers aligned with the DFL standard integration path.
 *
 * Schema ownership:
 *   - skill_evals: challenges, test_cases, evaluation_logs
 *   - public: profiles (read/write), users_with_roles (view)
 *   - apps: app_logs (write — audit logging)
 *
 * Generated with: npx supabase gen types typescript --schema skill_evals,public,apps
 *   --project-id yoojxnggaxcqtsyjdrdx > src/integrations/supabase/types.ts
 */

// ─── Domain Enums ────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'mentor' | 'community_member'
export type ChallengeStatus = 'to_approve' | 'approved' | 'rejected' | 'archived'
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert'
export type ProgrammingLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'csharp'

// ─── Database Interface ───────────────────────────────────────────────────────

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
          test_results: unknown
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
          test_results?: unknown
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
          test_results?: unknown
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
    Views: {
      users_with_roles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: UserRole
          is_active: boolean
        }
      }
    }
    Functions: {
      get_deletion_stats: {
        Args: Record<string, never>
        Returns: {
          total_deleted: number
          deleted_last_30_days: number
          deleted_last_7_days: number
        }[]
      }
    }
    Enums: {
      user_role: UserRole
      challenge_status: ChallengeStatus
      difficulty_level: DifficultyLevel
      programming_language: ProgrammingLanguage
    }
  }
  skill_evals: {
    Tables: {
      challenges: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          difficulty: DifficultyLevel
          language: ProgrammingLanguage
          starter_code: string
          solution_code?: string
          hints?: string[]
          status: ChallengeStatus
          created_by: string
          created_at: string
          updated_at: string
          deleted_at?: string
          deletion_reason?: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          difficulty: DifficultyLevel
          language: ProgrammingLanguage
          starter_code: string
          solution_code?: string
          hints?: string[]
          status?: ChallengeStatus
          created_by: string
          created_at?: string
          updated_at?: string
          deleted_at?: string
          deletion_reason?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          difficulty?: DifficultyLevel
          language?: ProgrammingLanguage
          starter_code?: string
          solution_code?: string
          hints?: string[]
          status?: ChallengeStatus
          created_by?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string
          deletion_reason?: string
        }
      }
      test_cases: {
        Row: {
          id: string
          challenge_id: string
          input: string
          expected_output: string
          is_hidden: boolean
          order_index: number
        }
        Insert: {
          id?: string
          challenge_id: string
          input: string
          expected_output: string
          is_hidden?: boolean
          order_index?: number
        }
        Update: {
          id?: string
          challenge_id?: string
          input?: string
          expected_output?: string
          is_hidden?: boolean
          order_index?: number
        }
      }
      evaluation_logs: {
        Row: {
          id: string
          challenge_id: string
          user_id: string
          code: string
          language: ProgrammingLanguage
          status: string
          result?: unknown
          execution_time_ms?: number
          created_at: string
        }
        Insert: {
          id?: string
          challenge_id: string
          user_id: string
          code: string
          language: ProgrammingLanguage
          status?: string
          result?: unknown
          execution_time_ms?: number
          created_at?: string
        }
        Update: {
          id?: string
          challenge_id?: string
          user_id?: string
          code?: string
          language?: ProgrammingLanguage
          status?: string
          result?: unknown
          execution_time_ms?: number
          created_at?: string
        }
      }
    }
    Functions: {
      get_deletion_stats: {
        Args: Record<string, never>
        Returns: {
          total_deleted: number
          deleted_last_30_days: number
          deleted_last_7_days: number
        }[]
      }
    }
  }
}

// ─── Convenience Type Helpers ─────────────────────────────────────────────────

export type Tables<
  S extends keyof Database,
  T extends keyof Database[S]['Tables']
> = Database[S]['Tables'][T] extends { Row: infer R } ? R : never

export type Inserts<
  S extends keyof Database,
  T extends keyof Database[S]['Tables']
> = Database[S]['Tables'][T] extends { Insert: infer I } ? I : never

export type Updates<
  S extends keyof Database,
  T extends keyof Database[S]['Tables']
> = Database[S]['Tables'][T] extends { Update: infer U } ? U : never

// Shorthand for public schema tables (most common usage)
export type PublicTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type SkillEvalsTables<T extends keyof Database['skill_evals']['Tables']> =
  Database['skill_evals']['Tables'][T]['Row']

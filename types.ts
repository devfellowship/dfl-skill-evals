export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  iam: {
    Tables: {
      roles: {
        Row: {
          context: string
          id: string
          level: number
        }
        Insert: {
          context?: string
          id: string
          level: number
        }
        Update: {
          context?: string
          id?: string
          level?: number
        }
        Relationships: []
      }
      tier_limits: {
        Row: {
          feature: string
          limit_value: number | null
          tier_id: string
        }
        Insert: {
          feature: string
          limit_value?: number | null
          tier_id: string
        }
        Update: {
          feature?: string
          limit_value?: number | null
          tier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tier_limits_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      tiers: {
        Row: {
          id: string
          level: number
        }
        Insert: {
          id: string
          level: number
        }
        Update: {
          id?: string
          level?: number
        }
        Relationships: []
      }
      user_app_roles: {
        Row: {
          app_slug: string
          role_id: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          app_slug: string
          role_id: string
          tenant_id: string
          user_id: string
        }
        Update: {
          app_slug?: string
          role_id?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_app_roles_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "vw_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_app_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role_id: string
          user_id: string
        }
        Insert: {
          role_id: string
          user_id: string
        }
        Update: {
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tiers: {
        Row: {
          tier_id: string
          user_id: string
        }
        Insert: {
          tier_id?: string
          user_id: string
        }
        Update: {
          tier_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tiers_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_app_roles: {
        Row: {
          app_slug: string | null
          id: string | null
          role_id: string | null
          role_level: number | null
          tenant_id: string | null
          tenant_name: string | null
          user_avatar_url: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_app_roles_tenant"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "vw_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_app_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_apps: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          is_visible: boolean | null
          name: string | null
          slug: string | null
          thumbnail_url: string | null
          users_count: number | null
        }
        Relationships: []
      }
      vw_dashboard_stats: {
        Row: {
          total_app_roles: number | null
          total_apps: number | null
          total_global_roles: number | null
          total_tenants: number | null
          total_user_tiers: number | null
        }
        Relationships: []
      }
      vw_role_distribution: {
        Row: {
          count: number | null
          role_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_tenants: {
        Row: {
          apps_count: number | null
          id: string | null
          name: string | null
          slug: string | null
          users_count: number | null
        }
        Relationships: []
      }
      vw_tier_distribution: {
        Row: {
          count: number | null
          tier_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tiers_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_user_tenants: {
        Row: {
          tenant_ids: string[] | null
          tenant_names: string[] | null
          user_id: string | null
        }
        Relationships: []
      }
      vw_users: {
        Row: {
          app_roles_count: number | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          global_level: number | null
          global_role: string | null
          id: string | null
          name: string | null
          tier_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["global_role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_access_course: {
        Args: { course_id_param: string; user_id_param?: string }
        Returns: boolean
      }
      can_access_lesson: {
        Args: { lesson_id_param: string; user_id_param?: string }
        Returns: boolean
      }
      can_view_app: {
        Args: { p_app_slug: string; p_tenant_id: string; p_user_id?: string }
        Returns: boolean
      }
      check_limit: {
        Args: { p_current_usage: number; p_feature: string; p_user_id?: string }
        Returns: boolean
      }
      default_tenant_id: { Args: never; Returns: string }
      get_app_level: {
        Args: { p_app_slug: string; p_tenant_id: string; p_user_id?: string }
        Returns: number
      }
      get_global_level: { Args: { p_user_id?: string }; Returns: number }
      get_limit: {
        Args: { p_feature: string; p_user_id?: string }
        Returns: number
      }
      get_my_role_level: { Args: never; Returns: number }
      get_tier_level: { Args: { p_user_id?: string }; Returns: number }
      get_user_permissions: { Args: { p_user_id?: string }; Returns: Json }
      get_user_tier: { Args: { p_user_id?: string }; Returns: string }
      has_app_role: {
        Args: {
          p_app_slug: string
          p_min_role: string
          p_tenant_id: string
          p_user_id?: string
        }
        Returns: boolean
      }
      has_tenant_access: {
        Args: { p_tenant_id: string; p_user_id?: string }
        Returns: boolean
      }
      is_app_admin: {
        Args: { p_app_slug: string; p_tenant_id: string; p_user_id?: string }
        Returns: boolean
      }
      is_global_admin: { Args: { p_user_id?: string }; Returns: boolean }
      is_member: { Args: { p_user_id?: string }; Returns: boolean }
      is_owner: {
        Args: { p_owner_id: string; p_user_id?: string }
        Returns: boolean
      }
      is_superadmin: { Args: { p_user_id?: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_schema: string | null
          entity_type: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_schema?: string | null
          entity_type?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_schema?: string | null
          entity_type?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      agent_prompts: {
        Row: {
          agent_name: string
          created_at: string
          id: number
          is_active: boolean | null
          prompt: string | null
          version: number | null
        }
        Insert: {
          agent_name: string
          created_at?: string
          id?: number
          is_active?: boolean | null
          prompt?: string | null
          version?: number | null
        }
        Update: {
          agent_name?: string
          created_at?: string
          id?: number
          is_active?: boolean | null
          prompt?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_prompts_agent_name_fkey"
            columns: ["agent_name"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["agent_name"]
          },
        ]
      }
      agents: {
        Row: {
          agent_name: string
          agent_url: string | null
          created_at: string
          id: number
        }
        Insert: {
          agent_name: string
          agent_url?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          agent_name?: string
          agent_url?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      business_units: {
        Row: {
          created_at: string
          id: string
          name: string
          profile_image_url: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          profile_image_url?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          profile_image_url?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      cmdb_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          kind: string
          metadata: Json | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          kind: string
          metadata?: Json | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          kind?: string
          metadata?: Json | null
          name?: string
        }
        Relationships: []
      }
      cmdb_kinds: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          kind: string
          metadata_schema: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          kind: string
          metadata_schema?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          kind?: string
          metadata_schema?: Json | null
        }
        Relationships: []
      }
      cmdb_links: {
        Row: {
          from_id: string
          metadata: Json | null
          rel: string
          to_id: string
        }
        Insert: {
          from_id: string
          metadata?: Json | null
          rel: string
          to_id: string
        }
        Update: {
          from_id?: string
          metadata?: Json | null
          rel?: string
          to_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cmdb_links_from_id_fkey"
            columns: ["from_id"]
            isOneToOne: false
            referencedRelation: "cmdb_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmdb_links_to_id_fkey"
            columns: ["to_id"]
            isOneToOne: false
            referencedRelation: "cmdb_items"
            referencedColumns: ["id"]
          },
        ]
      }
      concepts: {
        Row: {
          created_at: string
          definition: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          definition?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          definition?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      design_template_elements: {
        Row: {
          created_at: string
          id: string
          props: Json | null
          template_id: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          props?: Json | null
          template_id: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          props?: Json | null
          template_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_template_elements_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "design_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      design_template_renders: {
        Row: {
          created_at: string
          design_template_id: string
          height: number | null
          id: string
          output_url: string | null
          render_params: Json
          user_id: string | null
          width: number | null
        }
        Insert: {
          created_at?: string
          design_template_id: string
          height?: number | null
          id?: string
          output_url?: string | null
          render_params: Json
          user_id?: string | null
          width?: number | null
        }
        Update: {
          created_at?: string
          design_template_id?: string
          height?: number | null
          id?: string
          output_url?: string | null
          render_params?: Json
          user_id?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "design_template_renders_design_template_id_fkey"
            columns: ["design_template_id"]
            isOneToOne: false
            referencedRelation: "design_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      design_templates: {
        Row: {
          background_color: string | null
          created_at: string
          description: string | null
          height: number
          id: string
          json_schema: Json | null
          name: string
          owner_id: string
          thumbnail: string | null
          updated_at: string
          width: number
        }
        Insert: {
          background_color?: string | null
          created_at?: string
          description?: string | null
          height: number
          id?: string
          json_schema?: Json | null
          name: string
          owner_id: string
          thumbnail?: string | null
          updated_at?: string
          width: number
        }
        Update: {
          background_color?: string | null
          created_at?: string
          description?: string | null
          height?: number
          id?: string
          json_schema?: Json | null
          name?: string
          owner_id?: string
          thumbnail?: string | null
          updated_at?: string
          width?: number
        }
        Relationships: []
      }
      developer_profiles: {
        Row: {
          analise_completa: string | null
          areas_to_explore: string[] | null
          confidence_level: string | null
          created_at: string | null
          current_difficulty_level: string | null
          databases: string[] | null
          devops_tools: string[] | null
          experience_years: string | null
          id: string
          linguagens: string[] | null
          main_technologies: string[] | null
          melhorias: string | null
          message_count: number | null
          nivel: string | null
          pontuacao_total: number | null
          profile_id: string | null
          projetos_resumo: string | null
          raw_profile_data: Json | null
          session_id: string
          stack_principal: string | null
          strengths: string[] | null
          updated_at: string | null
        }
        Insert: {
          analise_completa?: string | null
          areas_to_explore?: string[] | null
          confidence_level?: string | null
          created_at?: string | null
          current_difficulty_level?: string | null
          databases?: string[] | null
          devops_tools?: string[] | null
          experience_years?: string | null
          id?: string
          linguagens?: string[] | null
          main_technologies?: string[] | null
          melhorias?: string | null
          message_count?: number | null
          nivel?: string | null
          pontuacao_total?: number | null
          profile_id?: string | null
          projetos_resumo?: string | null
          raw_profile_data?: Json | null
          session_id: string
          stack_principal?: string | null
          strengths?: string[] | null
          updated_at?: string | null
        }
        Update: {
          analise_completa?: string | null
          areas_to_explore?: string[] | null
          confidence_level?: string | null
          created_at?: string | null
          current_difficulty_level?: string | null
          databases?: string[] | null
          devops_tools?: string[] | null
          experience_years?: string | null
          id?: string
          linguagens?: string[] | null
          main_technologies?: string[] | null
          melhorias?: string | null
          message_count?: number | null
          nivel?: string | null
          pontuacao_total?: number | null
          profile_id?: string | null
          projetos_resumo?: string | null
          raw_profile_data?: Json | null
          session_id?: string
          stack_principal?: string | null
          strengths?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "developer_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diagram_projects: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          github_repo: string | null
          id: string
          name: string
          updated_at: string | null
          work_project_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          github_repo?: string | null
          id?: string
          name: string
          updated_at?: string | null
          work_project_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          github_repo?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          work_project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagram_projects_work_project_id_fkey"
            columns: ["work_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      diagram_versions: {
        Row: {
          commit_message: string | null
          created_at: string | null
          created_by: string | null
          diagram_id: string
          edges: Json
          id: string
          nodes: Json
          version_number: number
        }
        Insert: {
          commit_message?: string | null
          created_at?: string | null
          created_by?: string | null
          diagram_id: string
          edges: Json
          id?: string
          nodes: Json
          version_number: number
        }
        Update: {
          commit_message?: string | null
          created_at?: string | null
          created_by?: string | null
          diagram_id?: string
          edges?: Json
          id?: string
          nodes?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "diagram_versions_diagram_id_fkey"
            columns: ["diagram_id"]
            isOneToOne: false
            referencedRelation: "diagrams"
            referencedColumns: ["id"]
          },
        ]
      }
      diagrams: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          edges: Json
          github_path: string | null
          github_repo: string | null
          github_sha: string | null
          id: string
          last_synced_at: string | null
          name: string
          nodes: Json
          project_id: string | null
          type: string
          updated_at: string | null
          viewport: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          edges?: Json
          github_path?: string | null
          github_repo?: string | null
          github_sha?: string | null
          id?: string
          last_synced_at?: string | null
          name: string
          nodes?: Json
          project_id?: string | null
          type: string
          updated_at?: string | null
          viewport?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          edges?: Json
          github_path?: string | null
          github_repo?: string | null
          github_sha?: string | null
          id?: string
          last_synced_at?: string | null
          name?: string
          nodes?: Json
          project_id?: string | null
          type?: string
          updated_at?: string | null
          viewport?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_diagrams_diagram_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "diagram_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      discord_email_verifications: {
        Row: {
          code: string
          confirmed: boolean
          created_at: string | null
          discord_user_id: string
          email: string
          expires_at: string
          id: string
          type: string
        }
        Insert: {
          code: string
          confirmed?: boolean
          created_at?: string | null
          discord_user_id: string
          email: string
          expires_at: string
          id?: string
          type: string
        }
        Update: {
          code?: string
          confirmed?: boolean
          created_at?: string | null
          discord_user_id?: string
          email?: string
          expires_at?: string
          id?: string
          type?: string
        }
        Relationships: []
      }
      discord_roles: {
        Row: {
          category: string | null
          created_at: string | null
          display_name: string | null
          key: string
          role_id: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          display_name?: string | null
          key: string
          role_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          display_name?: string | null
          key?: string
          role_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      entity_transactions: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          transaction_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          transaction_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transaction_summary"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "entity_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      expertise_areas: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      feature_ideas: {
        Row: {
          created_at: string | null
          created_by: string
          description: string
          id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description: string
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_ideas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_votes: {
        Row: {
          created_at: string | null
          feature_id: string
          id: string
          user_id: string
          vote_type: number
        }
        Insert: {
          created_at?: string | null
          feature_id: string
          id?: string
          user_id: string
          vote_type: number
        }
        Update: {
          created_at?: string | null
          feature_id?: string
          id?: string
          user_id?: string
          vote_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "feature_votes_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_votes_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_ideas_with_votes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      github_links: {
        Row: {
          created_at: string
          dfl_user_id: string
          github_login: string
          github_user_id: number
          id: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          dfl_user_id: string
          github_login: string
          github_user_id: number
          id?: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          dfl_user_id?: string
          github_login?: string
          github_user_id?: number
          id?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      kudos: {
        Row: {
          amount: number
          created_at: string
          dimension_id: string
          from_member_id: string
          id: string
          message: string | null
          to_member_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          dimension_id: string
          from_member_id: string
          id?: string
          message?: string | null
          to_member_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          dimension_id?: string
          from_member_id?: string
          id?: string
          message?: string | null
          to_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kudos_dimension_id_fkey"
            columns: ["dimension_id"]
            isOneToOne: false
            referencedRelation: "kudos_dimensions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kudos_from_member_id_fkey"
            columns: ["from_member_id"]
            isOneToOne: false
            referencedRelation: "member_with_user_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kudos_from_member_id_fkey"
            columns: ["from_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kudos_from_member_id_fkey"
            columns: ["from_member_id"]
            isOneToOne: false
            referencedRelation: "transaction_summary"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "kudos_to_member_id_fkey"
            columns: ["to_member_id"]
            isOneToOne: false
            referencedRelation: "member_with_user_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kudos_to_member_id_fkey"
            columns: ["to_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kudos_to_member_id_fkey"
            columns: ["to_member_id"]
            isOneToOne: false
            referencedRelation: "transaction_summary"
            referencedColumns: ["member_id"]
          },
        ]
      }
      kudos_dimensions: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          created_at: string
          file_path: string
          folder: string | null
          height: number | null
          id: string
          mime_type: string
          name: string
          owner_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          file_path: string
          folder?: string | null
          height?: number | null
          id?: string
          mime_type: string
          name: string
          owner_id: string
          width?: number | null
        }
        Update: {
          created_at?: string
          file_path?: string
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string
          name?: string
          owner_id?: string
          width?: number | null
        }
        Relationships: []
      }
      media_items_tags: {
        Row: {
          created_at: string
          media_id: string
          media_tag_id: string
        }
        Insert: {
          created_at?: string
          media_id: string
          media_tag_id: string
        }
        Update: {
          created_at?: string
          media_id?: string
          media_tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_items_tags_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_tags_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_with_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_items_tags_media_tag_id_fkey"
            columns: ["media_tag_id"]
            isOneToOne: false
            referencedRelation: "media_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      media_tags: {
        Row: {
          created_at: string
          id: string
          kind: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          name?: string
        }
        Relationships: []
      }
      member_concepts: {
        Row: {
          concept_id: string
          created_at: string
          level: Database["public"]["Enums"]["member_level"]
          member_id: string
        }
        Insert: {
          concept_id: string
          created_at?: string
          level: Database["public"]["Enums"]["member_level"]
          member_id: string
        }
        Update: {
          concept_id?: string
          created_at?: string
          level?: Database["public"]["Enums"]["member_level"]
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_concepts_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_concepts_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_with_user_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_concepts_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_concepts_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "transaction_summary"
            referencedColumns: ["member_id"]
          },
        ]
      }
      member_expertise: {
        Row: {
          created_at: string
          expertise_id: string
          level: Database["public"]["Enums"]["member_level"]
          member_id: string
        }
        Insert: {
          created_at?: string
          expertise_id: string
          level: Database["public"]["Enums"]["member_level"]
          member_id: string
        }
        Update: {
          created_at?: string
          expertise_id?: string
          level?: Database["public"]["Enums"]["member_level"]
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_expertise_expertise_id_fkey"
            columns: ["expertise_id"]
            isOneToOne: false
            referencedRelation: "expertise_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_expertise_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_with_user_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_expertise_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_expertise_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "transaction_summary"
            referencedColumns: ["member_id"]
          },
        ]
      }
      member_phases: {
        Row: {
          description: string | null
          id: string
          label: string
          order_index: number
        }
        Insert: {
          description?: string | null
          id: string
          label: string
          order_index: number
        }
        Update: {
          description?: string | null
          id?: string
          label?: string
          order_index?: number
        }
        Relationships: []
      }
      member_tools: {
        Row: {
          created_at: string
          level: Database["public"]["Enums"]["member_level"]
          member_id: string
          tool_id: string
        }
        Insert: {
          created_at?: string
          level: Database["public"]["Enums"]["member_level"]
          member_id: string
          tool_id: string
        }
        Update: {
          created_at?: string
          level?: Database["public"]["Enums"]["member_level"]
          member_id?: string
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_tools_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_with_user_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_tools_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_tools_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "transaction_summary"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "member_tools_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          city: string | null
          cnpj: string | null
          corporate_email: string | null
          cpf: string | null
          created_at: string
          id: string
          invited_by_id: string | null
          is_active: boolean
          kudos_budget: number | null
          name: string
          personal_data: Json | null
          personal_email: string | null
          phase_id: string | null
          phase_updated_at: string | null
          phone: string | null
          state: string | null
          tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city?: string | null
          cnpj?: string | null
          corporate_email?: string | null
          cpf?: string | null
          created_at?: string
          id?: string
          invited_by_id?: string | null
          is_active?: boolean
          kudos_budget?: number | null
          name: string
          personal_data?: Json | null
          personal_email?: string | null
          phase_id?: string | null
          phase_updated_at?: string | null
          phone?: string | null
          state?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string | null
          cnpj?: string | null
          corporate_email?: string | null
          cpf?: string | null
          created_at?: string
          id?: string
          invited_by_id?: string | null
          is_active?: boolean
          kudos_budget?: number | null
          name?: string
          personal_data?: Json | null
          personal_email?: string | null
          phase_id?: string | null
          phase_updated_at?: string | null
          phone?: string | null
          state?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_invited_by_id_fkey"
            columns: ["invited_by_id"]
            isOneToOne: false
            referencedRelation: "member_with_user_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_invited_by_id_fkey"
            columns: ["invited_by_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_invited_by_id_fkey"
            columns: ["invited_by_id"]
            isOneToOne: false
            referencedRelation: "transaction_summary"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "members_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "member_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          discord_user_id: string | null
          email: string
          email_discord: string | null
          id: string
          name: string
          onboarding_completed_at: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          discord_user_id?: string | null
          email: string
          email_discord?: string | null
          id: string
          name: string
          onboarding_completed_at?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          discord_user_id?: string | null
          email?: string
          email_discord?: string | null
          id?: string
          name?: string
          onboarding_completed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      secret_value: {
        Row: {
          decrypted_secret: string | null
        }
        Insert: {
          decrypted_secret?: string | null
        }
        Update: {
          decrypted_secret?: string | null
        }
        Relationships: []
      }
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["tool_type"]
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          type?: Database["public"]["Enums"]["tool_type"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["tool_type"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          target_id: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          target_id: string
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          target_id?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "member_with_user_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "transaction_summary"
            referencedColumns: ["member_id"]
          },
        ]
      }
      world_objects: {
        Row: {
          id: string
          metadata: Json | null
          sprite_key: string | null
          updated_at: string | null
          x: number | null
          y: number | null
          z: number | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          sprite_key?: string | null
          updated_at?: string | null
          x?: number | null
          y?: number | null
          z?: number | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          sprite_key?: string | null
          updated_at?: string | null
          x?: number | null
          y?: number | null
          z?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      business_unit_stats: {
        Row: {
          epics_count: number | null
          id: string | null
          members_count: number | null
          name: string | null
          profile_image_url: string | null
          tasks_count: number | null
          tasks_last_month: number | null
          total_points: number | null
        }
        Relationships: []
      }
      feature_ideas_with_votes: {
        Row: {
          created_at: string | null
          created_by: string | null
          creator_avatar: string | null
          creator_name: string | null
          description: string | null
          downvotes: number | null
          id: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          upvotes: number | null
          user_vote: number | null
          vote_score: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_ideas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_with_tags: {
        Row: {
          created_at: string | null
          file_path: string | null
          height: number | null
          id: string | null
          mime_type: string | null
          name: string | null
          owner_id: string | null
          tag_ids: string[] | null
          tag_kinds: string[] | null
          tag_names: string[] | null
          width: number | null
        }
        Relationships: []
      }
      member_with_user_details: {
        Row: {
          city: string | null
          cnpj: string | null
          corporate_email: string | null
          cpf: string | null
          created_at: string | null
          id: string | null
          last_sign_in_at: string | null
          name: string | null
          personal_data: Json | null
          personal_email: string | null
          phase_id: string | null
          phase_updated_at: string | null
          phone: string | null
          state: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
          user_roles: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "members_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "member_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          business_unit_id: string | null
          created_at: string | null
          id: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          business_unit_id?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          business_unit_id?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      task_details: {
        Row: {
          business_unit_name: string | null
          created_at: string | null
          delivery_name: string | null
          description: string | null
          epic_name: string | null
          id: string | null
          name: string | null
          owner_name: string | null
          points: number | null
          status:
            | "to_do"
            | "in_progress"
            | "dev_completed"
            | "done"
            | "no_longer_needed"
            | "blocked"
            | null
          status_timestamps: Json | null
          updated_at: string | null
        }
        Relationships: []
      }
      transaction_summary: {
        Row: {
          created_at: string | null
          delivery_count: number | null
          member_id: string | null
          member_name: string | null
          pix_key: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          total_price: number | null
          transaction_id: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      user_roles_with_counts: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          name: string | null
          user_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_tag_to_media: {
        Args: { media_uuid: string; tag_kind?: string; tag_name: string }
        Returns: string
      }
      bulk_update_lesson_labels: { Args: { payload: Json }; Returns: Json }
      create_chart_of_accounts: {
        Args: { p_tenant_id: string }
        Returns: undefined
      }
      create_tasks_for_owner: {
        Args: { owner_id_param: string; task_names: string[] }
        Returns: undefined
      }
      exec_sql: { Args: { sql: string }; Returns: Json }
      get_courses_with_metrics: {
        Args: never
        Returns: {
          about: string
          author_id: string
          completed_lessons_count: number
          created_at: string
          description: string
          id: string
          lessons_count: number
          position_order: number
          thumbnail: string
          title: string
          total_duration_seconds: number
          updated_at: string
        }[]
      }
      get_member_kudos_budget: {
        Args: { member_uuid: string }
        Returns: number
      }
      get_members_by_name: {
        Args: { member_name: string }
        Returns: {
          id: string
          name: string
        }[]
      }
      get_my_iam_role: {
        Args: never
        Returns: {
          level: number
          role_id: string
        }[]
      }
      get_next_version_number: {
        Args: { p_diagram_id: string }
        Returns: number
      }
      get_user_id_by_email: { Args: { p_email: string }; Returns: string }
      get_user_media_with_tags: {
        Args: { user_uuid: string }
        Returns: {
          created_at: string
          file_path: string
          folder: string
          height: number
          id: string
          mime_type: string
          name: string
          tags: Json
          width: number
        }[]
      }
      get_users_by_ids: {
        Args: { user_ids: string[] }
        Returns: {
          email: string
          id: string
        }[]
      }
      iam_delete_user_app_role: {
        Args: { p_app_slug: string; p_tenant_id: string; p_user_id: string }
        Returns: undefined
      }
      iam_delete_user_role: { Args: { p_user_id: string }; Returns: undefined }
      iam_insert_user_role: {
        Args: { p_role_id: string; p_user_id: string }
        Returns: undefined
      }
      iam_upsert_user_app_role: {
        Args: {
          p_app_slug: string
          p_role_id: string
          p_tenant_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      iam_upsert_user_tier: {
        Args: { p_tier_id: string; p_user_id: string }
        Returns: undefined
      }
      is_superadmin:
        | { Args: never; Returns: boolean }
        | { Args: { user_id: string }; Returns: boolean }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      search_lessons: {
        Args: {
          concept_ids?: string[]
          expertise_ids?: string[]
          limit_count?: number
          query_text?: string
          rating_min?: number
          sort_by?: string
          tool_ids?: string[]
        }
        Returns: {
          author_id: string
          author_name: string
          concepts: Json
          course_id: string
          course_thumbnail: string
          course_title: string
          description: string
          duration: number
          expertises: Json
          id: string
          lesson_views: number
          positive_ratings: number
          rating_percentage: number
          search_rank: number
          title: string
          tools: Json
          total_completions: number
          total_ratings: number
          total_views: number
          updated_at: string
        }[]
      }
      time_to_seconds: { Args: { time_str: string }; Returns: number }
    }
    Enums: {
      document_type:
        | "markdown"
        | "bpmn"
        | "mermaid"
        | "pdf"
        | "image"
        | "html"
        | "link"
        | "other"
      event_type:
        | "course_created"
        | "course_updated"
        | "course_deleted"
        | "lesson_viewed"
        | "lesson_completed"
        | "created"
        | "updated"
        | "deleted"
        | "soft_deleted"
        | "snapshot"
      member_level: "beginner" | "intermediate" | "advanced" | "expert"
      tool_type:
        | "ai"
        | "infra"
        | "automation"
        | "collaboration"
        | "analytics"
        | "frontend"
        | "backend"
        | "database"
        | "devops"
        | "other"
      transaction_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "canceled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  skill_evals: {
    Tables: {
      challenge_examples: {
        Row: {
          challenge_id: string
          created_at: string | null
          created_by: string | null
          explanation: string | null
          id: string
          input: string
          order_index: number | null
          output: string
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          created_by?: string | null
          explanation?: string | null
          id?: string
          input: string
          order_index?: number | null
          output: string
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          created_by?: string | null
          explanation?: string | null
          id?: string
          input?: string
          order_index?: number | null
          output?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_examples_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_test_cases: {
        Row: {
          challenge_id: string
          created_at: string | null
          created_by: string | null
          expected_output: string
          id: string
          input: string
          is_hidden: boolean | null
          order_index: number | null
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          created_by?: string | null
          expected_output: string
          id?: string
          input: string
          is_hidden?: boolean | null
          order_index?: number | null
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          created_by?: string | null
          expected_output?: string
          id?: string
          input?: string
          is_hidden?: boolean | null
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_test_cases_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          category: string
          constraints: string[] | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          deletion_reason: string | null
          description: string
          difficulty: number
          function_name: string | null
          id: string
          image_url: string | null
          initial_code: string | null
          is_active: boolean | null
          is_public: boolean | null
          max_score: number | null
          mentor: string
          order_index: number | null
          problem_statement: string | null
          skills: string[]
          slug: string | null
          status: string | null
          tags: string[] | null
          title: string
          trending: boolean | null
          trending_priority: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          constraints?: string[] | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          description: string
          difficulty: number
          function_name?: string | null
          id?: string
          image_url?: string | null
          initial_code?: string | null
          is_active?: boolean | null
          is_public?: boolean | null
          max_score?: number | null
          mentor?: string
          order_index?: number | null
          problem_statement?: string | null
          skills: string[]
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          trending?: boolean | null
          trending_priority?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          constraints?: string[] | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          description?: string
          difficulty?: number
          function_name?: string | null
          id?: string
          image_url?: string | null
          initial_code?: string | null
          is_active?: boolean | null
          is_public?: boolean | null
          max_score?: number | null
          mentor?: string
          order_index?: number | null
          problem_statement?: string | null
          skills?: string[]
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          trending?: boolean | null
          trending_priority?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      logs: {
        Row: {
          created_at: string
          details: Json
          entity_id: string
          entity_type: string
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json
          entity_id: string
          entity_type: string
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json
          entity_id?: string
          entity_type?: string
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  iam: {
    Enums: {},
  },
  public: {
    Enums: {
      document_type: [
        "markdown",
        "bpmn",
        "mermaid",
        "pdf",
        "image",
        "html",
        "link",
        "other",
      ],
      event_type: [
        "course_created",
        "course_updated",
        "course_deleted",
        "lesson_viewed",
        "lesson_completed",
        "created",
        "updated",
        "deleted",
        "soft_deleted",
        "snapshot",
      ],
      member_level: ["beginner", "intermediate", "advanced", "expert"],
      tool_type: [
        "ai",
        "infra",
        "automation",
        "collaboration",
        "analytics",
        "frontend",
        "backend",
        "database",
        "devops",
        "other",
      ],
      transaction_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "canceled",
      ],
    },
  },
  skill_evals: {
    Enums: {},
  },
} as const

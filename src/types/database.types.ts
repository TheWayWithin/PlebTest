export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
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
      assumptions: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          evidence_against: Json | null
          evidence_for: Json | null
          evidence_level: number | null
          id: string
          priority: number | null
          proposal_id: string
          recommended_action:
            | Database["public"]["Enums"]["assumption_action"]
            | null
          statement: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          evidence_against?: Json | null
          evidence_for?: Json | null
          evidence_level?: number | null
          id?: string
          priority?: number | null
          proposal_id: string
          recommended_action?:
            | Database["public"]["Enums"]["assumption_action"]
            | null
          statement: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          evidence_against?: Json | null
          evidence_for?: Json | null
          evidence_level?: number | null
          id?: string
          priority?: number | null
          proposal_id?: string
          recommended_action?:
            | Database["public"]["Enums"]["assumption_action"]
            | null
          statement?: string
        }
        Relationships: [
          {
            foreignKeyName: "assumptions_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      icps: {
        Row: {
          adoption_tendency:
            | Database["public"]["Enums"]["adoption_tendency"]
            | null
          context: string | null
          created_at: string | null
          current_solutions: string | null
          decision_role: Database["public"]["Enums"]["decision_role"] | null
          demographics: Json | null
          id: string
          name: string
          pain_intensity: Database["public"]["Enums"]["pain_intensity"] | null
          proposal_id: string
          psychographics: Json | null
          updated_at: string | null
        }
        Insert: {
          adoption_tendency?:
            | Database["public"]["Enums"]["adoption_tendency"]
            | null
          context?: string | null
          created_at?: string | null
          current_solutions?: string | null
          decision_role?: Database["public"]["Enums"]["decision_role"] | null
          demographics?: Json | null
          id?: string
          name: string
          pain_intensity?: Database["public"]["Enums"]["pain_intensity"] | null
          proposal_id: string
          psychographics?: Json | null
          updated_at?: string | null
        }
        Update: {
          adoption_tendency?:
            | Database["public"]["Enums"]["adoption_tendency"]
            | null
          context?: string | null
          created_at?: string | null
          current_solutions?: string | null
          decision_role?: Database["public"]["Enums"]["decision_role"] | null
          demographics?: Json | null
          id?: string
          name?: string
          pain_intensity?: Database["public"]["Enums"]["pain_intensity"] | null
          proposal_id?: string
          psychographics?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "icps_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          created_at: string | null
          id: string
          name: string
          quick_fire_objection: string | null
          quick_fire_score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          quick_fire_objection?: string | null
          quick_fire_score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          quick_fire_objection?: string | null
          quick_fire_score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      iterations: {
        Row: {
          changes_summary: string | null
          created_at: string | null
          id: string
          iteration_number: number
          previous_verdict: Database["public"]["Enums"]["verdict"] | null
          proposal_id: string
        }
        Insert: {
          changes_summary?: string | null
          created_at?: string | null
          id?: string
          iteration_number: number
          previous_verdict?: Database["public"]["Enums"]["verdict"] | null
          proposal_id: string
        }
        Update: {
          changes_summary?: string | null
          created_at?: string | null
          id?: string
          iteration_number?: number
          previous_verdict?: Database["public"]["Enums"]["verdict"] | null
          proposal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "iterations_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          agreeableness: number | null
          conscientiousness: number | null
          demographics: Json | null
          extraversion: number | null
          generated_at: string | null
          icp_id: string
          id: string
          name: string
          neuroticism: number | null
          openness: number | null
          psychographics: Json | null
          skepticism_level:
            | Database["public"]["Enums"]["skepticism_level"]
            | null
        }
        Insert: {
          agreeableness?: number | null
          conscientiousness?: number | null
          demographics?: Json | null
          extraversion?: number | null
          generated_at?: string | null
          icp_id: string
          id?: string
          name: string
          neuroticism?: number | null
          openness?: number | null
          psychographics?: Json | null
          skepticism_level?:
            | Database["public"]["Enums"]["skepticism_level"]
            | null
        }
        Update: {
          agreeableness?: number | null
          conscientiousness?: number | null
          demographics?: Json | null
          extraversion?: number | null
          generated_at?: string | null
          icp_id?: string
          id?: string
          name?: string
          neuroticism?: number | null
          openness?: number | null
          psychographics?: Json | null
          skepticism_level?:
            | Database["public"]["Enums"]["skepticism_level"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "personas_icp_id_fkey"
            columns: ["icp_id"]
            isOneToOne: false
            referencedRelation: "icps"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          competitors: string | null
          created_at: string | null
          current_workarounds: string | null
          external_context: string | null
          external_source_url: string | null
          hypotheses: string | null
          id: string
          idea_id: string
          pricing_assumption: string | null
          problem: string | null
          solution: string | null
          status: Database["public"]["Enums"]["proposal_status"] | null
          updated_at: string | null
        }
        Insert: {
          competitors?: string | null
          created_at?: string | null
          current_workarounds?: string | null
          external_context?: string | null
          external_source_url?: string | null
          hypotheses?: string | null
          id?: string
          idea_id: string
          pricing_assumption?: string | null
          problem?: string | null
          solution?: string | null
          status?: Database["public"]["Enums"]["proposal_status"] | null
          updated_at?: string | null
        }
        Update: {
          competitors?: string | null
          created_at?: string | null
          current_workarounds?: string | null
          external_context?: string | null
          external_source_url?: string | null
          hypotheses?: string | null
          id?: string
          idea_id?: string
          pricing_assumption?: string | null
          problem?: string | null
          solution?: string | null
          status?: Database["public"]["Enums"]["proposal_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          assumption_board: Json | null
          confidence_level:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          generated_at: string | null
          generation_version: string | null
          hide_proposal_details: boolean | null
          id: string
          is_public: boolean | null
          key_objections: Json | null
          need_validation_summary: string | null
          next_steps: Json | null
          pivot_suggestions: string | null
          pre_mortem_findings: Json | null
          reality_check_plan: Json | null
          risk_factors: Json | null
          share_expires_at: string | null
          share_token: string | null
          solution_validation_summary: string | null
          status: Database["public"]["Enums"]["report_status"] | null
          strongest_signals: Json | null
          user_rating: number | null
          validation_test_id: string
          verdict: Database["public"]["Enums"]["verdict"] | null
        }
        Insert: {
          assumption_board?: Json | null
          confidence_level?:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          generated_at?: string | null
          generation_version?: string | null
          hide_proposal_details?: boolean | null
          id?: string
          is_public?: boolean | null
          key_objections?: Json | null
          need_validation_summary?: string | null
          next_steps?: Json | null
          pivot_suggestions?: string | null
          pre_mortem_findings?: Json | null
          reality_check_plan?: Json | null
          risk_factors?: Json | null
          share_expires_at?: string | null
          share_token?: string | null
          solution_validation_summary?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          strongest_signals?: Json | null
          user_rating?: number | null
          validation_test_id: string
          verdict?: Database["public"]["Enums"]["verdict"] | null
        }
        Update: {
          assumption_board?: Json | null
          confidence_level?:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          generated_at?: string | null
          generation_version?: string | null
          hide_proposal_details?: boolean | null
          id?: string
          is_public?: boolean | null
          key_objections?: Json | null
          need_validation_summary?: string | null
          next_steps?: Json | null
          pivot_suggestions?: string | null
          pre_mortem_findings?: Json | null
          reality_check_plan?: Json | null
          risk_factors?: Json | null
          share_expires_at?: string | null
          share_token?: string | null
          solution_validation_summary?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          strongest_signals?: Json | null
          user_rating?: number | null
          validation_test_id?: string
          verdict?: Database["public"]["Enums"]["verdict"] | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_validation_test_id_fkey"
            columns: ["validation_test_id"]
            isOneToOne: false
            referencedRelation: "validation_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          anti_sycophancy_triggers: number | null
          avg_response_time_seconds: number | null
          completed_at: string | null
          completion_tokens: number | null
          conversation: Json | null
          id: string
          key_objections: Json | null
          last_activity_at: string | null
          llm_model_version: string | null
          message_count: number | null
          mode: Database["public"]["Enums"]["session_mode"] | null
          need_validated: boolean | null
          nudge_count: number | null
          persona_id: string
          prompt_tokens: number | null
          prompt_version: string | null
          score: number | null
          solution_resonated: boolean | null
          started_at: string | null
          status: Database["public"]["Enums"]["session_status"] | null
          user_message_count: number | null
          validation_test_id: string
        }
        Insert: {
          anti_sycophancy_triggers?: number | null
          avg_response_time_seconds?: number | null
          completed_at?: string | null
          completion_tokens?: number | null
          conversation?: Json | null
          id?: string
          key_objections?: Json | null
          last_activity_at?: string | null
          llm_model_version?: string | null
          message_count?: number | null
          mode?: Database["public"]["Enums"]["session_mode"] | null
          need_validated?: boolean | null
          nudge_count?: number | null
          persona_id: string
          prompt_tokens?: number | null
          prompt_version?: string | null
          score?: number | null
          solution_resonated?: boolean | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
          user_message_count?: number | null
          validation_test_id: string
        }
        Update: {
          anti_sycophancy_triggers?: number | null
          avg_response_time_seconds?: number | null
          completed_at?: string | null
          completion_tokens?: number | null
          conversation?: Json | null
          id?: string
          key_objections?: Json | null
          last_activity_at?: string | null
          llm_model_version?: string | null
          message_count?: number | null
          mode?: Database["public"]["Enums"]["session_mode"] | null
          need_validated?: boolean | null
          nudge_count?: number | null
          persona_id?: string
          prompt_tokens?: number | null
          prompt_version?: string | null
          score?: number | null
          solution_resonated?: boolean | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
          user_message_count?: number | null
          validation_test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_validation_test_id_fkey"
            columns: ["validation_test_id"]
            isOneToOne: false
            referencedRelation: "validation_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_tracking: {
        Row: {
          billing_period_end: string
          billing_period_start: string
          id: string
          ideas_count: number | null
          tests_used: number | null
          user_id: string
        }
        Insert: {
          billing_period_end: string
          billing_period_start: string
          id?: string
          ideas_count?: number | null
          tests_used?: number | null
          user_id: string
        }
        Update: {
          billing_period_end?: string
          billing_period_start?: string
          id?: string
          ideas_count?: number | null
          tests_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          billing_cycle_anchor: string | null
          country: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          stripe_customer_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at: string | null
          updated_at: string | null
          vat_id: string | null
        }
        Insert: {
          billing_cycle_anchor?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          stripe_customer_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
          vat_id?: string | null
        }
        Update: {
          billing_cycle_anchor?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          stripe_customer_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
          vat_id?: string | null
        }
        Relationships: []
      }
      validation_tests: {
        Row: {
          completed_at: string | null
          created_at: string | null
          icp_ids: string[]
          id: string
          parent_test_id: string | null
          persona_count: number
          proposal_id: string
          pushback_preset: Database["public"]["Enums"]["pushback_preset"] | null
          report_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["validation_test_status"] | null
          test_mode: Database["public"]["Enums"]["test_mode"] | null
          validation_mode: Database["public"]["Enums"]["validation_mode"] | null
          version: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          icp_ids: string[]
          id?: string
          parent_test_id?: string | null
          persona_count: number
          proposal_id: string
          pushback_preset?:
            | Database["public"]["Enums"]["pushback_preset"]
            | null
          report_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["validation_test_status"] | null
          test_mode?: Database["public"]["Enums"]["test_mode"] | null
          validation_mode?:
            | Database["public"]["Enums"]["validation_mode"]
            | null
          version?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          icp_ids?: string[]
          id?: string
          parent_test_id?: string | null
          persona_count?: number
          proposal_id?: string
          pushback_preset?:
            | Database["public"]["Enums"]["pushback_preset"]
            | null
          report_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["validation_test_status"] | null
          test_mode?: Database["public"]["Enums"]["test_mode"] | null
          validation_mode?:
            | Database["public"]["Enums"]["validation_mode"]
            | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_report"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_tests_parent_test_id_fkey"
            columns: ["parent_test_id"]
            isOneToOne: false
            referencedRelation: "validation_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_tests_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string | null
          error: string | null
          event_type: string
          id: string
          processed_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          event_type: string
          id: string
          processed_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          error?: string | null
          event_type?: string
          id?: string
          processed_at?: string | null
          status?: string | null
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
      adoption_tendency:
        | "early_adopter"
        | "early_majority"
        | "late_majority"
        | "laggard"
      assumption_action: "validate" | "pivot" | "kill" | "explore"
      confidence_level: "high" | "medium" | "low"
      decision_role: "decision_maker" | "influencer" | "end_user" | "blocker"
      pain_intensity: "annoying" | "costly" | "blocking"
      proposal_status:
        | "draft"
        | "submitted"
        | "testing"
        | "tested"
        | "cancelled"
        | "archived"
      pushback_preset: "cheerleader" | "pragmatist" | "critic"
      report_status: "generating" | "ready" | "public" | "archived"
      session_mode: "interactive" | "spectator"
      session_status:
        | "pending"
        | "active"
        | "completed"
        | "abandoned"
        | "expired"
      skepticism_level: "low" | "medium" | "high"
      subscription_status:
        | "trial"
        | "active"
        | "past_due"
        | "cancelled"
        | "expired"
      subscription_tier: "solo" | "growth" | "scale" | "pro"
      test_mode: "quick" | "standard" | "deep"
      validation_mode: "interactive" | "spectator" | "pre_mortem"
      validation_test_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "failed"
      verdict: "kill" | "pivot" | "build"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      adoption_tendency: [
        "early_adopter",
        "early_majority",
        "late_majority",
        "laggard",
      ],
      assumption_action: ["validate", "pivot", "kill", "explore"],
      confidence_level: ["high", "medium", "low"],
      decision_role: ["decision_maker", "influencer", "end_user", "blocker"],
      pain_intensity: ["annoying", "costly", "blocking"],
      proposal_status: [
        "draft",
        "submitted",
        "testing",
        "tested",
        "cancelled",
        "archived",
      ],
      pushback_preset: ["cheerleader", "pragmatist", "critic"],
      report_status: ["generating", "ready", "public", "archived"],
      session_mode: ["interactive", "spectator"],
      session_status: [
        "pending",
        "active",
        "completed",
        "abandoned",
        "expired",
      ],
      skepticism_level: ["low", "medium", "high"],
      subscription_status: [
        "trial",
        "active",
        "past_due",
        "cancelled",
        "expired",
      ],
      subscription_tier: ["solo", "growth", "scale", "pro"],
      test_mode: ["quick", "standard", "deep"],
      validation_mode: ["interactive", "spectator", "pre_mortem"],
      validation_test_status: [
        "pending",
        "in_progress",
        "completed",
        "cancelled",
        "failed",
      ],
      verdict: ["kill", "pivot", "build"],
    },
  },
} as const


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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          input_data: Json
          output_data: Json | null
          status: string
          task_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          input_data: Json
          output_data?: Json | null
          status?: string
          task_type: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          input_data?: Json
          output_data?: Json | null
          status?: string
          task_type?: string
          user_id?: string
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          accuracy_rate: number
          created_at: string | null
          id: string
          period: string
          period_end: string | null
          period_start: string
          quizzes_completed: number
          score: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accuracy_rate?: number
          created_at?: string | null
          id?: string
          period: string
          period_end?: string | null
          period_start: string
          quizzes_completed?: number
          score?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accuracy_rate?: number
          created_at?: string | null
          id?: string
          period?: string
          period_end?: string | null
          period_start?: string
          quizzes_completed?: number
          score?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          badges: Json | null
          created_at: string | null
          email: string
          exam_level: Database["public"]["Enums"]["exam_level"] | null
          full_name: string | null
          id: string
          last_quiz_date: string | null
          preferred_subjects: Json | null
          school_location: string | null
          streak_days: number | null
          updated_at: string | null
        }
        Insert: {
          badges?: Json | null
          created_at?: string | null
          email: string
          exam_level?: Database["public"]["Enums"]["exam_level"] | null
          full_name?: string | null
          id: string
          last_quiz_date?: string | null
          preferred_subjects?: Json | null
          school_location?: string | null
          streak_days?: number | null
          updated_at?: string | null
        }
        Update: {
          badges?: Json | null
          created_at?: string | null
          email?: string
          exam_level?: Database["public"]["Enums"]["exam_level"] | null
          full_name?: string | null
          id?: string
          last_quiz_date?: string | null
          preferred_subjects?: Json | null
          school_location?: string | null
          streak_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          answer: Json
          approved: boolean | null
          choices: Json | null
          created_at: string | null
          created_by: string | null
          difficulty: number | null
          exam: Database["public"]["Enums"]["exam_level"] | null
          explanation: string | null
          id: string
          original_id: string | null
          prompt: string
          source: Database["public"]["Enums"]["question_source"]
          source_api: string | null
          source_meta: Json | null
          subject: string
          tags: Json | null
          topic_id: string | null
          updated_at: string | null
        }
        Insert: {
          answer: Json
          approved?: boolean | null
          choices?: Json | null
          created_at?: string | null
          created_by?: string | null
          difficulty?: number | null
          exam?: Database["public"]["Enums"]["exam_level"] | null
          explanation?: string | null
          id?: string
          original_id?: string | null
          prompt: string
          source: Database["public"]["Enums"]["question_source"]
          source_api?: string | null
          source_meta?: Json | null
          subject: string
          tags?: Json | null
          topic_id?: string | null
          updated_at?: string | null
        }
        Update: {
          answer?: Json
          approved?: boolean | null
          choices?: Json | null
          created_at?: string | null
          created_by?: string | null
          difficulty?: number | null
          exam?: Database["public"]["Enums"]["exam_level"] | null
          explanation?: string | null
          id?: string
          original_id?: string | null
          prompt?: string
          source?: Database["public"]["Enums"]["question_source"]
          source_api?: string | null
          source_meta?: Json | null
          subject?: string
          tags?: Json | null
          topic_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          created_at: string | null
          id: string
          is_correct: boolean
          question_id: string
          quiz_id: string
          time_taken_ms: number | null
          user_answer: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_correct: boolean
          question_id: string
          quiz_id: string
          time_taken_ms?: number | null
          user_answer?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_correct?: boolean
          question_id?: string
          quiz_id?: string
          time_taken_ms?: number | null
          user_answer?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          exam: Database["public"]["Enums"]["exam_level"] | null
          id: string
          mode: Database["public"]["Enums"]["quiz_mode"]
          question_ids: Json
          score: number | null
          settings: Json | null
          subject: string
          time_limit_seconds: number | null
          total_questions: number
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          exam?: Database["public"]["Enums"]["exam_level"] | null
          id?: string
          mode: Database["public"]["Enums"]["quiz_mode"]
          question_ids: Json
          score?: number | null
          settings?: Json | null
          subject: string
          time_limit_seconds?: number | null
          total_questions: number
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          exam?: Database["public"]["Enums"]["exam_level"] | null
          id?: string
          mode?: Database["public"]["Enums"]["quiz_mode"]
          question_ids?: Json
          score?: number | null
          settings?: Json | null
          subject?: string
          time_limit_seconds?: number | null
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string | null
          id: string
          source_meta: Json | null
          title: string
          topic_id: string
          type: Database["public"]["Enums"]["resource_type"]
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          source_meta?: Json | null
          title: string
          topic_id: string
          type: Database["public"]["Enums"]["resource_type"]
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          source_meta?: Json | null
          title?: string
          topic_id?: string
          type?: Database["public"]["Enums"]["resource_type"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_topic_id: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_topic_id?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_topic_id?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_parent_topic_id_fkey"
            columns: ["parent_topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      difficulty_level: "easy" | "medium" | "hard"
      exam_level: "jamb" | "waec" | "neco" | "post_utme"
      question_source: "past" | "ai_generated" | "uploaded"
      quiz_mode: "past" | "ai_generated"
      resource_type: "youtube" | "book" | "article"
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
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      difficulty_level: ["easy", "medium", "hard"],
      exam_level: ["jamb", "waec", "neco", "post_utme"],
      question_source: ["past", "ai_generated", "uploaded"],
      quiz_mode: ["past", "ai_generated"],
      resource_type: ["youtube", "book", "article"],
    },
  },
} as const

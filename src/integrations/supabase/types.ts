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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action_type: string
          actor_user_id: string
          created_at: string
          id: string
          metadata: Json
          summary: string
          target_id: string | null
          target_table: string
        }
        Insert: {
          action_type: string
          actor_user_id: string
          created_at?: string
          id?: string
          metadata?: Json
          summary: string
          target_id?: string | null
          target_table: string
        }
        Update: {
          action_type?: string
          actor_user_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          summary?: string
          target_id?: string | null
          target_table?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_secret: boolean
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_secret?: boolean
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_secret?: boolean
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_private: boolean | null
          mood: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          mood?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          mood?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          enabled: boolean
          id: string
          name: string
          subject: string
          template_key: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          enabled?: boolean
          id?: string
          name: string
          subject: string
          template_key: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          enabled?: boolean
          id?: string
          name?: string
          subject?: string
          template_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_scores: {
        Row: {
          breakdown: Json
          category: string
          concerns: string[]
          created_at: string
          form_data: Json
          id: string
          overall_score: number
          partner_name: string
          partner_social_handles: Json
          recommendations: string[]
          strengths: string[]
          user_id: string
        }
        Insert: {
          breakdown?: Json
          category: string
          concerns?: string[]
          created_at?: string
          form_data?: Json
          id?: string
          overall_score: number
          partner_name: string
          partner_social_handles?: Json
          recommendations?: string[]
          strengths?: string[]
          user_id: string
        }
        Update: {
          breakdown?: Json
          category?: string
          concerns?: string[]
          created_at?: string
          form_data?: Json
          id?: string
          overall_score?: number
          partner_name?: string
          partner_social_handles?: Json
          recommendations?: string[]
          strengths?: string[]
          user_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_private_details: {
        Row: {
          created_at: string
          id: string
          post_id: string
          social_handles: Json
          subject_email: string | null
          subject_location: string | null
          subject_name: string | null
          subject_phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          social_handles?: Json
          subject_email?: string | null
          subject_location?: string | null
          subject_name?: string | null
          subject_phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          social_handles?: Json
          subject_email?: string | null
          subject_location?: string | null
          subject_name?: string | null
          subject_phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_private_details_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          reports_count: number | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          reports_count?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          reports_count?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_verified: boolean | null
          joined_date: string | null
          last_active: string | null
          notification_prefs: Json
          updated_at: string | null
          username: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_verified?: boolean | null
          joined_date?: string | null
          last_active?: string | null
          notification_prefs?: Json
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_verified?: boolean | null
          joined_date?: string | null
          last_active?: string | null
          notification_prefs?: Json
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          reason: string
          reporter_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reason: string
          reporter_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          reason?: string
          reporter_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      signup_attempts: {
        Row: {
          attempted_at: string
          email_hash: string
          id: string
          ip_hash: string
          success: boolean
        }
        Insert: {
          attempted_at?: string
          email_hash: string
          id?: string
          ip_hash: string
          success?: boolean
        }
        Update: {
          attempted_at?: string
          email_hash?: string
          id?: string
          ip_hash?: string
          success?: boolean
        }
        Relationships: []
      }
      soul_posts: {
        Row: {
          ai_soul_score: number | null
          author_gender: Database["public"]["Enums"]["gender_type"]
          author_id: string
          content: string
          created_at: string
          id: string
          matched_at: string | null
          matched_user_gender: Database["public"]["Enums"]["gender_type"] | null
          matched_user_id: string | null
          mood: string | null
          participant_score: number | null
          reply_count: number
          soul_score: number | null
          status: string
          target_gender: Database["public"]["Enums"]["gender_type"]
          title: string | null
          updated_at: string
        }
        Insert: {
          ai_soul_score?: number | null
          author_gender: Database["public"]["Enums"]["gender_type"]
          author_id: string
          content: string
          created_at?: string
          id?: string
          matched_at?: string | null
          matched_user_gender?:
            | Database["public"]["Enums"]["gender_type"]
            | null
          matched_user_id?: string | null
          mood?: string | null
          participant_score?: number | null
          reply_count?: number
          soul_score?: number | null
          status?: string
          target_gender: Database["public"]["Enums"]["gender_type"]
          title?: string | null
          updated_at?: string
        }
        Update: {
          ai_soul_score?: number | null
          author_gender?: Database["public"]["Enums"]["gender_type"]
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          matched_at?: string | null
          matched_user_gender?:
            | Database["public"]["Enums"]["gender_type"]
            | null
          matched_user_id?: string | null
          mood?: string | null
          participant_score?: number | null
          reply_count?: number
          soul_score?: number | null
          status?: string
          target_gender?: Database["public"]["Enums"]["gender_type"]
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      soul_ratings: {
        Row: {
          created_at: string
          id: string
          rater_id: string
          rating: number
          soul_post_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rater_id: string
          rating: number
          soul_post_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rater_id?: string
          rating?: number
          soul_post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "soul_ratings_soul_post_id_fkey"
            columns: ["soul_post_id"]
            isOneToOne: false
            referencedRelation: "soul_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      soul_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          soul_post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          soul_post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          soul_post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "soul_replies_soul_post_id_fkey"
            columns: ["soul_post_id"]
            isOneToOne: false
            referencedRelation: "soul_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      cleanup_old_signup_attempts: { Args: never; Returns: undefined }
      ensure_current_user_setup: {
        Args: { _email: string; _user_id: string; _username?: string }
        Returns: Json
      }
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
      gender_type: "male" | "female" | "other" | "undisclosed"
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
      gender_type: ["male", "female", "other", "undisclosed"],
    },
  },
} as const

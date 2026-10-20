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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      loyalty_cards: {
        Row: {
          created_at: string
          current_program_id: string
          id: string
          last_visit_at: string | null
          lifetime_visits: number
          restaurant_id: string
          stamps: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_program_id: string
          id?: string
          last_visit_at?: string | null
          lifetime_visits?: number
          restaurant_id: string
          stamps?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_program_id?: string
          id?: string
          last_visit_at?: string | null
          lifetime_visits?: number
          restaurant_id?: string
          stamps?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_cards_current_program_id_fkey"
            columns: ["current_program_id"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_cards_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_programs: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          position: number
          restaurant_id: string
          reward_image_path: string | null
          reward_label: string
          threshold: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          position: number
          restaurant_id: string
          reward_image_path?: string | null
          reward_label: string
          threshold: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          restaurant_id?: string
          reward_image_path?: string | null
          reward_label?: string
          threshold?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_programs_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_admins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          qr_token: string
          short_code: string
          signup_restaurant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          qr_token: string
          short_code: string
          signup_restaurant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          qr_token?: string
          short_code?: string
          signup_restaurant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_signup_restaurant_id_fkey"
            columns: ["signup_restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          restaurant_id: string
          role: Database["public"]["Enums"]["restaurant_member_role"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          restaurant_id: string
          role?: Database["public"]["Enums"]["restaurant_member_role"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          restaurant_id?: string
          role?: Database["public"]["Enums"]["restaurant_member_role"]
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_invitations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_members: {
        Row: {
          created_at: string
          restaurant_id: string
          role: Database["public"]["Enums"]["restaurant_member_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          restaurant_id: string
          role?: Database["public"]["Enums"]["restaurant_member_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          restaurant_id?: string
          role?: Database["public"]["Enums"]["restaurant_member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_members_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          category: Database["public"]["Enums"]["restaurant_category"]
          created_at: string
          id: string
          is_active: boolean
          location: unknown
          logo_path: string | null
          name: string
          opening_hours: Json
          slug: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          category?: Database["public"]["Enums"]["restaurant_category"]
          created_at?: string
          id?: string
          is_active?: boolean
          location?: unknown
          logo_path?: string | null
          name: string
          opening_hours?: Json
          slug: string
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: Database["public"]["Enums"]["restaurant_category"]
          created_at?: string
          id?: string
          is_active?: boolean
          location?: unknown
          logo_path?: string | null
          name?: string
          opening_hours?: Json
          slug?: string
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
        }
        Relationships: []
      }
      scan_logs: {
        Row: {
          card_id: string
          cooldown_overridden: boolean
          created_at: string
          delta: number
          id: string
          idempotency_key: string
          program_id: string
          reverses_log_id: string | null
          staff_id: string
          type: Database["public"]["Enums"]["scan_log_type"]
        }
        Insert: {
          card_id: string
          cooldown_overridden?: boolean
          created_at?: string
          delta: number
          id?: string
          idempotency_key: string
          program_id: string
          reverses_log_id?: string | null
          staff_id: string
          type: Database["public"]["Enums"]["scan_log_type"]
        }
        Update: {
          card_id?: string
          cooldown_overridden?: boolean
          created_at?: string
          delta?: number
          id?: string
          idempotency_key?: string
          program_id?: string
          reverses_log_id?: string | null
          staff_id?: string
          type?: Database["public"]["Enums"]["scan_log_type"]
        }
        Relationships: [
          {
            foreignKeyName: "scan_logs_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "loyalty_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_logs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_logs_reverses_log_id_fkey"
            columns: ["reverses_log_id"]
            isOneToOne: true
            referencedRelation: "scan_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_logs_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_short_code: { Args: never; Returns: string }
    }
    Enums: {
      restaurant_category:
        | "fast_food"
        | "burger"
        | "tacos"
        | "pizza"
        | "asian"
        | "bakery"
        | "coffee_shop"
        | "other"
      restaurant_member_role: "owner" | "staff"
      scan_log_type: "visit" | "reward_redeemed" | "reversal"
      subscription_status: "trialing" | "active" | "past_due" | "canceled"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      restaurant_category: [
        "fast_food",
        "burger",
        "tacos",
        "pizza",
        "asian",
        "bakery",
        "coffee_shop",
        "other",
      ],
      restaurant_member_role: ["owner", "staff"],
      scan_log_type: ["visit", "reward_redeemed", "reversal"],
      subscription_status: ["trialing", "active", "past_due", "canceled"],
    },
  },
} as const

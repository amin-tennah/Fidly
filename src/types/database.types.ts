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
          cover_path: string | null
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
          cover_path?: string | null
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
          cover_path?: string | null
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
          card_id: string | null
          cooldown_overridden: boolean
          created_at: string
          delta: number
          id: string
          idempotency_key: string
          program_id: string
          restaurant_id: string
          reverses_log_id: string | null
          staff_id: string | null
          type: Database["public"]["Enums"]["scan_log_type"]
        }
        Insert: {
          card_id?: string | null
          cooldown_overridden?: boolean
          created_at?: string
          delta: number
          id?: string
          idempotency_key: string
          program_id: string
          restaurant_id: string
          reverses_log_id?: string | null
          staff_id?: string | null
          type: Database["public"]["Enums"]["scan_log_type"]
        }
        Update: {
          card_id?: string | null
          cooldown_overridden?: boolean
          created_at?: string
          delta?: number
          id?: string
          idempotency_key?: string
          program_id?: string
          restaurant_id?: string
          reverses_log_id?: string | null
          staff_id?: string | null
          type?: Database["public"]["Enums"]["scan_log_type"]
        }
        Relationships: [
          {
            foreignKeyName: "scan_logs_card_restaurant_fkey"
            columns: ["card_id", "restaurant_id"]
            isOneToOne: false
            referencedRelation: "loyalty_cards"
            referencedColumns: ["id", "restaurant_id"]
          },
          {
            foreignKeyName: "scan_logs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_logs_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
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
      accept_restaurant_invitation: {
        Args: { p_invitation_id: string }
        Returns: string
      }
      create_loyalty_program: {
        Args: {
          p_restaurant_id: string
          p_reward_image_path?: string
          p_reward_label: string
          p_threshold: number
        }
        Returns: string
      }
      generate_qr_token: { Args: never; Returns: string }
      generate_short_code: { Args: never; Returns: string }
      list_my_pending_invitations: {
        Args: never
        Returns: {
          expires_at: string
          invitation_id: string
          member_role: Database["public"]["Enums"]["restaurant_member_role"]
          restaurant_id: string
          restaurant_name: string
        }[]
      }
      list_scan_logs: {
        Args: {
          p_before_at?: string
          p_before_id?: string
          p_limit?: number
          p_restaurant_id: string
        }
        Returns: {
          cooldown_overridden: boolean
          created_at: string
          customer_name: string
          delta: number
          is_reversed: boolean
          log_id: string
          reversed_at: string
          reverses_log_id: string
          reward_label: string
          staff_name: string
          type: Database["public"]["Enums"]["scan_log_type"]
        }[]
      }
      lookup_customer: {
        Args: { p_restaurant_id: string; p_token_or_code: string }
        Returns: {
          card_id: string
          cooldown_remaining_seconds: number
          customer_id: string
          display_name: string
          is_in_cooldown: boolean
          is_reward_unlocked: boolean
          last_visit_at: string
          program_id: string
          reward_label: string
          stamps: number
          threshold: number
        }[]
      }
      record_visit: {
        Args: {
          p_customer_id: string
          p_force_cooldown?: boolean
          p_idempotency_key: string
          p_restaurant_id: string
        }
        Returns: Database["public"]["CompositeTypes"]["scan_result"]
        SetofOptions: {
          from: "*"
          to: "scan_result"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      redeem_reward: {
        Args: {
          p_card_id: string
          p_idempotency_key: string
          p_restaurant_id: string
        }
        Returns: Database["public"]["CompositeTypes"]["scan_result"]
        SetofOptions: {
          from: "*"
          to: "scan_result"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      reorder_loyalty_programs: {
        Args: { p_program_ids: string[]; p_restaurant_id: string }
        Returns: undefined
      }
      reverse_scan: {
        Args: {
          p_idempotency_key: string
          p_log_id: string
          p_restaurant_id: string
        }
        Returns: Database["public"]["CompositeTypes"]["scan_result"]
        SetofOptions: {
          from: "*"
          to: "scan_result"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      set_loyalty_program_active: {
        Args: { p_is_active: boolean; p_program_id: string }
        Returns: undefined
      }
      set_loyalty_program_image: {
        Args: { p_program_id: string; p_reward_image_path?: string }
        Returns: undefined
      }
      set_restaurant_address: {
        Args: {
          p_address: string
          p_lat: number
          p_lng: number
          p_restaurant_id: string
        }
        Returns: undefined
      }
      update_loyalty_program: {
        Args: {
          p_program_id: string
          p_reward_label: string
          p_threshold: number
        }
        Returns: undefined
      }
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
      scan_result: {
        log_id: string | null
        card_id: string | null
        program_id: string | null
        reward_label: string | null
        stamps: number | null
        threshold: number | null
        is_reward_unlocked: boolean | null
        last_visit_at: string | null
        replayed: boolean | null
      }
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

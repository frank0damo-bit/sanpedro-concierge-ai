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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      auth_users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          last_name: string | null
          password_hash: string | null
          phone_number: string | null
          profile_data: Json | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          password_hash?: string | null
          phone_number?: string | null
          profile_data?: Json | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          password_hash?: string | null
          phone_number?: string | null
          profile_data?: Json | null
        }
        Relationships: []
      }
      booking_slots: {
        Row: {
          created_at: string | null
          end_time: string
          is_booked: boolean | null
          service_id: string
          slot_id: string
          start_time: string
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          is_booked?: boolean | null
          service_id: string
          slot_id?: string
          start_time: string
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          is_booked?: boolean | null
          service_id?: string
          slot_id?: string
          start_time?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_slots_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_slots_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "service_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string | null
          created_at: string | null
          description: string | null
          id: string
          notes: string | null
          preferred_date: string | null
          service_category_id: string | null
          service_vendor_id: string | null
          status: string | null
          title: string
          total_price: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          preferred_date?: string | null
          service_category_id?: string | null
          service_vendor_id?: string | null
          status?: string | null
          title: string
          total_price?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          booking_date?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          preferred_date?: string | null
          service_category_id?: string | null
          service_vendor_id?: string | null
          status?: string | null
          title?: string
          total_price?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      curated_package_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          notes: string | null
          package_id: string
          quantity: number
          service_category_id: string | null
          title: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          package_id: string
          quantity?: number
          service_category_id?: string | null
          title: string
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          package_id?: string
          quantity?: number
          service_category_id?: string | null
          title?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "curated_package_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "curated_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curated_package_items_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      curated_packages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          party_size: number
          prompt: string
          status: string
          title: string
          total_price: number
          travel_dates: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          party_size?: number
          prompt: string
          status?: string
          title: string
          total_price?: number
          travel_dates?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          party_size?: number
          prompt?: string
          status?: string
          title?: string
          total_price?: number
          travel_dates?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      curated_packagesai: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          dates: unknown | null
          generated_content: Json | null
          id: string
          prompt: string
          status: string | null
          travelers: number
          user_id: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          dates?: unknown | null
          generated_content?: Json | null
          id?: string
          prompt: string
          status?: string | null
          travelers: number
          user_id?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          dates?: unknown | null
          generated_content?: Json | null
          id?: string
          prompt?: string
          status?: string | null
          travelers?: number
          user_id?: string | null
        }
        Relationships: []
      }
      customer_requests: {
        Row: {
          created_at: string | null
          id: string
          message: string
          priority: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          booking_id: string | null
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          request_id: string | null
          sender_type: string
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          request_id?: string | null
          sender_type: string
          user_id: string
        }
        Update: {
          booking_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          request_id?: string | null
          sender_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "customer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          booking_fields: Json | null
          category_group: string | null
          created_at: string | null
          description: string | null
          features: string[] | null
          good_eats: string | null
          icon_name: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number | null
          sort_order: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          booking_fields?: Json | null
          category_group?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          good_eats?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price?: number | null
          sort_order?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          booking_fields?: Json | null
          category_group?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          good_eats?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number | null
          sort_order?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_options: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          service_category_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          service_category_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          service_category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_options_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_vendors: {
        Row: {
          id: string
          name: string | null
          price: number
          service_category_id: string
          vendor_id: string
        }
        Insert: {
          id?: string
          name?: string | null
          price: number
          service_category_id: string
          vendor_id: string
        }
        Update: {
          id?: string
          name?: string | null
          price?: number
          service_category_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_category_id"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_vendor_id"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_vendors_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          avatar: string | null
          created_at: string
          id: string
          name: string
          role: string | null
          specialties: string[] | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          id?: string
          name: string
          role?: string | null
          specialties?: string[] | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          id?: string
          name?: string
          role?: string | null
          specialties?: string[] | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          id: string
          location: string | null
          name: string
          rating: number | null
          service: string | null
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          name: string
          rating?: number | null
          service?: string | null
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          rating?: number | null
          service?: string | null
          text?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
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
  public: {
    Enums: {},
  },
} as const

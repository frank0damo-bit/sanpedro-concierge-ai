export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          notes: string | null
          preferred_date: string | null
          service_category_id: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          preferred_date?: string | null
          service_category_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          preferred_date?: string | null
          service_category_id?: string | null
          status?: string | null
          title?: string
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
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          is_active: boolean | null
          category_group: string | null
          created_at: string | null
          description: string | null
          features: string[] | null
          icon_name: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          is_active?: boolean | null
          category_group?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          is_active?: boolean | null
          category_group?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          sort_order?: number | null
          updated_at?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type Composites<
  PublicCompositeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeName extends PublicCompositeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeNameOrOptions["schema"]]["CompositeTypes"][CompositeName]
  : PublicCompositeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeNameOrOptions]
    : never

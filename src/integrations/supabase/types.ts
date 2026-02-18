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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          certifications: string[] | null
          city: string
          created_at: string
          email: string
          ice: string
          id: string
          name: string
          phone: string
          profile_id: string
          service_areas: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certifications?: string[] | null
          city: string
          created_at?: string
          email: string
          ice: string
          id?: string
          name: string
          phone: string
          profile_id: string
          service_areas?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certifications?: string[] | null
          city?: string
          created_at?: string
          email?: string
          ice?: string
          id?: string
          name?: string
          phone?: string
          profile_id?: string
          service_areas?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "partner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_costs: {
        Row: {
          city: string
          company_id: string
          cost: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          company_id: string
          cost?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          company_id?: string
          cost?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_costs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verifications: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          otp_code: string
          user_id: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          otp_code: string
          user_id: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp_code?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      kits: {
        Row: {
          batteries: string | null
          company_id: string
          created_at: string
          estimated_production_kwh: number | null
          id: string
          inverter: string
          is_active: boolean
          name: string
          panel_brand: string
          panel_count: number
          panel_dimensions: string | null
          panel_wattage: number | null
          power_kwc: number
          price_ttc: number
          structure: string | null
          updated_at: string
          user_id: string
          warranty_years: number
        }
        Insert: {
          batteries?: string | null
          company_id: string
          created_at?: string
          estimated_production_kwh?: number | null
          id?: string
          inverter: string
          is_active?: boolean
          name: string
          panel_brand: string
          panel_count: number
          panel_dimensions?: string | null
          panel_wattage?: number | null
          power_kwc: number
          price_ttc: number
          structure?: string | null
          updated_at?: string
          user_id: string
          warranty_years?: number
        }
        Update: {
          batteries?: string | null
          company_id?: string
          created_at?: string
          estimated_production_kwh?: number | null
          id?: string
          inverter?: string
          is_active?: boolean
          name?: string
          panel_brand?: string
          panel_count?: number
          panel_dimensions?: string | null
          panel_wattage?: number | null
          power_kwc?: number
          price_ttc?: number
          structure?: string | null
          updated_at?: string
          user_id?: string
          warranty_years?: number
        }
        Relationships: [
          {
            foreignKeyName: "kits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          applicable_aids: string[] | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          power_kwc: number
          price_ttc: number
          profile_type: string
          updated_at: string
        }
        Insert: {
          applicable_aids?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          power_kwc: number
          price_ttc: number
          profile_type: string
          updated_at?: string
        }
        Update: {
          applicable_aids?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          power_kwc?: number
          price_ttc?: number
          profile_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_documents: {
        Row: {
          company_id: string
          doc_type: string
          file_name: string
          file_path: string
          id: string
          uploaded_at: string
          user_id: string
          validated: boolean
        }
        Insert: {
          company_id: string
          doc_type: string
          file_name: string
          file_path: string
          id?: string
          uploaded_at?: string
          user_id: string
          validated?: boolean
        }
        Update: {
          company_id?: string
          doc_type?: string
          file_name?: string
          file_path?: string
          id?: string
          uploaded_at?: string
          user_id?: string
          validated?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "partner_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_profiles: {
        Row: {
          cotisations_a_jour: boolean
          created_at: string
          email: string | null
          id: string
          setup_complete: boolean
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cotisations_a_jour?: boolean
          created_at?: string
          email?: string | null
          id?: string
          setup_complete?: boolean
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cotisations_a_jour?: boolean
          created_at?: string
          email?: string | null
          id?: string
          setup_complete?: boolean
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          admin_notes: string | null
          annual_consumption: string | null
          budget: string | null
          city: string | null
          client_email: string
          client_name: string
          client_phone: string | null
          created_at: string
          housing_type: string | null
          id: string
          project_type: string | null
          recommended_package_id: string | null
          roof_orientation: string | null
          roof_surface: string | null
          roof_type: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          annual_consumption?: string | null
          budget?: string | null
          city?: string | null
          client_email: string
          client_name: string
          client_phone?: string | null
          created_at?: string
          housing_type?: string | null
          id?: string
          project_type?: string | null
          recommended_package_id?: string | null
          roof_orientation?: string | null
          roof_surface?: string | null
          roof_type?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          annual_consumption?: string | null
          budget?: string | null
          city?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string
          housing_type?: string | null
          id?: string
          project_type?: string | null
          recommended_package_id?: string | null
          roof_orientation?: string | null
          roof_surface?: string | null
          roof_type?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_recommended_package_id_fkey"
            columns: ["recommended_package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      check_partner_setup_complete: {
        Args: { _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_company_owner: { Args: { _company_id: string }; Returns: boolean }
      is_profile_owner: { Args: { _profile_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const

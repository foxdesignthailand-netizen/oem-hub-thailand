export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "VISITOR" | "BUYER" | "SUPPLIER" | "ADMIN" | "SUPER_ADMIN";

export type LifecycleStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "HIDDEN"
  | "SUSPENDED"
  | "ARCHIVED"
  | "DELETED";

export type SupplierVerificationLevel =
  | "REGISTERED"
  | "BASIC_VERIFIED"
  | "BUSINESS_VERIFIED"
  | "PREMIUM_VERIFIED"
  | "SUSPENDED";

export type RfqStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "MATCHING"
  | "QUOTING"
  | "QUOTE_ACCEPTED"
  | "ORDER_CREATED"
  | "CANCELLED"
  | "EXPIRED";

export type QuoteStatus =
  | "DRAFT"
  | "SENT"
  | "REVISED"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "CANCELLED";

export type OrderStatus =
  | "QUOTE_ACCEPTED"
  | "WAITING_BUYER_PAYMENT"
  | "BUYER_PAYMENT_REPORTED"
  | "WAITING_SUPPLIER_PAYMENT_CONFIRMATION"
  | "WAITING_PLATFORM_FEE"
  | "PLATFORM_FEE_PAID"
  | "IN_PROGRESS"
  | "READY_FOR_REVIEW"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export type PaymentTerm = "FULL_100" | "DEPOSIT_FINAL";

export type PaymentStatus =
  | "NOT_REPORTED"
  | "REPORTED"
  | "CONFIRMED_BY_SUPPLIER"
  | "REJECTED"
  | "VERIFIED_BY_ADMIN";

export type PlatformFeeStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "WAITING_PAYMENT"
  | "PAID"
  | "OVERDUE"
  | "WAIVED"
  | "FAILED";

export type SupabaseConfigStatus = {
  isConfigured: boolean;
  missingKeys: string[];
};

export type SystemSettingRow = {
  key: string;
  value: Json;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type UserRow = {
  id: string;
  auth_user_id: string | null;
  email: string;
  role: UserRole;
  status: LifecycleStatus;
  created_at: string;
  updated_at: string;
};

export type RfqRow = {
  id: string;
  rfq_no: string;
  buyer_user_id: string;
  category_id: string | null;
  title: string;
  status: RfqStatus;
  budget_min: number | null;
  budget_max: number | null;
  target_delivery_date: string | null;
  created_at: string;
  updated_at: string;
};

export type QuoteRow = {
  id: string;
  quote_no: string;
  rfq_id: string;
  supplier_company_id: string;
  status: QuoteStatus;
  total_amount: number;
  payment_term: PaymentTerm;
  lead_time_days: number | null;
  created_at: string;
  updated_at: string;
};

export type OrderRow = {
  id: string;
  order_no: string;
  rfq_id: string;
  quote_id: string;
  buyer_user_id: string;
  supplier_company_id: string;
  status: OrderStatus;
  total_amount: number;
  payment_term: PaymentTerm;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      system_settings: {
        Row: SystemSettingRow;
        Insert: Partial<SystemSettingRow> & Pick<SystemSettingRow, "key" | "value">;
        Update: Partial<SystemSettingRow>;
      };
      users: {
        Row: UserRow;
        Insert: Partial<UserRow> & Pick<UserRow, "email" | "role">;
        Update: Partial<UserRow>;
      };
      rfqs: {
        Row: RfqRow;
        Insert: Partial<RfqRow> & Pick<RfqRow, "rfq_no" | "buyer_user_id" | "title">;
        Update: Partial<RfqRow>;
      };
      quotes: {
        Row: QuoteRow;
        Insert: Partial<QuoteRow> &
          Pick<QuoteRow, "quote_no" | "rfq_id" | "supplier_company_id" | "total_amount" | "payment_term">;
        Update: Partial<QuoteRow>;
      };
      orders: {
        Row: OrderRow;
        Insert: Partial<OrderRow> &
          Pick<OrderRow, "order_no" | "rfq_id" | "quote_id" | "buyer_user_id" | "supplier_company_id" | "total_amount" | "payment_term">;
        Update: Partial<OrderRow>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      oem_create_demo_rfq: {
        Args: Record<string, never>;
        Returns: Json;
      };
      oem_send_demo_quote: {
        Args: { p_rfq_no?: string };
        Returns: Json;
      };
      oem_accept_demo_quote: {
        Args: { p_quote_no?: string };
        Returns: Json;
      };
      oem_report_demo_buyer_payment: {
        Args: { p_order_no?: string };
        Returns: Json;
      };
      oem_confirm_demo_buyer_payment: {
        Args: { p_order_no?: string };
        Returns: Json;
      };
      oem_report_demo_platform_fee: {
        Args: { p_order_no?: string };
        Returns: Json;
      };
      oem_verify_demo_platform_fee: {
        Args: { p_order_no?: string };
        Returns: Json;
      };
      oem_complete_demo_order: {
        Args: { p_order_no?: string };
        Returns: Json;
      };
      oem_create_demo_review: {
        Args: { p_order_no?: string };
        Returns: Json;
      };
      oem_mvp_upsert_user: {
        Args: {
          p_email: string;
          p_role?: UserRole;
          p_display_name?: string | null;
          p_company_name?: string | null;
          p_phone?: string | null;
        };
        Returns: Json;
      };
      oem_mvp_upsert_supplier_company: {
        Args: {
          p_actor_email: string;
          p_company_name: string;
          p_province?: string | null;
          p_description?: string | null;
          p_logo_url?: string | null;
          p_cover_image_url?: string | null;
        };
        Returns: Json;
      };
      oem_mvp_create_rfq: {
        Args: {
          p_actor_email: string;
          p_title: string;
          p_category_slug?: string;
          p_category_name?: string;
          p_product_name?: string;
          p_quantity?: number;
          p_budget?: number;
          p_description?: string | null;
          p_contact_name?: string | null;
          p_contact_email?: string | null;
          p_contact_phone?: string | null;
        };
        Returns: Json;
      };
      oem_mvp_send_quote: {
        Args: {
          p_actor_email: string;
          p_rfq_no: string;
          p_supplier_name?: string;
          p_total_amount?: number;
          p_moq?: number;
          p_lead_time_days?: number;
          p_note?: string | null;
        };
        Returns: Json;
      };
      oem_mvp_accept_quote: {
        Args: {
          p_actor_email: string;
          p_quote_no: string;
        };
        Returns: Json;
      };
      oem_mvp_report_buyer_payment: {
        Args: {
          p_actor_email: string;
          p_order_no: string;
          p_amount?: number | null;
          p_proof_file_path?: string | null;
          p_note?: string | null;
        };
        Returns: Json;
      };
      oem_mvp_confirm_buyer_payment: {
        Args: {
          p_actor_email: string;
          p_order_no: string;
        };
        Returns: Json;
      };
      oem_mvp_report_platform_fee: {
        Args: {
          p_actor_email: string;
          p_order_no: string;
          p_proof_file_path?: string | null;
        };
        Returns: Json;
      };
      oem_mvp_verify_platform_fee: {
        Args: {
          p_actor_email: string;
          p_order_no: string;
        };
        Returns: Json;
      };
      oem_mvp_mark_ready_for_review: {
        Args: {
          p_actor_email: string;
          p_order_no: string;
          p_note?: string | null;
        };
        Returns: Json;
      };
      oem_mvp_complete_order: {
        Args: {
          p_actor_email: string;
          p_order_no: string;
        };
        Returns: Json;
      };
      oem_mvp_create_review: {
        Args: {
          p_actor_email: string;
          p_order_no: string;
          p_rating?: number;
          p_comment?: string;
        };
        Returns: Json;
      };
      oem_mvp_register_file: {
        Args: {
          p_actor_email: string;
          p_owner_type: string;
          p_owner_no: string;
          p_bucket: string;
          p_file_name: string;
          p_file_path: string;
          p_file_type?: string | null;
          p_file_size?: number | null;
        };
        Returns: Json;
      };
      oem_mvp_get_snapshot: {
        Args: Record<string, never>;
        Returns: Json;
      };
    };
    Enums: {
      user_role: UserRole;
      lifecycle_status: LifecycleStatus;
      supplier_verification_level: SupplierVerificationLevel;
      rfq_status: RfqStatus;
      quote_status: QuoteStatus;
      order_status: OrderStatus;
      payment_term: PaymentTerm;
      payment_status: PaymentStatus;
      platform_fee_status: PlatformFeeStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

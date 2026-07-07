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

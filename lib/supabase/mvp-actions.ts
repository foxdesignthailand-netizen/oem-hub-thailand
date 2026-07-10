import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database, Json, UserRole } from "@/lib/supabase/types";

export const mvpSessionStorageKey = "oem-hub-supabase-mvp-session-v1";

export type MvpSession = {
  actorEmail: string;
  buyerEmail: string;
  supplierEmail: string;
  adminEmail: string;
  rfqNo?: string;
  quoteNo?: string;
  orderNo?: string;
  role: UserRole;
};

export type MvpSnapshot = {
  rfqs: Array<Record<string, unknown>>;
  quotes: Array<Record<string, unknown>>;
  orders: Array<Record<string, unknown>>;
  payments: Array<Record<string, unknown>>;
  reviews: Array<Record<string, unknown>>;
  suppliers: Array<Record<string, unknown>>;
  files: Array<Record<string, unknown>>;
};

export type MvpActionResult = {
  ok: boolean;
  message: string;
  data?: Json;
};

const defaultSession: MvpSession = {
  actorEmail: "buyer-demo@oemhub.local",
  buyerEmail: "buyer-demo@oemhub.local",
  supplierEmail: "supplier-demo@oemhub.local",
  adminEmail: "admin-demo@oemhub.local",
  role: "BUYER"
};

function getClient(): SupabaseClient<Database> {
  const client = createSupabaseBrowserClient();
  if (!client) {
    throw new Error("ยังไม่ได้ตั้งค่า Supabase URL / anon key ใน .env.local");
  }
  return client;
}

export function loadMvpSession(): MvpSession {
  if (typeof window === "undefined") return defaultSession;

  const raw = window.localStorage.getItem(mvpSessionStorageKey);
  if (!raw) return defaultSession;

  try {
    return { ...defaultSession, ...(JSON.parse(raw) as Partial<MvpSession>) };
  } catch {
    return defaultSession;
  }
}

export function saveMvpSession(session: MvpSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(mvpSessionStorageKey, JSON.stringify(session));
}

export function updateMvpSession(next: Partial<MvpSession>) {
  const session = { ...loadMvpSession(), ...next };
  saveMvpSession(session);
  return session;
}

function pickText(data: Json | undefined, key: string) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return undefined;
  const value = data[key];
  return typeof value === "string" ? value : undefined;
}

async function runRpc<TName extends keyof Database["public"]["Functions"]>(
  name: TName,
  args: Database["public"]["Functions"][TName]["Args"]
): Promise<MvpActionResult> {
  try {
    const client = getClient();
    const { data, error } = await client.rpc(name, args as any);

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: "สำเร็จ", data: data as Json };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"
    };
  }
}

export async function mvpRegisterUser(input: {
  email: string;
  role: UserRole;
  displayName?: string;
  companyName?: string;
  phone?: string;
}) {
  const result = await runRpc("oem_mvp_upsert_user", {
    p_email: input.email,
    p_role: input.role,
    p_display_name: input.displayName ?? null,
    p_company_name: input.companyName ?? null,
    p_phone: input.phone ?? null
  });

  if (result.ok) {
    updateMvpSession({ actorEmail: input.email, role: input.role });
  }

  return result;
}

export async function mvpCreateRfq(input?: {
  title?: string;
  categorySlug?: string;
  categoryName?: string;
  productName?: string;
  quantity?: number;
  budget?: number;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}) {
  const session = loadMvpSession();
  const result = await runRpc("oem_mvp_create_rfq", {
    p_actor_email: input?.contactEmail ?? session.buyerEmail,
    p_title: input?.title ?? "ผลิตสินค้า OEM พร้อมบรรจุภัณฑ์",
    p_category_slug: input?.categorySlug ?? "oem-odm",
    p_category_name: input?.categoryName ?? "OEM / ODM",
    p_product_name: input?.productName ?? "OEM product",
    p_quantity: input?.quantity ?? 3000,
    p_budget: input?.budget ?? 150000,
    p_description: input?.description ?? "MVP RFQ created from OEM Hub Thailand",
    p_contact_name: input?.contactName ?? "Buyer Demo",
    p_contact_email: input?.contactEmail ?? session.buyerEmail,
    p_contact_phone: input?.contactPhone ?? "080-000-0000"
  });

  const rfqNo = pickText(result.data, "rfq_no");
  if (result.ok && rfqNo) updateMvpSession({ rfqNo, actorEmail: session.buyerEmail, role: "BUYER" });

  return result;
}

export async function mvpSendQuote(input?: {
  rfqNo?: string;
  supplierName?: string;
  totalAmount?: number;
  moq?: number;
  leadTimeDays?: number;
  note?: string;
}) {
  const session = loadMvpSession();
  const result = await runRpc("oem_mvp_send_quote", {
    p_actor_email: session.supplierEmail,
    p_rfq_no: input?.rfqNo ?? session.rfqNo ?? "",
    p_supplier_name: input?.supplierName ?? "Premium Factory Co., Ltd.",
    p_total_amount: input?.totalAmount ?? 158000,
    p_moq: input?.moq ?? 1000,
    p_lead_time_days: input?.leadTimeDays ?? 20,
    p_note: input?.note ?? "รวมผลิตสินค้า บรรจุภัณฑ์ และตรวจคุณภาพก่อนส่งมอบ"
  });

  const quoteNo = pickText(result.data, "quote_no");
  if (result.ok && quoteNo) updateMvpSession({ quoteNo, actorEmail: session.supplierEmail, role: "SUPPLIER" });

  return result;
}

export async function mvpAcceptQuote(input?: { quoteNo?: string }) {
  const session = loadMvpSession();
  const result = await runRpc("oem_mvp_accept_quote", {
    p_actor_email: session.buyerEmail,
    p_quote_no: input?.quoteNo ?? session.quoteNo ?? ""
  });

  const orderNo = pickText(result.data, "order_no");
  if (result.ok && orderNo) updateMvpSession({ orderNo, actorEmail: session.buyerEmail, role: "BUYER" });

  return result;
}

export async function mvpReportBuyerPayment(input?: { orderNo?: string; amount?: number; proofFilePath?: string; note?: string }) {
  const session = loadMvpSession();
  return runRpc("oem_mvp_report_buyer_payment", {
    p_actor_email: session.buyerEmail,
    p_order_no: input?.orderNo ?? session.orderNo ?? "",
    p_amount: input?.amount ?? null,
    p_proof_file_path: input?.proofFilePath ?? null,
    p_note: input?.note ?? "Buyer reports direct payment to Supplier"
  });
}

export async function mvpConfirmBuyerPayment(input?: { orderNo?: string }) {
  const session = loadMvpSession();
  return runRpc("oem_mvp_confirm_buyer_payment", {
    p_actor_email: session.supplierEmail,
    p_order_no: input?.orderNo ?? session.orderNo ?? ""
  });
}

export async function mvpReportPlatformFee(input?: { orderNo?: string; proofFilePath?: string }) {
  const session = loadMvpSession();
  return runRpc("oem_mvp_report_platform_fee", {
    p_actor_email: session.supplierEmail,
    p_order_no: input?.orderNo ?? session.orderNo ?? "",
    p_proof_file_path: input?.proofFilePath ?? null
  });
}

export async function mvpVerifyPlatformFee(input?: { orderNo?: string }) {
  const session = loadMvpSession();
  return runRpc("oem_mvp_verify_platform_fee", {
    p_actor_email: session.adminEmail,
    p_order_no: input?.orderNo ?? session.orderNo ?? ""
  });
}

export async function mvpMarkReadyForReview(input?: { orderNo?: string; note?: string }) {
  const session = loadMvpSession();
  return runRpc("oem_mvp_mark_ready_for_review", {
    p_actor_email: session.supplierEmail,
    p_order_no: input?.orderNo ?? session.orderNo ?? "",
    p_note: input?.note ?? "Supplier delivered work for buyer review"
  });
}

export async function mvpCompleteOrder(input?: { orderNo?: string }) {
  const session = loadMvpSession();
  return runRpc("oem_mvp_complete_order", {
    p_actor_email: session.buyerEmail,
    p_order_no: input?.orderNo ?? session.orderNo ?? ""
  });
}

export async function mvpCreateReview(input?: { orderNo?: string; rating?: number; comment?: string }) {
  const session = loadMvpSession();
  return runRpc("oem_mvp_create_review", {
    p_actor_email: session.buyerEmail,
    p_order_no: input?.orderNo ?? session.orderNo ?? "",
    p_rating: input?.rating ?? 5,
    p_comment: input?.comment ?? "งานเรียบร้อย ติดตามสถานะได้ดี และส่งมอบตามที่ตกลง"
  });
}

export async function mvpRegisterFile(input?: {
  ownerType?: string;
  ownerNo?: string;
  bucket?: string;
  fileName?: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
}) {
  const session = loadMvpSession();
  return runRpc("oem_mvp_register_file", {
    p_actor_email: session.actorEmail,
    p_owner_type: input?.ownerType ?? "rfq",
    p_owner_no: input?.ownerNo ?? session.rfqNo ?? "",
    p_bucket: input?.bucket ?? "rfq-attachments",
    p_file_name: input?.fileName ?? "product-brief.pdf",
    p_file_path: input?.filePath ?? `${session.rfqNo ?? "rfq"}/product-brief.pdf`,
    p_file_type: input?.fileType ?? "application/pdf",
    p_file_size: input?.fileSize ?? 204800
  });
}

export async function mvpUpsertSupplierProfile(input?: {
  companyName?: string;
  province?: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
}) {
  const session = loadMvpSession();
  return runRpc("oem_mvp_upsert_supplier_company", {
    p_actor_email: session.supplierEmail,
    p_company_name: input?.companyName ?? "Premium Factory Co., Ltd.",
    p_province: input?.province ?? "สมุทรปราการ",
    p_description: input?.description ?? "โรงงาน OEM/ODM สำหรับสินค้าและบรรจุภัณฑ์ พร้อมเอกสารมาตรฐาน",
    p_logo_url: input?.logoUrl ?? null,
    p_cover_image_url: input?.coverImageUrl ?? null
  });
}

export async function mvpGetSnapshot(): Promise<{ ok: boolean; message: string; snapshot?: MvpSnapshot; data?: Json }> {
  const result = await runRpc("oem_mvp_get_snapshot", {});
  if (!result.ok) return result;

  return {
    ...result,
    snapshot: result.data as unknown as MvpSnapshot
  };
}

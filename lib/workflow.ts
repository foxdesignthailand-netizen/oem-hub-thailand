import type { OrderStatus, PaymentTerm, PlatformFeeStatus, QuoteStatus, RfqStatus, UserRole } from "@/lib/supabase/types";

export type WorkflowActor = "BUYER" | "SUPPLIER" | "ADMIN";

export type WorkflowRfq = {
  id: string;
  title: string;
  category: string;
  quantity: number;
  budget: number;
  status: RfqStatus;
  buyerName: string;
  createdAt: string;
};

export type WorkflowQuote = {
  id: string;
  rfqId: string;
  supplierName: string;
  totalAmount: number;
  moq: number;
  leadTimeDays: number;
  paymentTerm: PaymentTerm;
  status: QuoteStatus;
  note: string;
  createdAt: string;
};

export type WorkflowOrder = {
  id: string;
  rfqId: string;
  quoteId: string;
  buyerName: string;
  supplierName: string;
  totalAmount: number;
  paymentTerm: PaymentTerm;
  status: OrderStatus;
  buyerPaymentReported: boolean;
  supplierPaymentConfirmed: boolean;
  platformFeeStatus: PlatformFeeStatus;
  progress: number;
  createdAt: string;
};

export type WorkflowPayment = {
  id: string;
  orderId: string;
  direction: "BUYER_TO_SUPPLIER" | "SUPPLIER_TO_PLATFORM";
  amount: number;
  status: "REPORTED" | "CONFIRMED_BY_SUPPLIER" | "VERIFIED_BY_ADMIN";
  note: string;
  createdAt: string;
};

export type WorkflowPlatformFee = {
  id: string;
  orderId: string;
  feeBaseAmount: number;
  feeRate: number;
  feeTotal: number;
  status: PlatformFeeStatus;
  createdAt: string;
};

export type WorkflowReview = {
  id: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type WorkflowAudit = {
  id: string;
  actor: WorkflowActor;
  action: string;
  entity: string;
  message: string;
  createdAt: string;
};

export type WorkflowState = {
  rfqs: WorkflowRfq[];
  quotes: WorkflowQuote[];
  orders: WorkflowOrder[];
  payments: WorkflowPayment[];
  platformFees: WorkflowPlatformFee[];
  reviews: WorkflowReview[];
  audits: WorkflowAudit[];
};

export const workflowStorageKey = "oem-hub-workflow-demo-v1";

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}-${Date.now().toString(36).toUpperCase()}`;

function audit(actor: WorkflowActor, action: string, entity: string, message: string): WorkflowAudit {
  return {
    id: id("AUD"),
    actor,
    action,
    entity,
    message,
    createdAt: now()
  };
}

export function getBuyerFacingOrderMessage(order?: WorkflowOrder) {
  if (!order) return "ยังไม่มี Order";

  if (order.status === "WAITING_PLATFORM_FEE") {
    return "Supplier อยู่ระหว่างยืนยันการเริ่มงานผ่านระบบ";
  }

  if (order.status === "IN_PROGRESS") {
    return "Supplier เริ่มดำเนินงานแล้ว สามารถติดตามความคืบหน้าในระบบได้";
  }

  if (order.status === "COMPLETED") {
    return "Order เสร็จสมบูรณ์แล้ว สามารถรีวิว Supplier ได้";
  }

  return "ระบบจะแจ้งขั้นตอนถัดไปเมื่อสถานะเปลี่ยนแปลง";
}

export function createInitialWorkflowState(): WorkflowState {
  const createdAt = now();
  return {
    rfqs: [
      {
        id: "RFQ-DEMO-0001",
        title: "ผลิตสกินแคร์ 3,000 ชิ้น พร้อมฉลากและกล่อง",
        category: "สกินแคร์และบรรจุภัณฑ์",
        quantity: 3000,
        budget: 165000,
        status: "SUBMITTED",
        buyerName: "Buyer Demo Co., Ltd.",
        createdAt
      }
    ],
    quotes: [],
    orders: [],
    payments: [],
    platformFees: [],
    reviews: [],
    audits: [
      audit("BUYER", "RFQ_SUBMITTED", "RFQ-DEMO-0001", "Buyer ส่ง RFQ เข้าระบบเพื่อรอ Supplier เสนอราคา")
    ]
  };
}

export function createRfq(state: WorkflowState, input?: Partial<WorkflowRfq>): WorkflowState {
  const rfq: WorkflowRfq = {
    id: id("RFQ"),
    title: input?.title ?? "ผลิตสินค้า OEM พร้อมบรรจุภัณฑ์",
    category: input?.category ?? "OEM / ODM",
    quantity: input?.quantity ?? 1000,
    budget: input?.budget ?? 100000,
    status: "SUBMITTED",
    buyerName: input?.buyerName ?? "Buyer Demo Co., Ltd.",
    createdAt: now()
  };

  return {
    ...state,
    rfqs: [rfq, ...state.rfqs],
    audits: [audit("BUYER", "RFQ_SUBMITTED", rfq.id, "Buyer สร้าง RFQ ใหม่และส่งให้ Supplier พิจารณา"), ...state.audits]
  };
}

export function sendQuote(state: WorkflowState, rfqId: string): WorkflowState {
  const rfq = state.rfqs.find((item) => item.id === rfqId);
  if (!rfq) return state;

  const quote: WorkflowQuote = {
    id: id("Q"),
    rfqId,
    supplierName: state.quotes.length % 2 === 0 ? "Premium Factory Co., Ltd." : "Green Manufacturing",
    totalAmount: Math.round(rfq.budget * (state.quotes.length % 2 === 0 ? 0.96 : 1.04)),
    moq: Math.max(500, Math.round(rfq.quantity / 2)),
    leadTimeDays: state.quotes.length % 2 === 0 ? 18 : 24,
    paymentTerm: "DEPOSIT_FINAL",
    status: "SENT",
    note: "รวมผลิตสินค้า บรรจุภัณฑ์ และตรวจคุณภาพก่อนส่งมอบ",
    createdAt: now()
  };

  return {
    ...state,
    rfqs: state.rfqs.map((item) => (item.id === rfqId ? { ...item, status: "QUOTING" } : item)),
    quotes: [quote, ...state.quotes],
    audits: [audit("SUPPLIER", "QUOTE_SENT", quote.id, `${quote.supplierName} ส่ง Quote ให้ ${rfq.id}`), ...state.audits]
  };
}

export function acceptQuote(state: WorkflowState, quoteId: string): WorkflowState {
  const quote = state.quotes.find((item) => item.id === quoteId);
  const rfq = quote ? state.rfqs.find((item) => item.id === quote.rfqId) : undefined;
  if (!quote || !rfq || state.orders.some((order) => order.quoteId === quoteId)) return state;

  const order: WorkflowOrder = {
    id: id("ORD"),
    rfqId: rfq.id,
    quoteId,
    buyerName: rfq.buyerName,
    supplierName: quote.supplierName,
    totalAmount: quote.totalAmount,
    paymentTerm: quote.paymentTerm,
    status: "WAITING_BUYER_PAYMENT",
    buyerPaymentReported: false,
    supplierPaymentConfirmed: false,
    platformFeeStatus: "PENDING",
    progress: 12,
    createdAt: now()
  };

  return {
    ...state,
    rfqs: state.rfqs.map((item) => (item.id === rfq.id ? { ...item, status: "ORDER_CREATED" } : item)),
    quotes: state.quotes.map((item) => ({
      ...item,
      status: item.id === quoteId ? "ACCEPTED" : item.rfqId === quote.rfqId ? "DECLINED" : item.status
    })),
    orders: [order, ...state.orders],
    audits: [audit("BUYER", "QUOTE_ACCEPTED", quote.id, `Buyer accept Quote และระบบสร้าง Order ${order.id}`), ...state.audits]
  };
}

export function reportBuyerPayment(state: WorkflowState, orderId: string): WorkflowState {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return state;

  const payment: WorkflowPayment = {
    id: id("PAY"),
    orderId,
    direction: "BUYER_TO_SUPPLIER",
    amount: order.paymentTerm === "DEPOSIT_FINAL" ? Math.round(order.totalAmount / 2) : order.totalAmount,
    status: "REPORTED",
    note: "Buyer แจ้งชำระเงินให้ Supplier โดยตรง",
    createdAt: now()
  };

  return {
    ...state,
    orders: state.orders.map((item) =>
      item.id === orderId
        ? { ...item, buyerPaymentReported: true, status: "BUYER_PAYMENT_REPORTED", progress: 24 }
        : item
    ),
    payments: [payment, ...state.payments],
    audits: [audit("BUYER", "BUYER_PAYMENT_REPORTED", orderId, "Buyer แจ้งหลักฐานการชำระเงินให้ Supplier"), ...state.audits]
  };
}

export function confirmBuyerPayment(state: WorkflowState, orderId: string): WorkflowState {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return state;

  const platformFee: WorkflowPlatformFee = {
    id: id("FEE"),
    orderId,
    feeBaseAmount: order.totalAmount,
    feeRate: 0.1,
    feeTotal: Math.round(order.totalAmount * 0.1),
    status: "WAITING_PAYMENT",
    createdAt: now()
  };

  return {
    ...state,
    orders: state.orders.map((item) =>
      item.id === orderId
        ? {
            ...item,
            supplierPaymentConfirmed: true,
            status: "WAITING_PLATFORM_FEE",
            platformFeeStatus: "WAITING_PAYMENT",
            progress: 38
          }
        : item
    ),
    payments: state.payments.map((payment) =>
      payment.orderId === orderId && payment.direction === "BUYER_TO_SUPPLIER"
        ? { ...payment, status: "CONFIRMED_BY_SUPPLIER" }
        : payment
    ),
    platformFees: state.platformFees.some((fee) => fee.orderId === orderId)
      ? state.platformFees
      : [platformFee, ...state.platformFees],
    audits: [audit("SUPPLIER", "BUYER_PAYMENT_CONFIRMED", orderId, "Supplier ยืนยันรับเงินจาก Buyer แล้ว ระบบสร้าง Order Activation Fee"), ...state.audits]
  };
}

export function reportPlatformFeePayment(state: WorkflowState, orderId: string): WorkflowState {
  const fee = state.platformFees.find((item) => item.orderId === orderId);
  if (!fee) return state;

  const payment: WorkflowPayment = {
    id: id("PAY"),
    orderId,
    direction: "SUPPLIER_TO_PLATFORM",
    amount: fee.feeTotal,
    status: "REPORTED",
    note: "Supplier แจ้งชำระ Order Activation Fee",
    createdAt: now()
  };

  return {
    ...state,
    platformFees: state.platformFees.map((item) =>
      item.orderId === orderId ? { ...item, status: "PAID" } : item
    ),
    orders: state.orders.map((order) =>
      order.id === orderId ? { ...order, platformFeeStatus: "PAID", status: "PLATFORM_FEE_PAID", progress: 52 } : order
    ),
    payments: [payment, ...state.payments],
    audits: [audit("SUPPLIER", "PLATFORM_FEE_REPORTED", orderId, "Supplier แจ้งชำระ Order Activation Fee ให้ Platform"), ...state.audits]
  };
}

export function verifyPlatformFee(state: WorkflowState, orderId: string): WorkflowState {
  return {
    ...state,
    orders: state.orders.map((order) =>
      order.id === orderId ? { ...order, status: "IN_PROGRESS", progress: 68 } : order
    ),
    payments: state.payments.map((payment) =>
      payment.orderId === orderId && payment.direction === "SUPPLIER_TO_PLATFORM"
        ? { ...payment, status: "VERIFIED_BY_ADMIN" }
        : payment
    ),
    audits: [audit("ADMIN", "PLATFORM_FEE_VERIFIED", orderId, "Admin ตรวจสอบ Order Activation Fee แล้ว Order เริ่มงานได้"), ...state.audits]
  };
}

export function markReadyForReview(state: WorkflowState, orderId: string): WorkflowState {
  return {
    ...state,
    orders: state.orders.map((order) =>
      order.id === orderId ? { ...order, status: "READY_FOR_REVIEW", progress: 88 } : order
    ),
    audits: [audit("SUPPLIER", "READY_FOR_REVIEW", orderId, "Supplier ส่งมอบงานและรอ Buyer ตรวจรับ"), ...state.audits]
  };
}

export function completeOrder(state: WorkflowState, orderId: string): WorkflowState {
  return {
    ...state,
    orders: state.orders.map((order) =>
      order.id === orderId ? { ...order, status: "COMPLETED", progress: 100 } : order
    ),
    audits: [audit("BUYER", "ORDER_COMPLETED", orderId, "Buyer ตรวจรับงานและปิด Order สำเร็จ"), ...state.audits]
  };
}

export function createReview(state: WorkflowState, orderId: string): WorkflowState {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order || order.status !== "COMPLETED" || state.reviews.some((review) => review.orderId === orderId)) {
    return state;
  }

  const review: WorkflowReview = {
    id: id("REV"),
    orderId,
    rating: 5,
    comment: "งานเรียบร้อย ติดตามสถานะในระบบได้ดี และส่งมอบตามที่ตกลง",
    createdAt: now()
  };

  return {
    ...state,
    reviews: [review, ...state.reviews],
    audits: [audit("BUYER", "REVIEW_CREATED", orderId, "Buyer รีวิว Supplier หลัง Order เสร็จสมบูรณ์"), ...state.audits]
  };
}

export const roleLabels: Record<UserRole, string> = {
  VISITOR: "Visitor",
  BUYER: "Buyer",
  SUPPLIER: "Supplier",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin"
};

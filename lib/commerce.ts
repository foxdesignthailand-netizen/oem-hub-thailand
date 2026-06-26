export type PaymentTerm = "FULL_100" | "DEPOSIT_FINAL";

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

export type PlatformFeeStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "WAITING_PAYMENT"
  | "PAID"
  | "OVERDUE"
  | "WAIVED"
  | "FAILED";

export type BuyerPaymentStatus =
  | "NOT_REPORTED"
  | "REPORTED"
  | "CONFIRMED_BY_SUPPLIER"
  | "REJECTED";

export type BuyerPaymentType = "FULL" | "DEPOSIT" | "FINAL";

export type SupplierVerificationLevel =
  | "REGISTERED"
  | "BASIC_VERIFIED"
  | "BUSINESS_VERIFIED"
  | "PREMIUM_VERIFIED"
  | "SUSPENDED";

export type SupplierPlanType = "FREE" | "STARTER" | "PRO" | "PREMIUM";

export type PlatformFee = {
  id: string;
  orderId: string;
  supplierId: string;
  feeBaseAmount: number;
  feeRate: number;
  feeFixedAmount: number;
  feeTotal: number;
  status: Exclude<PlatformFeeStatus, "NOT_REQUIRED">;
  dueAt: string;
  paidAt?: string;
  verifiedByAdminId?: string;
  paymentProofId?: string;
};

export type BuyerPaymentRecord = {
  id: string;
  orderId: string;
  payerBuyerId: string;
  receiverSupplierId: string;
  amount: number;
  paymentType: BuyerPaymentType;
  transferDate: string;
  proofImage: string;
  confirmedBySupplierAt?: string;
  status: BuyerPaymentStatus;
};

export type MarketplaceOrder = {
  id: string;
  rfqId: string;
  quoteId: string;
  buyerId: string;
  buyerName: string;
  supplierId: string;
  supplierName: string;
  title: string;
  paymentTerm: PaymentTerm;
  totalAmount: number;
  depositAmount: number;
  finalAmount: number;
  buyerPaymentStatus: BuyerPaymentStatus;
  platformFeeStatus: PlatformFeeStatus;
  orderStatus: OrderStatus;
  activationFeeDueAt: string;
  progress: number;
  buyerFacingMessage: string;
};

export type SupplierReliabilityScore = {
  supplierId: string;
  completedOrderCount: number;
  platformFeePaymentRate: number;
  onTimeDeliveryRate: number;
  reviewAverage: number;
  disputeRate: number;
  cancellationRate: number;
  responseScore: number;
  rankingScore: number;
};

export type BuyerReliabilityScore = {
  buyerId: string;
  completedOrderCount: number;
  paymentReliabilityRate: number;
  cancellationRate: number;
  disputeRate: number;
  responseScore: number;
  totalPurchaseAmount: number;
  rankingScore: number;
};

export type SupplierVerification = {
  supplierId: string;
  level: SupplierVerificationLevel;
  submittedDocuments: string[];
  verifiedAt?: string;
  verifiedByAdminId?: string;
  note: string;
};

export type SupplierPlan = {
  supplierId: string;
  planType: SupplierPlanType;
  serviceListingLimit: number;
  activeUntil?: string;
  usedServiceSlots: number;
  extraServiceSlots: number;
  featuredListing: boolean;
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  QUOTE_ACCEPTED: "รับใบเสนอราคาแล้ว",
  WAITING_BUYER_PAYMENT: "รอผู้ซื้อชำระเงินให้ Supplier",
  BUYER_PAYMENT_REPORTED: "ผู้ซื้อแจ้งชำระเงินแล้ว",
  WAITING_SUPPLIER_PAYMENT_CONFIRMATION: "รอ Supplier ยืนยันยอดรับเงิน",
  WAITING_PLATFORM_FEE: "รอชำระ Order Activation Fee",
  PLATFORM_FEE_PAID: "ชำระ Activation Fee แล้ว",
  IN_PROGRESS: "กำลังดำเนินงาน",
  READY_FOR_REVIEW: "พร้อมให้ตรวจรับ",
  DELIVERED: "ส่งมอบแล้ว",
  COMPLETED: "เสร็จสมบูรณ์",
  CANCELLED: "ยกเลิก",
  DISPUTED: "มีข้อพิพาท"
};

export const platformFeeStatusLabels: Record<PlatformFeeStatus, string> = {
  NOT_REQUIRED: "ยังไม่ต้องชำระ",
  PENDING: "รอสร้างรายการ",
  WAITING_PAYMENT: "รอ Supplier ชำระ",
  PAID: "ชำระแล้ว",
  OVERDUE: "เกินกำหนด",
  WAIVED: "ยกเว้นค่าธรรมเนียม",
  FAILED: "ชำระไม่สำเร็จ"
};

export const paymentTermLabels: Record<PaymentTerm, string> = {
  FULL_100: "จ่ายเต็ม 100%",
  DEPOSIT_FINAL: "มัดจำ / งวดสุดท้าย"
};

export const marketplaceOrders: MarketplaceOrder[] = [
  {
    id: "ORD-2024-0089",
    rfqId: "RFQ-2024-00089",
    quoteId: "Q-2024-0587",
    buyerId: "BUY-001",
    buyerName: "Buyer Company Co., Ltd.",
    supplierId: "SUP-001",
    supplierName: "Precision Part Co., Ltd.",
    title: "ชิ้นส่วน Machined Part งาน CNC",
    paymentTerm: "DEPOSIT_FINAL",
    totalAmount: 712500,
    depositAmount: 356250,
    finalAmount: 356250,
    buyerPaymentStatus: "CONFIRMED_BY_SUPPLIER",
    platformFeeStatus: "WAITING_PAYMENT",
    orderStatus: "WAITING_PLATFORM_FEE",
    activationFeeDueAt: "21 พ.ค. 2567 18:00",
    progress: 35,
    buyerFacingMessage: "Supplier อยู่ระหว่างยืนยันการเริ่มงานผ่านระบบ"
  },
  {
    id: "ORD-2024-0090",
    rfqId: "RFQ-2024-00090",
    quoteId: "Q-2024-0591",
    buyerId: "BUY-002",
    buyerName: "AutoMax Co., Ltd.",
    supplierId: "SUP-002",
    supplierName: "Thai Manufacturing Solution Ltd.",
    title: "Aluminum Bracket Assembly",
    paymentTerm: "FULL_100",
    totalAmount: 230000,
    depositAmount: 230000,
    finalAmount: 0,
    buyerPaymentStatus: "CONFIRMED_BY_SUPPLIER",
    platformFeeStatus: "PAID",
    orderStatus: "IN_PROGRESS",
    activationFeeDueAt: "20 พ.ค. 2567 18:00",
    progress: 62,
    buyerFacingMessage: "Supplier เริ่มดำเนินงานแล้ว"
  },
  {
    id: "ORD-2024-0091",
    rfqId: "RFQ-2024-00091",
    quoteId: "Q-2024-0594",
    buyerId: "BUY-003",
    buyerName: "Siam Motors",
    supplierId: "SUP-003",
    supplierName: "Smart Part Technology Co., Ltd.",
    title: "แผ่นโลหะพับขึ้นรูป",
    paymentTerm: "DEPOSIT_FINAL",
    totalAmount: 180000,
    depositAmount: 90000,
    finalAmount: 90000,
    buyerPaymentStatus: "CONFIRMED_BY_SUPPLIER",
    platformFeeStatus: "OVERDUE",
    orderStatus: "WAITING_PLATFORM_FEE",
    activationFeeDueAt: "19 พ.ค. 2567 18:00",
    progress: 25,
    buyerFacingMessage: "Supplier อยู่ระหว่างยืนยันการเริ่มงานผ่านระบบ"
  }
];

export const platformFees: PlatformFee[] = [
  {
    id: "FEE-2024-0089",
    orderId: "ORD-2024-0089",
    supplierId: "SUP-001",
    feeBaseAmount: 712500,
    feeRate: 0.1,
    feeFixedAmount: 0,
    feeTotal: 71250,
    status: "WAITING_PAYMENT",
    dueAt: "21 พ.ค. 2567 18:00"
  },
  {
    id: "FEE-2024-0090",
    orderId: "ORD-2024-0090",
    supplierId: "SUP-002",
    feeBaseAmount: 230000,
    feeRate: 0.1,
    feeFixedAmount: 0,
    feeTotal: 23000,
    status: "PAID",
    dueAt: "20 พ.ค. 2567 18:00",
    paidAt: "20 พ.ค. 2567 15:24",
    verifiedByAdminId: "ADM-001",
    paymentProofId: "PAYPROOF-771"
  },
  {
    id: "FEE-2024-0091",
    orderId: "ORD-2024-0091",
    supplierId: "SUP-003",
    feeBaseAmount: 180000,
    feeRate: 0.1,
    feeFixedAmount: 0,
    feeTotal: 18000,
    status: "OVERDUE",
    dueAt: "19 พ.ค. 2567 18:00"
  }
];

export const buyerPaymentRecords: BuyerPaymentRecord[] = [
  {
    id: "BPR-2024-1101",
    orderId: "ORD-2024-0089",
    payerBuyerId: "BUY-001",
    receiverSupplierId: "SUP-001",
    amount: 356250,
    paymentType: "DEPOSIT",
    transferDate: "20 พ.ค. 2567",
    proofImage: "deposit-slip-0089.jpg",
    confirmedBySupplierAt: "20 พ.ค. 2567 13:18",
    status: "CONFIRMED_BY_SUPPLIER"
  },
  {
    id: "BPR-2024-1102",
    orderId: "ORD-2024-0090",
    payerBuyerId: "BUY-002",
    receiverSupplierId: "SUP-002",
    amount: 230000,
    paymentType: "FULL",
    transferDate: "20 พ.ค. 2567",
    proofImage: "full-slip-0090.jpg",
    confirmedBySupplierAt: "20 พ.ค. 2567 11:40",
    status: "CONFIRMED_BY_SUPPLIER"
  }
];

export const supplierReliabilityScores: SupplierReliabilityScore[] = [
  {
    supplierId: "SUP-001",
    completedOrderCount: 128,
    platformFeePaymentRate: 96,
    onTimeDeliveryRate: 94,
    reviewAverage: 4.8,
    disputeRate: 1.8,
    cancellationRate: 2.4,
    responseScore: 91,
    rankingScore: 92
  },
  {
    supplierId: "SUP-003",
    completedOrderCount: 64,
    platformFeePaymentRate: 72,
    onTimeDeliveryRate: 88,
    reviewAverage: 4.5,
    disputeRate: 4.8,
    cancellationRate: 5.1,
    responseScore: 78,
    rankingScore: 74
  }
];

export const buyerReliabilityScores: BuyerReliabilityScore[] = [
  {
    buyerId: "BUY-001",
    completedOrderCount: 24,
    paymentReliabilityRate: 98,
    cancellationRate: 1.2,
    disputeRate: 0.8,
    responseScore: 89,
    totalPurchaseAmount: 2450000,
    rankingScore: 94
  },
  {
    buyerId: "BUY-002",
    completedOrderCount: 12,
    paymentReliabilityRate: 91,
    cancellationRate: 4.2,
    disputeRate: 2.1,
    responseScore: 82,
    totalPurchaseAmount: 870000,
    rankingScore: 86
  }
];

export const supplierVerifications: SupplierVerification[] = [
  {
    supplierId: "SUP-001",
    level: "BUSINESS_VERIFIED",
    submittedDocuments: ["หนังสือรับรองบริษัท", "ภ.พ.20", "Portfolio งานจริง"],
    verifiedAt: "12 พ.ค. 2567",
    verifiedByAdminId: "ADM-001",
    note: "เอกสารธุรกิจครบถ้วน รอมาตรฐานเพิ่มเติมสำหรับ Premium"
  },
  {
    supplierId: "SUP-003",
    level: "BASIC_VERIFIED",
    submittedDocuments: ["ยืนยันอีเมล", "ยืนยันเบอร์โทร"],
    verifiedAt: "18 พ.ค. 2567",
    verifiedByAdminId: "ADM-002",
    note: "ยังไม่ได้ส่งเอกสารธุรกิจ"
  }
];

export const supplierPlans: SupplierPlan[] = [
  {
    supplierId: "SUP-001",
    planType: "FREE",
    serviceListingLimit: 8,
    usedServiceSlots: 6,
    extraServiceSlots: 0,
    featuredListing: false
  },
  {
    supplierId: "SUP-002",
    planType: "PRO",
    serviceListingLimit: 30,
    activeUntil: "30 มิ.ย. 2567",
    usedServiceSlots: 18,
    extraServiceSlots: 5,
    featuredListing: true
  }
];

export function calculatePlatformFee(totalAmount: number, feeRate = 0.1, fixedAmount = 0) {
  return Math.round(totalAmount * feeRate + fixedAmount);
}

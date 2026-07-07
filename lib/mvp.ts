import type { UserRole } from "@/lib/supabase/types";

export type MvpFeatureId =
  | "auth"
  | "rfq"
  | "quote"
  | "order"
  | "payment"
  | "deal_room"
  | "review"
  | "admin"
  | "supplier_self_service"
  | "files";

export type MvpFeatureStatus = "demo_ready" | "supabase_ready" | "next_backend";

export const mvpRoles: { role: UserRole; title: string; description: string }[] = [
  {
    role: "VISITOR",
    title: "Visitor",
    description: "ดูตลาด ค้นหา Supplier และเริ่ม RFQ ได้"
  },
  {
    role: "BUYER",
    title: "Buyer",
    description: "สร้าง RFQ เปรียบเทียบ Quote เปิด Order และรีวิวหลังจบงาน"
  },
  {
    role: "SUPPLIER",
    title: "Supplier",
    description: "รับ RFQ เสนอราคา ยืนยันรับเงิน และอัปเดตงานผลิต"
  },
  {
    role: "ADMIN",
    title: "Admin",
    description: "ตรวจสอบการชำระเงิน อนุมัติ Supplier และดูแลความเรียบร้อย"
  },
  {
    role: "SUPER_ADMIN",
    title: "Super Admin",
    description: "ตั้งค่ากฎระบบ สิทธิ์ผู้ใช้ ค่าธรรมเนียม และ audit"
  }
];

export const mvpFeatureChecklist: {
  id: MvpFeatureId;
  title: string;
  owner: string;
  status: MvpFeatureStatus;
  summary: string;
}[] = [
  {
    id: "auth",
    title: "Authentication / Role",
    owner: "ทุกบทบาท",
    status: "demo_ready",
    summary: "มี role switcher สำหรับทดสอบ UX ก่อนต่อ Supabase Auth จริง"
  },
  {
    id: "rfq",
    title: "RFQ",
    owner: "Buyer",
    status: "demo_ready",
    summary: "สร้าง RFQ และเก็บ state เพื่อให้ Supplier เสนอราคาได้ต่อเนื่อง"
  },
  {
    id: "quote",
    title: "Quote",
    owner: "Supplier",
    status: "demo_ready",
    summary: "Supplier ส่งใบเสนอราคาให้ RFQ และ Buyer เห็นเพื่อเปรียบเทียบ"
  },
  {
    id: "order",
    title: "Accept Quote / Order",
    owner: "Buyer",
    status: "demo_ready",
    summary: "Order เกิดจาก Quote ที่ Buyer accept เท่านั้น"
  },
  {
    id: "payment",
    title: "Manual Payment Verification",
    owner: "Supplier + Admin",
    status: "demo_ready",
    summary: "Buyer แจ้งชำระตรงให้ Supplier, Supplier ยืนยัน, Admin ตรวจ Activation Fee"
  },
  {
    id: "deal_room",
    title: "Deal Room / Timeline",
    owner: "Buyer + Supplier",
    status: "demo_ready",
    summary: "ติดตามสถานะงานผลิต ความคืบหน้า ข้อความ และไฟล์สำคัญ"
  },
  {
    id: "review",
    title: "Completed Order Review",
    owner: "Buyer",
    status: "demo_ready",
    summary: "สร้างรีวิวได้เฉพาะ Order ที่เป็น COMPLETED แล้วเท่านั้น"
  },
  {
    id: "admin",
    title: "Admin Backend",
    owner: "Admin",
    status: "demo_ready",
    summary: "รวมคิวอนุมัติ Supplier, ตรวจ payment, dispute, review และ audit"
  },
  {
    id: "supplier_self_service",
    title: "Supplier Self-Service",
    owner: "Supplier",
    status: "demo_ready",
    summary: "จัดการโปรไฟล์ บริษัท บริการ โลโก้ แบนเนอร์ และเอกสารมาตรฐาน"
  },
  {
    id: "files",
    title: "File Upload / Storage",
    owner: "ทุกบทบาท",
    status: "supabase_ready",
    summary: "เตรียม bucket ตาม workflow แล้ว เหลือต่อ UI upload กับ RLS จริง"
  }
];

export const mvpStorageBuckets = [
  {
    name: "public-assets",
    visibility: "public",
    owner: "Admin",
    useCase: "รูป banner, landing page, blog และ asset สาธารณะ"
  },
  {
    name: "supplier-media",
    visibility: "protected",
    owner: "Supplier",
    useCase: "โลโก้ แบนเนอร์ รูปโรงงาน และรูป service listing"
  },
  {
    name: "rfq-attachments",
    visibility: "private",
    owner: "Buyer",
    useCase: "ไฟล์บรีฟสินค้า reference spec และเอกสารประกอบ RFQ"
  },
  {
    name: "quote-attachments",
    visibility: "private",
    owner: "Supplier",
    useCase: "ใบเสนอราคา ไฟล์สเปก เงื่อนไขผลิต และเอกสารแนบ Quote"
  },
  {
    name: "order-documents",
    visibility: "private",
    owner: "Buyer + Supplier",
    useCase: "หลักฐานชำระเงิน เอกสาร PO ใบกำกับ และไฟล์ส่งมอบ"
  },
  {
    name: "admin-documents",
    visibility: "admin",
    owner: "Admin",
    useCase: "เอกสารตรวจสอบ payment, dispute และ compliance"
  }
];

export const supplierSelfServiceItems = [
  "แก้ไขข้อมูลบริษัท โลโก้ แบนเนอร์ และคำอธิบายร้าน",
  "เพิ่ม/แก้ไขบริการ OEM, บรรจุภัณฑ์, งานพิมพ์ หรือเอกสารมาตรฐาน",
  "อัปโหลดใบรับรอง GMP, ISO, อย. และเอกสารยืนยันตัวตน",
  "ตั้งค่า MOQ, lead time, จังหวัด, หมวดหมู่ และตัวอย่างผลงาน",
  "ดู RFQ ที่ตรงกับความสามารถและส่ง Quote จาก dashboard"
];

export const adminOperationItems = [
  "อนุมัติ Supplier และเอกสารยืนยันตัวตน",
  "ตรวจสอบหลักฐาน Order Activation Fee จาก Supplier",
  "ตั้งค่า commission / activation fee rule แบบ configurable",
  "จัดการ dispute, report, review และ audit log",
  "ดูภาพรวม RFQ, Quote, Order, Payment และ storage usage"
];

export const mvpFileExamples = [
  {
    fileName: "product-brief-skincare.pdf",
    bucket: "rfq-attachments",
    owner: "Buyer",
    status: "พร้อมแนบ RFQ"
  },
  {
    fileName: "quotation-premium-factory.pdf",
    bucket: "quote-attachments",
    owner: "Supplier",
    status: "พร้อมส่ง Quote"
  },
  {
    fileName: "payment-slip-order-001.jpg",
    bucket: "order-documents",
    owner: "Buyer",
    status: "รอ Supplier/Admin ตรวจ"
  },
  {
    fileName: "gmp-certificate.pdf",
    bucket: "supplier-media",
    owner: "Supplier",
    status: "รอ Admin อนุมัติ"
  }
];

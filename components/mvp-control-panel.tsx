"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileText,
  FolderOpen,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Upload
} from "lucide-react";
import {
  adminOperationItems,
  mvpFeatureChecklist,
  mvpFileExamples,
  mvpRoles,
  mvpStorageBuckets,
  supplierSelfServiceItems
} from "@/lib/mvp";
import type { Json, UserRole } from "@/lib/supabase/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  acceptQuote,
  completeOrder,
  confirmBuyerPayment,
  createInitialWorkflowState,
  createReview,
  createRfq,
  getBuyerFacingOrderMessage,
  markReadyForReview,
  reportBuyerPayment,
  reportPlatformFeePayment,
  sendQuote,
  verifyPlatformFee,
  workflowStorageKey,
  type WorkflowState
} from "@/lib/workflow";
import { formatBaht } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type MvpMode = "full" | "auth" | "deal" | "files" | "supplier" | "admin";
type RpcName =
  | "oem_create_demo_rfq"
  | "oem_send_demo_quote"
  | "oem_accept_demo_quote"
  | "oem_report_demo_buyer_payment"
  | "oem_confirm_demo_buyer_payment"
  | "oem_report_demo_platform_fee"
  | "oem_verify_demo_platform_fee"
  | "oem_complete_demo_order"
  | "oem_create_demo_review";

const roleStorageKey = "oem-hub-demo-role";

const modeCopy: Record<MvpMode, { eyebrow: string; title: string; description: string; image: string }> = {
  full: {
    eyebrow: "MVP Control Center",
    title: "ศูนย์ทดสอบระบบ OEM Hub ตั้งแต่ RFQ ถึง Review",
    description:
      "ใช้หน้านี้เช็คภาพรวมข้อ 1-10 แบบรวดเดียว: role, RFQ, Quote, Order, manual payment, deal room, review, admin, supplier self-service และ storage",
    image: "/images/workflow-console-hero.png"
  },
  auth: {
    eyebrow: "Authentication & Role",
    title: "จำลองการเข้าใช้งานตามบทบาท ก่อนต่อ Supabase Auth เต็มรูปแบบ",
    description:
      "เลือกบทบาทเพื่อดูว่า Buyer, Supplier, Admin และ Super Admin ควรเห็นงานและปุ่มสำคัญต่างกันอย่างไร",
    image: "/images/oem-hero-marketplace.png"
  },
  deal: {
    eyebrow: "Deal Room",
    title: "ห้องงานกลางสำหรับติดตามดีลผลิต",
    description:
      "หลัง Buyer accept quote ระบบจะมี order timeline, payment status, ไฟล์ และข้อความสำคัญอยู่ในที่เดียว",
    image: "/images/order-timeline-illustration.png"
  },
  files: {
    eyebrow: "File Upload / Storage",
    title: "โครงสร้างไฟล์สำหรับ RFQ, Quote, Order และ Admin",
    description:
      "แยก bucket ตามสิทธิ์การมองเห็น เพื่อเตรียมต่อ upload + RLS จริงบน Supabase Storage",
    image: "/images/payment-verification-illustration.png"
  },
  supplier: {
    eyebrow: "Supplier Self-Service",
    title: "พื้นที่ให้ Supplier จัดการร้าน บริการ และเอกสารเอง",
    description:
      "Supplier ควรจัดการโปรไฟล์ โลโก้ แบนเนอร์ service listing เอกสารมาตรฐาน และ RFQ ที่ตรงกับความสามารถได้เอง",
    image: "/images/supplier-dashboard-hero.png"
  },
  admin: {
    eyebrow: "Admin Backend",
    title: "ศูนย์ดูแลแพลตฟอร์มสำหรับอนุมัติ ตรวจสอบ และกำกับระบบ",
    description:
      "Admin ต้องเห็นคิวอนุมัติ Supplier, payment verification, commission rule, dispute, review และ audit โดยไม่เปิดเผย Platform Fee ให้ Buyer",
    image: "/images/admin-dashboard-hero.png"
  }
};

const rpcSteps: { name: RpcName; label: string; role: UserRole }[] = [
  { name: "oem_create_demo_rfq", label: "1. สร้าง RFQ ใน Supabase", role: "BUYER" },
  { name: "oem_send_demo_quote", label: "2. Supplier ส่ง Quote", role: "SUPPLIER" },
  { name: "oem_accept_demo_quote", label: "3. Buyer accept Quote", role: "BUYER" },
  { name: "oem_report_demo_buyer_payment", label: "4. Buyer แจ้งชำระเงิน", role: "BUYER" },
  { name: "oem_confirm_demo_buyer_payment", label: "5. Supplier ยืนยันรับเงิน", role: "SUPPLIER" },
  { name: "oem_report_demo_platform_fee", label: "6. Supplier แจ้ง Activation Fee", role: "SUPPLIER" },
  { name: "oem_verify_demo_platform_fee", label: "7. Admin verify fee", role: "ADMIN" },
  { name: "oem_complete_demo_order", label: "8. ปิด Order", role: "BUYER" },
  { name: "oem_create_demo_review", label: "9. รีวิวหลังจบงาน", role: "BUYER" }
];

function loadWorkflowState() {
  if (typeof window === "undefined") return createInitialWorkflowState();

  const raw = window.localStorage.getItem(workflowStorageKey);
  if (!raw) return createInitialWorkflowState();

  try {
    return JSON.parse(raw) as WorkflowState;
  } catch {
    return createInitialWorkflowState();
  }
}

function saveWorkflowState(state: WorkflowState) {
  window.localStorage.setItem(workflowStorageKey, JSON.stringify(state));
}

function statusTone(status: string) {
  if (status.includes("COMPLETED") || status.includes("ACCEPTED") || status.includes("APPROVED")) return "green";
  if (status.includes("WAITING") || status.includes("REPORTED") || status.includes("PENDING")) return "orange";
  if (status.includes("DECLINED") || status.includes("REJECTED") || status.includes("FAILED")) return "red";
  return "blue";
}

function featureStatusLabel(status: string) {
  if (status === "demo_ready") return "Demo ใช้งานได้";
  if (status === "supabase_ready") return "Supabase-ready";
  return "รอต่อ backend";
}

export function MvpControlPanel({ mode = "full" }: { mode?: MvpMode }) {
  const [state, setState] = useState<WorkflowState>(() => createInitialWorkflowState());
  const [role, setRole] = useState<UserRole>("BUYER");
  const [lastAction, setLastAction] = useState("พร้อมทดสอบ workflow");
  const [rpcBusy, setRpcBusy] = useState<RpcName | null>(null);
  const [rpcResult, setRpcResult] = useState<string>("ยังไม่ได้เรียก Supabase RPC");

  useEffect(() => {
    setState(loadWorkflowState());
    const storedRole = window.localStorage.getItem(roleStorageKey) as UserRole | null;
    if (storedRole) setRole(storedRole);
  }, []);

  const latestRfq = state.rfqs[0];
  const sentQuote = state.quotes.find((quote) => quote.status === "SENT");
  const acceptedQuote = state.quotes.find((quote) => quote.status === "ACCEPTED");
  const latestOrder = state.orders[0];
  const latestFee = latestOrder ? state.platformFees.find((fee) => fee.orderId === latestOrder.id) : undefined;
  const latestReview = latestOrder ? state.reviews.find((review) => review.orderId === latestOrder.id) : undefined;

  const metrics = useMemo(
    () => [
      { label: "RFQ", value: state.rfqs.length, icon: FileText },
      { label: "Quote", value: state.quotes.length, icon: ClipboardCheck },
      { label: "Order", value: state.orders.length, icon: PackageCheck },
      { label: "Payment", value: state.payments.length, icon: ShieldCheck },
      { label: "Review", value: state.reviews.length, icon: Star }
    ],
    [state]
  );

  const updateWorkflow = (label: string, updater: (current: WorkflowState) => WorkflowState) => {
    setState((current) => {
      const next = updater(current);
      saveWorkflowState(next);
      return next;
    });
    setLastAction(label);
  };

  const resetDemo = () => {
    const next = createInitialWorkflowState();
    saveWorkflowState(next);
    setState(next);
    setLastAction("รีเซ็ต workflow demo แล้ว");
  };

  const runFastDemo = () => {
    updateWorkflow("สร้าง flow ตัวอย่างจนพร้อมรีวิว", (current) => {
      let next = current.rfqs.length ? current : createRfq(current);
      const rfqId = next.rfqs[0]?.id;
      if (rfqId && !next.quotes.some((quote) => quote.rfqId === rfqId)) next = sendQuote(next, rfqId);
      const quoteId = next.quotes.find((quote) => quote.status === "SENT")?.id;
      if (quoteId && !next.orders.some((order) => order.quoteId === quoteId)) next = acceptQuote(next, quoteId);
      const orderId = next.orders[0]?.id;
      if (orderId) {
        next = reportBuyerPayment(next, orderId);
        next = confirmBuyerPayment(next, orderId);
        next = reportPlatformFeePayment(next, orderId);
        next = verifyPlatformFee(next, orderId);
        next = markReadyForReview(next, orderId);
        next = completeOrder(next, orderId);
      }
      return next;
    });
  };

  const runRpcStep = async (name: RpcName) => {
    const client = createSupabaseBrowserClient();
    if (!client) {
      setRpcResult("ยังไม่พบค่า Supabase URL / anon key ใน .env.local");
      return;
    }

    setRpcBusy(name);
    setRpcResult("กำลังเรียก Supabase...");
    const { data, error } = await client.rpc(name, undefined);
    setRpcBusy(null);

    if (error) {
      setRpcResult(`Supabase error: ${error.message}`);
      return;
    }

    setRpcResult(JSON.stringify(data as Json, null, 2));
  };

  const setCurrentRole = (nextRole: UserRole) => {
    setRole(nextRole);
    window.localStorage.setItem(roleStorageKey, nextRole);
  };

  return (
    <div className="space-y-6">
      <section className="grid overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-card lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <Badge className="mb-4 w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            {modeCopy[mode].eyebrow}
          </Badge>
          <h1 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
            {modeCopy[mode].title}
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{modeCopy[mode].description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={runFastDemo}>
              เดิน flow ตัวอย่าง
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={resetDemo}>
              <RefreshCw className="h-4 w-4" />
              รีเซ็ตเดโม่
            </Button>
            <Button href="/rfq/new" variant="soft">ไปสร้าง RFQ</Button>
          </div>
        </div>
        <div className="relative min-h-[280px] bg-emerald-50 lg:min-h-[380px]">
          <Image
            alt="OEM Hub Thailand MVP workflow visual"
            className="h-full w-full object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 100vw"
            src={modeCopy[mode].image}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card className="p-5" key={metric.label}>
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-light text-primary-deep">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-3xl font-black text-slate-950">{metric.value}</span>
              </div>
              <p className="mt-4 text-sm font-bold text-muted-foreground">{metric.label}</p>
            </Card>
          );
        })}
      </section>

      {(mode === "full" || mode === "auth") && (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">1. Authentication & Role</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  ตอนนี้เป็น role switcher สำหรับ UX และ permission model ก่อนเชื่อม Supabase Auth จริง
                </p>
              </div>
              <Badge tone="blue">Current role: {role}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-5">
              {mvpRoles.map((item) => (
                <button
                  className={`rounded-2xl border p-4 text-left transition ${
                    role === item.role
                      ? "border-primary bg-primary-light shadow-sm"
                      : "border-border bg-white hover:border-primary-soft hover:bg-emerald-50"
                  }`}
                  key={item.role}
                  onClick={() => setCurrentRole(item.role)}
                  type="button"
                >
                  <p className="font-black text-slate-950">{item.title}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {(mode === "full" || mode === "deal") && (
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">2-7. RFQ → Quote → Order → Payment → Review</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{lastAction}</p>
                </div>
                {latestOrder ? <Badge tone={statusTone(latestOrder.status) as any}>{latestOrder.status}</Badge> : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-bold text-primary-deep">Deal Room Status</p>
                <h3 className="mt-2 text-2xl font-black text-slate-950">
                  {latestOrder ? latestOrder.id : "ยังไม่มี Order"}
                </h3>
                <p className="mt-2 leading-7 text-muted-foreground">{getBuyerFacingOrderMessage(latestOrder)}</p>
                <div className="mt-4 h-3 rounded-full bg-white">
                  <div
                    className="h-3 rounded-full bg-primary"
                    style={{ width: `${latestOrder?.progress ?? 0}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-bold text-primary-deep">
                  ความคืบหน้า {latestOrder?.progress ?? 0}%
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ActionButton
                  disabled={!latestRfq}
                  label="Supplier ส่ง Quote"
                  onClick={() => latestRfq && updateWorkflow("Supplier ส่ง Quote แล้ว", (current) => sendQuote(current, latestRfq.id))}
                />
                <ActionButton
                  disabled={!sentQuote}
                  label="Buyer accept Quote"
                  onClick={() => sentQuote && updateWorkflow("Buyer accept Quote และสร้าง Order แล้ว", (current) => acceptQuote(current, sentQuote.id))}
                />
                <ActionButton
                  disabled={!latestOrder || latestOrder.buyerPaymentReported}
                  label="Buyer แจ้งชำระเงิน"
                  onClick={() => latestOrder && updateWorkflow("Buyer แจ้งชำระเงินตรงให้ Supplier แล้ว", (current) => reportBuyerPayment(current, latestOrder.id))}
                />
                <ActionButton
                  disabled={!latestOrder || latestOrder.supplierPaymentConfirmed || !latestOrder.buyerPaymentReported}
                  label="Supplier ยืนยันรับเงิน"
                  onClick={() => latestOrder && updateWorkflow("Supplier ยืนยันรับเงิน และระบบสร้าง Activation Fee แล้ว", (current) => confirmBuyerPayment(current, latestOrder.id))}
                />
                <ActionButton
                  disabled={!latestOrder || !latestFee || latestFee.status !== "WAITING_PAYMENT"}
                  label="Supplier แจ้ง Activation Fee"
                  onClick={() => latestOrder && updateWorkflow("Supplier แจ้งชำระ Order Activation Fee แล้ว", (current) => reportPlatformFeePayment(current, latestOrder.id))}
                />
                <ActionButton
                  disabled={!latestOrder || latestOrder.status !== "PLATFORM_FEE_PAID"}
                  label="Admin verify fee"
                  onClick={() => latestOrder && updateWorkflow("Admin ตรวจสอบ Activation Fee แล้ว", (current) => verifyPlatformFee(current, latestOrder.id))}
                />
                <ActionButton
                  disabled={!latestOrder || latestOrder.status !== "IN_PROGRESS"}
                  label="Supplier ส่งงานให้ตรวจ"
                  onClick={() => latestOrder && updateWorkflow("Supplier ส่งงานและรอ Buyer ตรวจรับ", (current) => markReadyForReview(current, latestOrder.id))}
                />
                <ActionButton
                  disabled={!latestOrder || latestOrder.status !== "READY_FOR_REVIEW"}
                  label="Buyer ปิดงาน"
                  onClick={() => latestOrder && updateWorkflow("Buyer ปิด Order เป็น COMPLETED แล้ว", (current) => completeOrder(current, latestOrder.id))}
                />
                <ActionButton
                  disabled={!latestOrder || latestOrder.status !== "COMPLETED" || Boolean(latestReview)}
                  label="Buyer รีวิว Supplier"
                  onClick={() => latestOrder && updateWorkflow("Buyer รีวิว Supplier หลัง completed order แล้ว", (current) => createReview(current, latestOrder.id))}
                />
                <ActionButton
                  label="Buyer สร้าง RFQ ใหม่"
                  onClick={() => updateWorkflow("Buyer สร้าง RFQ ใหม่แล้ว", (current) => createRfq(current))}
                />
              </div>

              <div className="grid gap-3 rounded-2xl border border-border bg-muted p-4 sm:grid-cols-3">
                <MiniRecord label="RFQ ล่าสุด" value={latestRfq?.title ?? "ยังไม่มี"} />
                <MiniRecord label="Quote ที่เลือก" value={acceptedQuote?.supplierName ?? sentQuote?.supplierName ?? "รอ Supplier"} />
                <MiniRecord label="ยอดดีล" value={latestOrder ? formatBaht(latestOrder.totalAmount) : "-"} />
              </div>
            </CardContent>
          </Card>
        )}

        {(mode === "full" || mode === "admin") && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-black">8. Admin Backend</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Admin เห็นคิวควบคุมระบบ แต่ Buyer จะไม่เห็น Platform Fee
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {adminOperationItems.map((item) => (
                <div className="flex items-start gap-3 rounded-2xl border border-border p-4" key={item}>
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold leading-6 text-slate-800">{item}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-sm font-black text-amber-800">Admin-only fee visibility</p>
                <p className="mt-1 text-sm leading-6 text-amber-800/80">
                  Activation Fee แสดงเฉพาะ Supplier/Admin ตาม BUSINESS_RULES.md ไม่แสดงในฝั่ง Buyer
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {(mode === "full" || mode === "supplier") && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-black">9. Supplier Self-Service</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              โครงหน้าและสิทธิ์ที่ Supplier ควรจัดการเองได้ เพื่อไม่ต้องให้ Admin แก้ทุกอย่าง
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="relative min-h-[240px] overflow-hidden rounded-3xl bg-emerald-50">
                <Image
                  alt="Supplier self-service illustration"
                  className="h-full w-full object-cover"
                  fill
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  src="/images/supplier-dashboard-hero.png"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {supplierSelfServiceItems.map((item) => (
                  <div className="rounded-2xl border border-border bg-white p-4" key={item}>
                    <Store className="mb-3 h-5 w-5 text-primary" />
                    <p className="text-sm font-semibold leading-6">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(mode === "full" || mode === "files") && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-black">10. File Upload / Storage</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              เตรียม bucket สำหรับไฟล์แต่ละช่วงของ workflow แล้ว รอบถัดไปต่อ upload UI + RLS policy ละเอียด
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-3">
              {mvpStorageBuckets.map((bucket) => (
                <div className="rounded-2xl border border-border p-4" key={bucket.name}>
                  <div className="flex items-center justify-between gap-3">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <Badge tone={bucket.visibility === "public" ? "green" : bucket.visibility === "admin" ? "purple" : "navy"}>
                      {bucket.visibility}
                    </Badge>
                  </div>
                  <h3 className="mt-3 font-black text-slate-950">{bucket.name}</h3>
                  <p className="mt-2 text-xs font-bold text-muted-foreground">Owner: {bucket.owner}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{bucket.useCase}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {mvpFileExamples.map((file) => (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4" key={file.fileName}>
                  <Upload className="mb-3 h-5 w-5 text-primary" />
                  <p className="break-words text-sm font-black">{file.fileName}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{file.bucket}</p>
                  <Badge className="mt-3" tone="green">{file.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Feature Governance Check</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                เช็คว่า 10 ระบบมี role, owner, สถานะ และทางไปต่อชัดเจน
              </p>
            </div>
            <Badge tone="green">
              <CheckCircle2 className="h-3.5 w-3.5" />
              10/10 mapped
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {mvpFeatureChecklist.map((feature) => (
              <div className="rounded-2xl border border-border p-4" key={feature.id}>
                <Badge tone={feature.status === "demo_ready" ? "green" : feature.status === "supabase_ready" ? "blue" : "orange"}>
                  {featureStatusLabel(feature.status)}
                </Badge>
                <h3 className="mt-3 font-black text-slate-950">{feature.title}</h3>
                <p className="mt-1 text-xs font-bold text-primary-deep">{feature.owner}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.summary}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-black">Supabase Workflow Smoke Actions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                ใช้ปุ่มนี้ทดสอบ SQL functions ที่เตรียมไว้ ถ้า migrations ยังไม่ครบ ระบบจะแจ้ง error ให้ดู
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {rpcSteps.map((step) => (
              <Button
                disabled={rpcBusy === step.name}
                key={step.name}
                onClick={() => runRpcStep(step.name)}
                variant={step.role === "ADMIN" ? "dark" : step.role === "SUPPLIER" ? "outline" : "primary"}
              >
                {rpcBusy === step.name ? "กำลังรัน..." : step.label}
              </Button>
            ))}
          </div>
          <pre className="mt-4 max-h-64 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-emerald-100">
            {rpcResult}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

function ActionButton({
  label,
  disabled,
  onClick
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button className="justify-between" disabled={disabled} onClick={onClick} variant={disabled ? "outline" : "primary"}>
      {label}
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}

function MiniRecord({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

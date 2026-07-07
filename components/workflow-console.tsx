"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Banknote,
  CheckCircle2,
  ClipboardList,
  Factory,
  FileCheck2,
  MessageSquareQuote,
  PackageCheck,
  RefreshCcw,
  ShieldCheck,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
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
  type WorkflowOrder,
  type WorkflowState
} from "@/lib/workflow";
import { formatBaht } from "@/lib/utils";

const phaseCards = [
  {
    title: "Phase 2",
    label: "RFQ",
    text: "Buyer สร้าง RFQ และส่งเข้าระบบ",
    icon: ClipboardList
  },
  {
    title: "Phase 3",
    label: "Quote",
    text: "Supplier ส่งใบเสนอราคาให้ Buyer เปรียบเทียบ",
    icon: MessageSquareQuote
  },
  {
    title: "Phase 4",
    label: "Accept Quote",
    text: "Buyer เลือก Quote แล้วระบบสร้าง Order",
    icon: FileCheck2
  },
  {
    title: "Phase 5",
    label: "Manual Payment",
    text: "Buyer จ่าย Supplier, Supplier จ่าย Activation Fee, Admin verify",
    icon: Banknote
  },
  {
    title: "Phase 6",
    label: "Complete & Review",
    text: "Supplier ส่งงาน Buyer ตรวจรับ แล้วรีวิวได้",
    icon: Star
  }
];

const guideVisuals = [
  {
    title: "เปรียบเทียบใบเสนอราคา",
    text: "Buyer เห็นราคา MOQ lead time และคะแนนรีวิว เพื่อเลือก Supplier ที่เหมาะกับดีล",
    image: "/images/quote-comparison-illustration.png"
  },
  {
    title: "ชำระเงินแบบ Manual Verification",
    text: "Buyer จ่าย Supplier โดยตรง ส่วน Supplier ชำระ Order Activation Fee เพื่อเปิดงานในระบบ",
    image: "/images/payment-verification-illustration.png"
  },
  {
    title: "ติดตามสถานะการผลิต",
    text: "หลัง Admin ตรวจสอบแล้ว Order เดินต่อเป็น IN_PROGRESS และติดตามงานได้เป็นขั้นตอน",
    image: "/images/order-timeline-illustration.png"
  },
  {
    title: "จบงานแล้วรีวิวได้",
    text: "Review เกิดจาก Completed Order เท่านั้น เพื่อให้คะแนนและความน่าเชื่อถือมาจากดีลจริง",
    image: "/images/review-completed-illustration.png"
  }
];

const orderStatusCopy: Record<string, string> = {
  WAITING_BUYER_PAYMENT: "รอ Buyer แจ้งชำระเงินให้ Supplier",
  BUYER_PAYMENT_REPORTED: "Buyer แจ้งชำระเงินแล้ว รอ Supplier ยืนยัน",
  WAITING_PLATFORM_FEE: "รอ Supplier ดำเนินการเริ่มงานผ่านระบบ",
  PLATFORM_FEE_PAID: "Supplier แจ้งชำระ Activation Fee แล้ว รอ Admin ตรวจสอบ",
  IN_PROGRESS: "กำลังดำเนินงาน",
  READY_FOR_REVIEW: "พร้อมให้ Buyer ตรวจรับ",
  COMPLETED: "เสร็จสมบูรณ์"
};

function loadState() {
  if (typeof window === "undefined") {
    return createInitialWorkflowState();
  }

  const raw = window.localStorage.getItem(workflowStorageKey);
  if (!raw) {
    return createInitialWorkflowState();
  }

  try {
    return JSON.parse(raw) as WorkflowState;
  } catch {
    return createInitialWorkflowState();
  }
}

function getLatestOrder(state: WorkflowState) {
  return state.orders[0];
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </Card>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant = "primary"
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "outline" | "soft";
}) {
  return (
    <Button className="justify-start" disabled={disabled} onClick={onClick} variant={variant}>
      {children}
    </Button>
  );
}

function BuyerVisibility({ order }: { order?: WorkflowOrder }) {
  return (
    <Card className="border-emerald-100 bg-emerald-50/50 p-5">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-1 h-6 w-6 text-primary-deep" />
        <div>
          <h2 className="text-lg font-black text-slate-950">Buyer เห็นข้อความนี้</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {getBuyerFacingOrderMessage(order)}
          </p>
          <p className="mt-3 text-xs font-bold text-primary-deep">
            ไม่แสดง Platform Fee, fee rate, หรือภาระจ่ายเงินของ Supplier ให้ Buyer เห็น
          </p>
        </div>
      </div>
    </Card>
  );
}

export function WorkflowConsole() {
  const [state, setState] = useState<WorkflowState>(() => createInitialWorkflowState());
  const [rfqTitle, setRfqTitle] = useState("ผลิตสกินแคร์ 3,000 ชิ้น พร้อมฉลากและกล่อง");
  const [rfqCategory, setRfqCategory] = useState("สกินแคร์และบรรจุภัณฑ์");

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(workflowStorageKey, JSON.stringify(state));
  }, [state]);

  const latestRfq = state.rfqs[0];
  const latestQuote = state.quotes.find((quote) => quote.rfqId === latestRfq?.id);
  const latestOrder = getLatestOrder(state);
  const latestFee = latestOrder
    ? state.platformFees.find((fee) => fee.orderId === latestOrder.id)
    : undefined;
  const latestReview = latestOrder
    ? state.reviews.find((review) => review.orderId === latestOrder.id)
    : undefined;

  const totals = useMemo(
    () => ({
      rfqs: state.rfqs.length,
      quotes: state.quotes.length,
      orders: state.orders.length,
      completed: state.orders.filter((order) => order.status === "COMPLETED").length,
      reviews: state.reviews.length
    }),
    [state]
  );

  const reset = () => {
    const next = createInitialWorkflowState();
    window.localStorage.setItem(workflowStorageKey, JSON.stringify(next));
    setState(next);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-5">
        <MetricCard label="RFQs" value={totals.rfqs} />
        <MetricCard label="Quotes" value={totals.quotes} />
        <MetricCard label="Orders" value={totals.orders} />
        <MetricCard label="Completed" value={totals.completed} />
        <MetricCard label="Reviews" value={totals.reviews} />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {phaseCards.map((phase) => (
          <Card className="p-5" key={phase.title}>
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-light text-primary-deep">
              <phase.icon className="h-5 w-5" />
            </div>
            <Badge className="mt-4">{phase.title}</Badge>
            <h2 className="mt-3 font-black text-slate-950">{phase.label}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{phase.text}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {guideVisuals.map((item) => (
          <Card className="overflow-hidden" key={item.title}>
            <div className="relative h-44 bg-emerald-50">
              <Image
                alt={`${item.title} illustration`}
                className="h-full w-full object-cover"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                src={item.image}
              />
            </div>
            <div className="p-5">
              <h2 className="text-lg font-black text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card className="p-5">
          <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-start">
            <div>
              <h2 className="text-2xl font-black text-slate-950">End-to-End Deal Workflow</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                หน้านี้ใช้ทดสอบ workflow หลักตั้งแต่ RFQ ถึง Review ในเครื่องก่อน แล้วใช้เป็น reference
                ต่อเข้ากับ Supabase action จริงในรอบถัดไป
              </p>
            </div>
            <Button onClick={reset} variant="outline">
              <RefreshCcw className="h-4 w-4" />
              Reset demo
            </Button>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-lg border border-emerald-100 bg-white p-4">
                <h3 className="font-black text-slate-950">1. Buyer สร้าง RFQ</h3>
                <div className="mt-3 grid gap-3">
                  <Input value={rfqTitle} onChange={(event) => setRfqTitle(event.target.value)} />
                  <Select value={rfqCategory} onChange={(event) => setRfqCategory(event.target.value)}>
                    <option>สกินแคร์และบรรจุภัณฑ์</option>
                    <option>อาหารเสริมและวิตามิน</option>
                    <option>งานพิมพ์และฉลาก</option>
                    <option>OEM / ODM โรงงานผลิต</option>
                  </Select>
                  <ActionButton
                    onClick={() =>
                      setState((current) =>
                        createRfq(current, {
                          title: rfqTitle,
                          category: rfqCategory,
                          quantity: 3000,
                          budget: 165000
                        })
                      )
                    }
                  >
                    <ClipboardList className="h-4 w-4" />
                    สร้าง RFQ ใหม่
                  </ActionButton>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-white p-4">
                <h3 className="font-black text-slate-950">2. Supplier ส่ง Quote</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  RFQ ล่าสุด: <b>{latestRfq?.id ?? "-"}</b> {latestRfq ? `(${latestRfq.status})` : ""}
                </p>
                <ActionButton
                  disabled={!latestRfq}
                  onClick={() => latestRfq && setState((current) => sendQuote(current, latestRfq.id))}
                  variant="outline"
                >
                  <MessageSquareQuote className="h-4 w-4" />
                  ส่ง Quote จาก Supplier
                </ActionButton>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-white p-4">
                <h3 className="font-black text-slate-950">3. Buyer Accept Quote</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Quote ล่าสุด: <b>{latestQuote?.id ?? "-"}</b>{" "}
                  {latestQuote ? `${formatBaht(latestQuote.totalAmount)} จาก ${latestQuote.supplierName}` : ""}
                </p>
                <ActionButton
                  disabled={!latestQuote || latestQuote.status !== "SENT"}
                  onClick={() => latestQuote && setState((current) => acceptQuote(current, latestQuote.id))}
                  variant="outline"
                >
                  <FileCheck2 className="h-4 w-4" />
                  Accept Quote และสร้าง Order
                </ActionButton>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-emerald-100 bg-white p-4">
                <h3 className="font-black text-slate-950">4. Payment Manual Verification</h3>
                <div className="mt-3 grid gap-2">
                  <ActionButton
                    disabled={!latestOrder || latestOrder.status !== "WAITING_BUYER_PAYMENT"}
                    onClick={() => latestOrder && setState((current) => reportBuyerPayment(current, latestOrder.id))}
                    variant="outline"
                  >
                    <Banknote className="h-4 w-4" />
                    Buyer แจ้งชำระเงินให้ Supplier
                  </ActionButton>
                  <ActionButton
                    disabled={!latestOrder || latestOrder.status !== "BUYER_PAYMENT_REPORTED"}
                    onClick={() => latestOrder && setState((current) => confirmBuyerPayment(current, latestOrder.id))}
                    variant="outline"
                  >
                    <Factory className="h-4 w-4" />
                    Supplier ยืนยันรับเงิน
                  </ActionButton>
                  <ActionButton
                    disabled={!latestOrder || latestOrder.status !== "WAITING_PLATFORM_FEE"}
                    onClick={() => latestOrder && setState((current) => reportPlatformFeePayment(current, latestOrder.id))}
                    variant="outline"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Supplier แจ้งชำระ Activation Fee
                  </ActionButton>
                  <ActionButton
                    disabled={!latestOrder || latestOrder.status !== "PLATFORM_FEE_PAID"}
                    onClick={() => latestOrder && setState((current) => verifyPlatformFee(current, latestOrder.id))}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Admin Verify และเริ่มงาน
                  </ActionButton>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-white p-4">
                <h3 className="font-black text-slate-950">5. Completed & Review</h3>
                <div className="mt-3 grid gap-2">
                  <ActionButton
                    disabled={!latestOrder || latestOrder.status !== "IN_PROGRESS"}
                    onClick={() => latestOrder && setState((current) => markReadyForReview(current, latestOrder.id))}
                    variant="outline"
                  >
                    <PackageCheck className="h-4 w-4" />
                    Supplier ส่งงานให้ตรวจรับ
                  </ActionButton>
                  <ActionButton
                    disabled={!latestOrder || latestOrder.status !== "READY_FOR_REVIEW"}
                    onClick={() => latestOrder && setState((current) => completeOrder(current, latestOrder.id))}
                    variant="outline"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Buyer ตรวจรับและปิด Order
                  </ActionButton>
                  <ActionButton
                    disabled={!latestOrder || latestOrder.status !== "COMPLETED" || Boolean(latestReview)}
                    onClick={() => latestOrder && setState((current) => createReview(current, latestOrder.id))}
                  >
                    <Star className="h-4 w-4" />
                    Buyer รีวิว Supplier
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-lg font-black text-slate-950">สถานะ Order ล่าสุด</h2>
            {latestOrder ? (
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Order</span>
                  <b className="text-primary-deep">{latestOrder.id}</b>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Status</span>
                  <Badge tone={latestOrder.status === "COMPLETED" ? "green" : "orange"}>
                    {orderStatusCopy[latestOrder.status] ?? latestOrder.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Deal amount</span>
                  <b>{formatBaht(latestOrder.totalAmount)}</b>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <span>Progress</span>
                    <span>{latestOrder.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-emerald-50">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${latestOrder.progress}%` }} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">ยังไม่มี Order ให้ Accept Quote ก่อน</p>
            )}
          </Card>

          <BuyerVisibility order={latestOrder} />

          <Card className="p-5">
            <h2 className="text-lg font-black text-slate-950">Supplier/Admin เห็นข้อมูล Fee</h2>
            {latestFee ? (
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Fee base</span>
                  <b>{formatBaht(latestFee.feeBaseAmount)}</b>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Fee total</span>
                  <b>{formatBaht(latestFee.feeTotal)}</b>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Status</span>
                  <Badge>{latestFee.status}</Badge>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Fee จะเกิดหลัง Supplier ยืนยันรับเงินจาก Buyer แล้วเท่านั้น
              </p>
            )}
          </Card>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-black text-slate-950">Audit Log</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ทุก action สำคัญมีร่องรอยสำหรับ Admin/Super Admin ตรวจสอบภายหลัง
          </p>
        </div>
        <div className="divide-y divide-border">
          {state.audits.slice(0, 12).map((item) => (
            <div className="grid gap-3 p-4 md:grid-cols-[130px_160px_1fr]" key={item.id}>
              <Badge tone={item.actor === "ADMIN" ? "purple" : item.actor === "SUPPLIER" ? "blue" : "green"}>
                {item.actor}
              </Badge>
              <b className="text-sm text-primary-deep">{item.action}</b>
              <p className="text-sm text-muted-foreground">{item.message}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

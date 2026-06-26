import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  ShieldCheck,
  Star,
  TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  buyerPaymentRecords,
  buyerReliabilityScores,
  marketplaceOrders,
  orderStatusLabels,
  paymentTermLabels,
  platformFees,
  platformFeeStatusLabels,
  supplierPlans,
  supplierReliabilityScores,
  supplierVerifications,
  type BuyerReliabilityScore,
  type MarketplaceOrder,
  type PlatformFee,
  type SupplierReliabilityScore
} from "@/lib/commerce";
import { formatBaht } from "@/lib/utils";

function statusTone(status: string): "green" | "blue" | "orange" | "red" | "gray" | "purple" {
  if (status.includes("OVERDUE") || status.includes("FAILED") || status.includes("DISPUTED")) return "red";
  if (status.includes("WAITING")) return "orange";
  if (status.includes("PAID") || status.includes("COMPLETED") || status.includes("CONFIRMED")) return "green";
  if (status.includes("IN_PROGRESS")) return "blue";
  return "gray";
}

export function BuyerOrderPaymentCard({ order }: { order: MarketplaceOrder }) {
  const buyerPayment = buyerPaymentRecords.find((item) => item.orderId === order.id);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">การชำระเงินของผู้ซื้อ</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ชำระเงินค่าดีลให้ Supplier โดยตรงตามเงื่อนไขในใบเสนอราคา
          </p>
        </div>
        <Badge tone={statusTone(order.buyerPaymentStatus)}>
          {order.buyerPaymentStatus === "CONFIRMED_BY_SUPPLIER"
            ? "Supplier ยืนยันรับเงินแล้ว"
            : "รอการยืนยัน"}
        </Badge>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm text-muted-foreground">ยอดดีลเต็ม</p>
          <p className="mt-1 text-2xl font-black">{formatBaht(order.totalAmount)}</p>
        </div>
        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm text-muted-foreground">เงื่อนไขการจ่าย</p>
          <p className="mt-1 font-bold">{paymentTermLabels[order.paymentTerm]}</p>
        </div>
        <div className="rounded-xl bg-primary-light p-4 text-primary-deep">
          <p className="text-sm">สถานะสำหรับผู้ซื้อ</p>
          <p className="mt-1 font-bold">{order.buyerFacingMessage}</p>
        </div>
      </div>
      <div className="mt-5 rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <Banknote className="h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold">
              {buyerPayment
                ? `${buyerPayment.paymentType === "DEPOSIT" ? "มัดจำ" : "ชำระเต็ม"} ${formatBaht(buyerPayment.amount)}`
                : "ยังไม่มีรายการแจ้งชำระเงิน"}
            </p>
            <p className="text-sm text-muted-foreground">
              {buyerPayment
                ? `โอนเมื่อ ${buyerPayment.transferDate} · หลักฐาน ${buyerPayment.proofImage}`
                : "เมื่อโอนเงินให้ Supplier แล้ว ให้แจ้งหลักฐานในระบบ"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SupplierActivationFeeCard({
  order,
  fee
}: {
  order: MarketplaceOrder;
  fee: PlatformFee;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Order Activation Fee</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ค่าธรรมเนียมเพื่อเปิดใช้งาน Order, Timeline, Review และ Completed Order Credit
          </p>
        </div>
        <Badge tone={statusTone(fee.status)}>{platformFeeStatusLabels[fee.status]}</Badge>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm text-muted-foreground">คำนวณจากยอดเต็ม</p>
          <p className="mt-1 text-2xl font-black">{formatBaht(fee.feeBaseAmount)}</p>
        </div>
        <div className="rounded-xl bg-muted p-4">
          <p className="text-sm text-muted-foreground">Rate</p>
          <p className="mt-1 text-2xl font-black">{Math.round(fee.feeRate * 100)}%</p>
        </div>
        <div className="rounded-xl bg-primary-light p-4 text-primary-deep">
          <p className="text-sm">ต้องชำระ</p>
          <p className="mt-1 text-2xl font-black">{formatBaht(fee.feeTotal)}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4" />
          <p>
            หากไม่ชำระภายใน {order.activationFeeDueAt} Order จะค้างที่ WAITING_PLATFORM_FEE
            และยังไม่ได้ Completed Order Credit
          </p>
        </div>
        <Button size="sm">ชำระค่าธรรมเนียม</Button>
      </div>
    </Card>
  );
}

export function OrderStatusRail({ order }: { order: MarketplaceOrder }) {
  const steps = [
    "QUOTE_ACCEPTED",
    "WAITING_BUYER_PAYMENT",
    "WAITING_PLATFORM_FEE",
    "IN_PROGRESS",
    "READY_FOR_REVIEW",
    "COMPLETED"
  ] as const;
  const activeIndex = Math.max(0, steps.indexOf(order.orderStatus as (typeof steps)[number]));

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Order Status</h2>
          <p className="text-sm text-muted-foreground">{order.id} · {order.title}</p>
        </div>
        <Badge tone={statusTone(order.orderStatus)}>{orderStatusLabels[order.orderStatus]}</Badge>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-6">
        {steps.map((step, index) => (
          <div className="rounded-xl border border-border bg-white p-3 text-center" key={step}>
            <div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-primary-light text-primary-deep">
              {index <= activeIndex ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
            <p className="mt-2 text-xs font-semibold">{orderStatusLabels[step]}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ReliabilityScoreCard({
  title,
  score,
  type
}: {
  title: string;
  score: BuyerReliabilityScore | SupplierReliabilityScore;
  type: "buyer" | "supplier";
}) {
  const primaryScore = score.rankingScore;
  const rows =
    type === "buyer"
      ? [
          ["Completed Orders", score.completedOrderCount],
          ["Payment Reliability", `${(score as BuyerReliabilityScore).paymentReliabilityRate}%`],
          ["Cancellation Rate", `${score.cancellationRate}%`],
          ["Dispute Rate", `${score.disputeRate}%`],
          ["Response Score", `${score.responseScore}/100`]
        ]
      : [
          ["Completed Orders", score.completedOrderCount],
          ["Platform Fee Payment", `${(score as SupplierReliabilityScore).platformFeePaymentRate}%`],
          ["On-time Delivery", `${(score as SupplierReliabilityScore).onTimeDeliveryRate}%`],
          ["Review Average", `${(score as SupplierReliabilityScore).reviewAverage}/5`],
          ["Response Score", `${score.responseScore}/100`]
        ];

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">ใช้ประกอบ Ranking และความน่าเชื่อถือในดีล</p>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary-light text-xl font-black text-primary-deep">
          {primaryScore}
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div className="flex items-center justify-between text-sm" key={label}>
            <span className="text-muted-foreground">{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function SupplierReadinessCard({ supplierId }: { supplierId: string }) {
  const verification = supplierVerifications.find((item) => item.supplierId === supplierId);
  const plan = supplierPlans.find((item) => item.supplierId === supplierId);

  return (
    <Card className="p-5">
      <h2 className="text-lg font-bold">Supplier Readiness</h2>
      <div className="mt-4 grid gap-3">
        <div className="flex items-center justify-between rounded-xl bg-muted p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-semibold">Verification Level</span>
          </div>
          <Badge>{verification?.level ?? "REGISTERED"}</Badge>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-muted p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="font-semibold">Service Listing Slots</span>
          </div>
          <b>
            {plan?.usedServiceSlots ?? 0}/{plan?.serviceListingLimit ?? 5}
          </b>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-muted p-4">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-primary" />
            <span className="font-semibold">Plan</span>
          </div>
          <Badge tone={plan?.planType === "FREE" ? "gray" : "green"}>{plan?.planType ?? "FREE"}</Badge>
        </div>
      </div>
    </Card>
  );
}

export function PlatformFeeQueueTable() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h2 className="text-lg font-bold">Order Activation Fee Queue</h2>
          <p className="text-sm text-muted-foreground">เฉพาะ Supplier/Admin เห็นข้อมูลค่าธรรมเนียมนี้</p>
        </div>
        <Button variant="outline" size="sm">ตั้งค่า Fee Rule</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Supplier</th>
              <th className="px-5 py-3">Fee Base</th>
              <th className="px-5 py-3">Fee Total</th>
              <th className="px-5 py-3">Due</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {platformFees.map((fee) => {
              const order = marketplaceOrders.find((item) => item.id === fee.orderId);
              return (
                <tr className="border-t border-border" key={fee.id}>
                  <td className="px-5 py-4 font-semibold text-primary-deep">{fee.orderId}</td>
                  <td className="px-5 py-4">{order?.supplierName ?? fee.supplierId}</td>
                  <td className="px-5 py-4">{formatBaht(fee.feeBaseAmount)}</td>
                  <td className="px-5 py-4 font-bold">{formatBaht(fee.feeTotal)}</td>
                  <td className="px-5 py-4">{fee.dueAt}</td>
                  <td className="px-5 py-4">
                    <Badge tone={statusTone(fee.status)}>{platformFeeStatusLabels[fee.status]}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function MarketplaceRuleSummary() {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-lg font-bold">Business Rules ล่าสุด</h2>
      </div>
      <div className="mt-4 grid gap-3 text-sm">
        {[
          "Buyer ใช้งานฟรีและจ่ายค่าดีลให้ Supplier โดยตรง",
          "Platform ไม่ถือเงินค่าผลิตใน MVP",
          "Supplier จ่าย Order Activation Fee หลังได้รับเงินจาก Buyer รอบแรก",
          "Fee คิดจากยอดดีลเต็ม 100% แม้เป็นมัดจำ",
          "Order ไม่เดินเป็น IN_PROGRESS จนกว่า Platform Fee ผ่าน",
          "Completed Order Credit และ Review เกิดเฉพาะ Order ที่ผ่าน Fee แล้ว"
        ].map((rule) => (
          <div className="flex gap-2" key={rule}>
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{rule}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export const commerceDemo = {
  mainOrder: marketplaceOrders[0],
  mainFee: platformFees[0],
  mainBuyerScore: buyerReliabilityScores[0],
  mainSupplierScore: supplierReliabilityScores[0]
};

import Image from "next/image";
import { DashboardShell } from "@/components/dashboard-shell";
import { StatCard } from "@/components/business-widgets";
import {
  MarketplaceRuleSummary,
  ReliabilityScoreCard,
  SupplierActivationFeeCard,
  SupplierReadinessCard,
  commerceDemo
} from "@/components/commerce-widgets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { marketplaceOrders, orderStatusLabels, paymentTermLabels, platformFees } from "@/lib/commerce";
import { formatBaht } from "@/lib/utils";

const supplierItems = [
  { label: "Overview", href: "/dashboard/supplier", icon: "Home" as const, active: true },
  { label: "Company Profile", href: "/suppliers/greenway-industry", icon: "Building2" as const },
  { label: "Verification", href: "/dashboard/supplier", icon: "ShieldCheck" as const },
  { label: "Listings", href: "/services/custom-printed-box", icon: "Box" as const },
  { label: "Incoming RFQs", href: "/dashboard/supplier/rfqs", icon: "FileText" as const, badge: 8 },
  { label: "Quotes", href: "/dashboard/supplier", icon: "MessageCircle" as const },
  { label: "Orders", href: "/dashboard/supplier", icon: "ShoppingCart" as const },
  { label: "Activation Fees", href: "/dashboard/supplier", icon: "CreditCard" as const },
  { label: "Workflow Console", href: "/dashboard/workflow", icon: "PackageCheck" as const }
];

export default function SupplierDashboardPage() {
  const waitingFee = platformFees.filter((fee) => fee.status === "WAITING_PAYMENT" || fee.status === "OVERDUE");

  return (
    <DashboardShell items={supplierItems} role="Supplier">
      <div className="mb-6 grid gap-5 overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-card lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <Badge className="mb-4 w-fit">Supplier Workspace</Badge>
          <h1 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
            รับ RFQ, ส่งใบเสนอราคา และติดตาม Order ได้ชัดเจน
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            Supplier ใช้หน้านี้จัดการคำขอใหม่ ใบเสนอราคา คำสั่งผลิต และสถานะงาน โดยยังคงกติกา Order Activation Fee สำหรับฝั่ง Supplier เท่านั้น
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/dashboard/supplier/rfqs">ดู RFQ ใหม่</Button>
            <Button href="/dashboard/workflow" variant="outline">ทดสอบ Workflow</Button>
          </div>
        </div>
        <div className="relative min-h-[260px] bg-emerald-50 lg:min-h-[360px]">
          <Image
            alt="Supplier dashboard illustration showing RFQs, quotations, purchase orders and work status"
            className="h-full w-full object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 54vw, 100vw"
            src="/images/supplier-dashboard-hero.png"
          />
        </div>
      </div>

      <div className="hidden">
        <h1 className="text-3xl font-black">ยินดีต้อนรับกลับมา, ณัฐวุฒิ</h1>
        <p className="mt-1 text-muted-foreground">
          รับเงินค่าดีลจาก Buyer โดยตรง แล้วชำระ Order Activation Fee เพื่อเริ่ม Order ผ่านระบบ
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="RFQ ใหม่" value="8" change="พร้อมส่ง Quote" />
        <StatCard title="Quote ที่ส่งแล้ว" value="15" change="รอ Buyer ตัดสินใจ" tone="blue" />
        <StatCard title="รอ Activation Fee" value={String(waitingFee.length)} change="ต้องจัดการก่อนเริ่มงาน" tone="orange" />
        <StatCard title="Completed Credit" value="128" change="ได้จาก Order ที่ผ่านระบบ" />
        <StatCard title="Ranking Score" value="92" change="ขึ้นกับ Fee, ส่งงาน, รีวิว" tone="purple" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SupplierActivationFeeCard order={commerceDemo.mainOrder} fee={commerceDemo.mainFee} />
        <ReliabilityScoreCard
          title="Supplier Reliability Score"
          score={commerceDemo.mainSupplierScore}
          type="supplier"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="text-lg font-bold">Order ที่ต้องติดตาม</h2>
            <Button variant="ghost" size="sm">ดูทั้งหมด</Button>
          </div>
          {marketplaceOrders.map((order) => (
            <div className="border-b border-border p-5 last:border-0" key={order.id}>
              <div className="flex items-center justify-between gap-3">
                <b className="text-primary-deep">{order.id}</b>
                <Badge tone={order.orderStatus === "WAITING_PLATFORM_FEE" ? "orange" : "green"}>
                  {orderStatusLabels[order.orderStatus]}
                </Badge>
              </div>
              <p className="mt-2 font-semibold">{order.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {paymentTermLabels[order.paymentTerm]} · ยอดดีล {formatBaht(order.totalAmount)}
              </p>
            </div>
          ))}
        </Card>

        <SupplierReadinessCard supplierId="SUP-001" />

        <Card className="p-5">
          <h2 className="text-lg font-bold">การกระทำด่วน</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {[
              "ส่งใบเสนอราคา",
              "ยืนยันรับเงินจาก Buyer",
              "ชำระ Activation Fee",
              "อัปเดต Timeline งาน"
            ].map((label) => (
              <Button key={label} variant={label.includes("ชำระ") ? "primary" : "outline"}>{label}</Button>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <MarketplaceRuleSummary />
      </div>
    </DashboardShell>
  );
}

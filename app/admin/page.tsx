import { DashboardShell } from "@/components/dashboard-shell";
import { AdminDataTable, StatCard } from "@/components/business-widgets";
import { MarketplaceRuleSummary, PlatformFeeQueueTable } from "@/components/commerce-widgets";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  marketplaceOrders,
  orderStatusLabels,
  platformFees,
  platformFeeStatusLabels,
  supplierPlans,
  supplierVerifications
} from "@/lib/commerce";
import { formatBaht } from "@/lib/utils";

const adminItems = [
  { label: "ภาพรวม", href: "/admin", icon: "Home" as const, active: true },
  { label: "ผู้ใช้งาน", href: "/admin", icon: "Users" as const },
  { label: "ซัพพลายเออร์", href: "/admin", icon: "Building2" as const },
  { label: "RFQs", href: "/admin", icon: "FileText" as const },
  { label: "Orders", href: "/admin", icon: "ShoppingCart" as const },
  { label: "Activation Fees", href: "/admin", icon: "CreditCard" as const },
  { label: "ข้อพิพาท", href: "/admin", icon: "Bell" as const, badge: 12 },
  { label: "Workflow Console", href: "/dashboard/workflow", icon: "PackageCheck" as const },
  { label: "Supabase", href: "/admin/supabase-status", icon: "Database" as const },
  { label: "ระบบและตั้งค่า", href: "/admin", icon: "Settings" as const }
];

export default function AdminDashboardPage() {
  const waitingFeeTotal = platformFees
    .filter((fee) => fee.status === "WAITING_PAYMENT" || fee.status === "OVERDUE")
    .reduce((sum, fee) => sum + fee.feeTotal, 0);
  const paidFeeTotal = platformFees
    .filter((fee) => fee.status === "PAID")
    .reduce((sum, fee) => sum + fee.feeTotal, 0);
  const waitingPlatformFeeOrders = marketplaceOrders.filter((order) => order.orderStatus === "WAITING_PLATFORM_FEE").length;

  return (
    <DashboardShell items={adminItems} role="Admin">
      <div className="mb-6">
        <h1 className="text-3xl font-black">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          MVP นี้ Platform ไม่ถือเงินค่าผลิต ดูแลเฉพาะ Order Activation Fee, verification, score และ workflow
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Orders ทั้งหมด" value="1,987" change="เกิดจาก Accepted Quote" />
        <StatCard title="รอ Activation Fee" value={String(waitingPlatformFeeOrders)} change={formatBaht(waitingFeeTotal)} tone="orange" />
        <StatCard title="Activation Fee รับแล้ว" value={formatBaht(paidFeeTotal)} change="Supplier → Platform" tone="green" />
        <StatCard title="รอ Verify Supplier" value="38" change="หลายระดับ ไม่บังคับเอกสารหนัก" tone="purple" />
        <StatCard title="Open Disputes" value="12" change="ต้องตรวจสอบ" tone="red" />
      </div>

      <div className="mt-6">
        <PlatformFeeQueueTable />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <div className="border-b border-border p-5">
            <h2 className="text-lg font-bold">Order Workflow Monitor</h2>
            <p className="text-sm text-muted-foreground">ตรวจสถานะหลัง Buyer จ่าย Supplier โดยตรง</p>
          </div>
          <div className="divide-y divide-border">
            {marketplaceOrders.map((order) => (
              <div className="grid gap-3 p-5 md:grid-cols-[1fr_auto_auto]" key={order.id}>
                <div>
                  <p className="font-bold text-primary-deep">{order.id}</p>
                  <p className="text-sm font-semibold">{order.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Buyer: {order.buyerName} · Supplier: {order.supplierName}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">ยอดดีลเต็ม</p>
                  <p className="font-bold">{formatBaht(order.totalAmount)}</p>
                </div>
                <Badge tone={order.orderStatus === "WAITING_PLATFORM_FEE" ? "orange" : "green"}>
                  {orderStatusLabels[order.orderStatus]}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
        <MarketplaceRuleSummary />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <AdminDataTable
          title="Supplier Verification Levels"
          rows={supplierVerifications.map((verification) => ({
            id: verification.supplierId,
            name: verification.level,
            meta: verification.submittedDocuments.join(", ") || "ยังไม่มีเอกสาร",
            status: verification.level.includes("VERIFIED") ? "ตรวจแล้ว" : "รอข้อมูล"
          }))}
        />
        <AdminDataTable
          title="Supplier Listing Limits"
          rows={supplierPlans.map((plan) => ({
            id: plan.supplierId,
            name: `${plan.planType} plan`,
            meta: `${plan.usedServiceSlots}/${plan.serviceListingLimit} listings · extra ${plan.extraServiceSlots}`,
            status: plan.featuredListing ? "Featured" : "ปกติ"
          }))}
        />
        <AdminDataTable
          title="Platform Fee Status"
          rows={platformFees.map((fee) => ({
            id: fee.id,
            name: fee.orderId,
            meta: `${formatBaht(fee.feeTotal)} · base ${formatBaht(fee.feeBaseAmount)}`,
            status: platformFeeStatusLabels[fee.status]
          }))}
        />
      </div>
    </DashboardShell>
  );
}

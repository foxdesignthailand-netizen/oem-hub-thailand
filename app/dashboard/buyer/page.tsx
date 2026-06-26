import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { MessageThread, StatCard } from "@/components/business-widgets";
import { OrderStatusRail, commerceDemo } from "@/components/commerce-widgets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { marketplaceOrders, orderStatusLabels, paymentTermLabels } from "@/lib/commerce";
import { rfqs } from "@/lib/data";
import { formatBaht } from "@/lib/utils";

const buyerItems = [
  { label: "Dashboard", href: "/dashboard/buyer", icon: "Home" as const, active: true },
  { label: "My RFQs", href: "/dashboard/buyer/rfq/RFQ-2024-00089", icon: "FileText" as const, badge: 8 },
  { label: "Quotes", href: "/dashboard/buyer/rfq/RFQ-2024-00089", icon: "MessageCircle" as const },
  { label: "Orders", href: "/dashboard/buyer", icon: "ShoppingCart" as const },
  { label: "Messages", href: "/dashboard/buyer", icon: "MessageCircle" as const, badge: 2 },
  { label: "Payments", href: "/dashboard/buyer", icon: "CreditCard" as const },
  { label: "Reviews", href: "/dashboard/buyer", icon: "Star" as const }
];

export default function BuyerDashboardPage() {
  return (
    <DashboardShell items={buyerItems} role="Buyer">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black">ยินดีต้อนรับกลับ, คุณรุ่งโรจน์</h1>
          <p className="mt-1 text-muted-foreground">
            Buyer ใช้งานฟรีใน MVP และชำระค่าดีลให้ Supplier โดยตรงตามเงื่อนไขใน Quote
          </p>
        </div>
        <Button href="/rfq/new">สร้าง RFQ ใหม่</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="RFQ ทั้งหมด" value="24" change="เพิ่ม 20% จากเดือนก่อน" />
        <StatCard title="Quote ที่ได้รับ" value="58" change="เพิ่ม 18% จากเดือนก่อน" tone="blue" />
        <StatCard title="Order กำลังดำเนินการ" value="12" change="ติดตามผ่าน Timeline" tone="orange" />
        <StatCard title="รอตรวจรับงาน" value="4" change="รีวิวได้เมื่อ Completed" tone="purple" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="text-lg font-bold">RFQs ล่าสุด</h2>
            <Button href="/dashboard/buyer/rfq/RFQ-2024-00089" variant="ghost" size="sm">ดูทั้งหมด</Button>
          </div>
          <div className="divide-y divide-border">
            {rfqs.map((rfq) => (
              <Link className="block p-5 hover:bg-primary-light" href="/dashboard/buyer/rfq/RFQ-2024-00089" key={rfq.id}>
                <div className="flex items-center justify-between">
                  <b className="text-primary-deep">{rfq.id}</b>
                  <Badge tone="blue">{rfq.quotes} Quote</Badge>
                </div>
                <p className="mt-2 font-semibold">{rfq.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{rfq.date}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="text-lg font-bold">Orders ปัจจุบัน</h2>
            <Button variant="ghost" size="sm">ดูทั้งหมด</Button>
          </div>
          <div className="divide-y divide-border">
            {marketplaceOrders.map((order) => (
              <div className="p-5" key={order.id}>
                <div className="flex items-center justify-between gap-3">
                  <b className="text-primary-deep">{order.id}</b>
                  <Badge tone={order.orderStatus === "WAITING_PLATFORM_FEE" ? "orange" : "green"}>
                    {orderStatusLabels[order.orderStatus]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm font-semibold">{order.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {paymentTermLabels[order.paymentTerm]} · {formatBaht(order.totalAmount)}
                </p>
                <p className="mt-2 rounded-lg bg-primary-light px-3 py-2 text-xs font-semibold text-primary-deep">
                  {order.buyerFacingMessage}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <MessageThread />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <OrderStatusRail order={commerceDemo.mainOrder} />
        <Card className="p-5">
          <h2 className="text-lg font-bold">สิ่งที่ต้องทำต่อ</h2>
          <div className="mt-4 grid gap-3">
            {[
              ["สร้าง RFQ ใหม่", "/rfq/new"],
              ["ค้นหา Supplier", "/suppliers"],
              ["เปรียบเทียบใบเสนอราคา", "/dashboard/buyer/rfq/RFQ-2024-00089"],
              ["แจ้งหลักฐานชำระเงิน", "/dashboard/buyer/rfq/RFQ-2024-00089"]
            ].map(([label, href]) => (
              <Button href={href} variant="outline" key={label}>{label}</Button>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

import { FileText, LockKeyhole, PackageCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { MessageThread, QuoteComparisonTable } from "@/components/business-widgets";
import {
  BuyerOrderPaymentCard,
  OrderStatusRail,
  ReliabilityScoreCard,
  commerceDemo
} from "@/components/commerce-widgets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { quotes } from "@/lib/data";
import { formatBaht } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: "/dashboard/buyer", icon: "Home" as const },
  { label: "My RFQs", href: "/dashboard/buyer/rfq/RFQ-2024-00089", icon: "FileText" as const, active: true, badge: 8 },
  { label: "Quotes", href: "/dashboard/buyer/rfq/RFQ-2024-00089", icon: "MessageCircle" as const },
  { label: "Orders", href: "/dashboard/buyer", icon: "ShoppingCart" as const },
  { label: "Messages", href: "/dashboard/buyer", icon: "MessageCircle" as const },
  { label: "Payments", href: "/dashboard/buyer", icon: "CreditCard" as const },
  { label: "Reviews", href: "/dashboard/buyer", icon: "Star" as const },
  { label: "Workflow Console", href: "/dashboard/workflow", icon: "PackageCheck" as const }
];

export default function RFQDetailPage({ params }: { params: { id: string } }) {
  const order = commerceDemo.mainOrder;

  return (
    <DashboardShell items={items} role="Buyer">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm text-muted-foreground">RFQ ของฉัน / รายละเอียด RFQ และ Order</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black">{params.id}</h1>
            <Badge>ได้รับใบเสนอราคาแล้ว</Badge>
            <Badge tone="orange">รอเริ่มงานผ่านระบบ</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            สร้างเมื่อ 15 พ.ค. 2567 · Order {order.id} · ยอดดีล {formatBaht(order.totalAmount)}
          </p>
        </div>
        <Button variant="outline">
          <FileText className="h-4 w-4" />
          ดาวน์โหลดสรุป RFQ
        </Button>
      </div>

      <Card className="mb-6 p-5">
        <div className="grid gap-5 lg:grid-cols-[180px_1fr_300px]">
          <div className="grid h-44 place-items-center rounded-xl bg-primary-light text-center text-primary-deep">
            <FileText className="mx-auto h-12 w-12" />
            <p className="mt-2 font-bold">Drawing / Reference</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold">ต้องการผลิตชิ้นส่วน Machined Part</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {["CNC Machining", "Aluminum 6061", "Milling, Turning", "Anodized"].map((tag) => (
                <Badge tone="gray" key={tag}>{tag}</Badge>
              ))}
            </div>
            <p className="mt-4 leading-7 text-muted-foreground">
              ต้องการผู้ผลิตที่มีความเชี่ยวชาญในงานชิ้นส่วนตามแบบที่แนบมา คุณภาพสูง
              ส่งมอบตรงเวลา และสามารถออกใบกำกับภาษีได้
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {[
                ["จำนวน", "5,000 ชิ้น"],
                ["MOQ รับได้", "1,000 ชิ้น"],
                ["งบประมาณ", "฿150 / ชิ้น"],
                ["กำหนดส่ง", "ภายใน 30 วัน"]
              ].map(([label, value]) => (
                <div className="rounded-xl bg-muted p-3" key={label}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="p-4 shadow-none">
            <h3 className="font-bold">Buyer Company Co., Ltd.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              โปรไฟล์ผู้ซื้อ · ใช้งานฟรีใน MVP · ไม่มี Platform Fee ฝั่ง Buyer
            </p>
            <div className="mt-4 rounded-lg bg-primary-light p-3 text-sm text-primary-deep">
              <LockKeyhole className="mb-2 h-4 w-4" />
              ระบบจะแสดงเฉพาะยอดที่ต้องจ่ายให้ Supplier โดยตรง
            </div>
          </Card>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <QuoteComparisonTable quotes={quotes} />
          <OrderStatusRail order={order} />
          <BuyerOrderPaymentCard order={order} />
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <PackageCheck className="mt-1 h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold">สิ่งที่ Buyer เห็นในช่วงนี้</h2>
                <p className="mt-2 leading-7 text-muted-foreground">
                  ขณะนี้ Supplier อยู่ระหว่างยืนยันการเริ่มงานผ่านระบบ เมื่อขั้นตอนภายในเสร็จแล้ว
                  Order จะเปลี่ยนเป็นกำลังดำเนินงานและ Supplier จะเริ่มอัปเดต Timeline ให้คุณติดตามได้
                </p>
              </div>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <ReliabilityScoreCard
            title="Buyer Reliability Score"
            score={commerceDemo.mainBuyerScore}
            type="buyer"
          />
          <MessageThread />
        </div>
      </div>
    </DashboardShell>
  );
}

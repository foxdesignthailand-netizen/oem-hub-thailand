import { CalendarDays, Package, Send, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buyerReliabilityScores } from "@/lib/commerce";
import { formatBaht } from "@/lib/utils";

const items = [
  { label: "Overview", href: "/dashboard/supplier", icon: "Home" as const },
  { label: "Incoming RFQs", href: "/dashboard/supplier/rfqs", icon: "FileText" as const, active: true, badge: 8 },
  { label: "Quotes", href: "/dashboard/supplier", icon: "MessageCircle" as const },
  { label: "Orders", href: "/dashboard/supplier", icon: "ShoppingCart" as const },
  { label: "Activation Fees", href: "/dashboard/supplier", icon: "CreditCard" as const }
];

const incoming = [
  ["RFQ-2505-0154", "Bracket Assembly", 120000, "23 พ.ค. 68", "BUY-001", "Buyer Company Co., Ltd."],
  ["RFQ-2505-0153", "CNC Machining Part", 85000, "24 พ.ค. 68", "BUY-002", "AutoMax Co., Ltd."],
  ["RFQ-2505-0152", "Aluminum Die Casting", 210000, "26 พ.ค. 68", "BUY-001", "Buyer Company Co., Ltd."],
  ["RFQ-2505-0151", "Stainless Part", 65000, "27 พ.ค. 68", "BUY-002", "AutoMax Co., Ltd."]
] as const;

export default function SupplierRFQsPage() {
  return (
    <DashboardShell items={items} role="Supplier">
      <div className="mb-6">
        <h1 className="text-3xl font-black">Incoming RFQs</h1>
        <p className="mt-1 text-muted-foreground">
          ดู RFQ พร้อม Buyer Reliability เพื่อประเมินความน่าเชื่อถือก่อนเสนอราคา
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {incoming.map(([id, title, budget, deadline, buyerId, buyerName]) => {
          const buyerScore = buyerReliabilityScores.find((score) => score.buyerId === buyerId);
          return (
            <Card className="p-5" key={id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <b className="text-primary-deep">{id}</b>
                    <Badge>ใหม่</Badge>
                  </div>
                  <h2 className="mt-3 text-xl font-bold">{title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    ต้องการ Supplier ที่มีมาตรฐาน ส่งมอบตรงเวลา และสามารถออกใบกำกับภาษีได้
                  </p>
                </div>
                <Button size="sm">
                  <Send className="h-4 w-4" />
                  ส่ง Quote
                </Button>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-muted p-3">
                  <Package className="h-4 w-4 text-primary" />
                  <p className="mt-2 text-xs text-muted-foreground">งบประมาณ</p>
                  <p className="font-bold">{formatBaht(budget)}</p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <p className="mt-2 text-xs text-muted-foreground">กำหนดส่ง</p>
                  <p className="font-bold">{deadline}</p>
                </div>
                <div className="rounded-xl bg-primary-light p-3 text-primary-deep">
                  <ShieldCheck className="h-4 w-4" />
                  <p className="mt-2 text-xs">Buyer Score</p>
                  <p className="font-bold">{buyerScore?.rankingScore ?? "-"} / 100</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{buyerName}</p>
                    <p className="text-sm text-muted-foreground">
                      Completed {buyerScore?.completedOrderCount ?? 0} orders · Payment Reliability {buyerScore?.paymentReliabilityRate ?? 0}%
                    </p>
                  </div>
                  <Badge tone={(buyerScore?.rankingScore ?? 0) >= 90 ? "green" : "blue"}>
                    Reliable Buyer
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}

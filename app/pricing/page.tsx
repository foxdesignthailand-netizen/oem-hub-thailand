import { CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  {
    name: "Buyer",
    price: "ฟรี",
    description: "สำหรับทีมที่ต้องการค้นหา Supplier และส่ง RFQ",
    features: ["สร้าง RFQ ได้ไม่จำกัด", "เปรียบเทียบใบเสนอราคา", "ระบบข้อความและไฟล์แนบ", "ติดตามคำสั่งซื้อ"]
  },
  {
    name: "Supplier Pro",
    price: "฿1,990 / เดือน",
    description: "สำหรับ Supplier ที่ต้องการรับ lead คุณภาพและบริหารดีล",
    featured: true,
    features: ["หน้าโปรไฟล์บริษัท", "รับ RFQ ที่ตรงหมวด", "ส่งใบเสนอราคา", "Dashboard ยอดขายและกิจกรรม"]
  },
  {
    name: "Enterprise",
    price: "ติดต่อทีมงาน",
    description: "สำหรับองค์กรที่ต้องการ workflow และ approval แบบเฉพาะ",
    features: ["ทีมผู้ใช้หลายสิทธิ์", "รายงานเชิงลึก", "SLA และ onboarding", "เชื่อมต่อระบบภายใน"]
  }
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-page section-y">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold text-primary-deep">Pricing</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">แพ็กเกจที่โตไปพร้อมธุรกิจของคุณ</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            เริ่มใช้งานฝั่งผู้ซื้อได้ฟรี และอัปเกรดเมื่อคุณต้องการเครื่องมือขายหรือการดูแลเชิงลึก
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card className={plan.featured ? "border-primary p-6 shadow-soft" : "p-6"} key={plan.name}>
              {plan.featured ? <Badge>แนะนำสำหรับ Supplier</Badge> : null}
              <h2 className="mt-4 text-2xl font-black">{plan.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{plan.description}</p>
              <p className="mt-6 text-3xl font-black text-primary-deep">{plan.price}</p>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <p className="flex items-center gap-2 text-sm" key={feature}>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {feature}
                  </p>
                ))}
              </div>
              <Button href={plan.name === "Buyer" ? "/rfq/new" : "/contact"} className="mt-8 w-full" variant={plan.featured ? "primary" : "outline"}>
                {plan.name === "Enterprise" ? "ติดต่อฝ่ายขาย" : "เริ่มใช้งาน"}
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

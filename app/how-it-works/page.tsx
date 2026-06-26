import { ArrowRight, CheckCircle2, ClipboardList, Factory, LineChart, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  {
    title: "บอกโจทย์ที่ต้องการผลิต",
    description: "กรอกรายละเอียดสินค้า จำนวน งบประมาณ กำหนดส่ง และแนบ reference ที่เกี่ยวข้อง",
    icon: ClipboardList
  },
  {
    title: "รับใบเสนอราคาจากหลาย Supplier",
    description: "ระบบช่วยจับคู่ Supplier ที่เหมาะสมและให้คุณเปรียบเทียบราคา เงื่อนไข และเวลาผลิต",
    icon: Factory
  },
  {
    title: "เลือก Supplier และเริ่มดีลผ่านระบบ",
    description: "คุยรายละเอียด แนบไฟล์ ยืนยันเงื่อนไข และเก็บหลักฐานไว้ในดีลรูมเดียว",
    icon: ShieldCheck
  },
  {
    title: "จบงาน รีวิว และต่อยอดแบรนด์",
    description: "ติดตามการผลิต ตรวจรับงาน รีวิวจากออเดอร์จริง และใช้ข้อมูลซ้ำในงานถัดไป",
    icon: LineChart
  }
];

export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-white">
          <div className="container-page py-16 text-center">
            <p className="font-semibold text-primary-deep">วิธีใช้งาน</p>
            <h1 className="mx-auto mt-2 max-w-3xl text-4xl font-black sm:text-5xl">
              จากไอเดียสินค้า สู่การผลิตจริงใน 4 ขั้นตอน
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              OEM Hub Thailand ถูกออกแบบให้ทีมธุรกิจค้นหา เปรียบเทียบ และดีลกับ Supplier ได้ครบในระบบเดียว
            </p>
          </div>
        </section>
        <section className="container-page section-y">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Card className="p-6" key={step.title}>
                <div className="flex items-center justify-between">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-primary-light text-primary-deep">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <span className="text-4xl font-black text-primary-soft">{index + 1}</span>
                </div>
                <h2 className="mt-6 text-xl font-bold">{step.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
          <Card className="mt-10 grid gap-6 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-black">พร้อมเริ่ม RFQ แรกแล้วหรือยัง?</h2>
              <p className="mt-2 text-muted-foreground">ใช้เวลาไม่กี่นาที ระบบจะช่วยจัดข้อมูลให้พร้อมส่ง Supplier</p>
            </div>
            <Button href="/rfq/new">
              เริ่มสร้าง RFQ
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {["ข้อมูลปลอดภัย", "เปรียบเทียบง่าย", "มีหลักฐานในระบบ"].map((label) => (
              <div className="flex items-center gap-3 rounded-xl bg-primary-light p-4 text-primary-deep" key={label}>
                <CheckCircle2 className="h-5 w-5" />
                <b>{label}</b>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

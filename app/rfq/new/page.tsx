import {
  CheckCircle2,
  ClipboardList,
  Factory,
  FileText,
  Send,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { RFQWizard } from "@/components/rfq-wizard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NewRFQPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="overflow-hidden border-b border-emerald-100 bg-gradient-to-b from-emerald-50/80 via-white to-white">
          <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_0.85fr] lg:py-14">
            <div className="flex flex-col justify-center">
              <Badge className="mb-5 w-fit px-4 py-2">
                <Sparkles className="h-4 w-4" />
                สร้าง RFQ ง่าย ๆ ใน 6 ขั้นตอน
              </Badge>
              <h1 className="max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                บอกโจทย์ครั้งเดียว
                <span className="block text-primary-deep">ให้หลาย Supplier เสนอราคา</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                ระบบจะช่วยจัดข้อมูลสินค้า สเปก จำนวน งบประมาณ และกำหนดเวลาให้อยู่ในรูปแบบที่ Supplier
                ประเมินราคาได้ง่ายขึ้น แม้คุณยังไม่เคยสั่งผลิตมาก่อน
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="#rfq-wizard" size="lg">
                  <Send className="h-5 w-5" />
                  เริ่มสร้าง RFQ
                </Button>
                <Button href="/suppliers" size="lg" variant="outline">
                  ดู Supplier ก่อน
                </Button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  "ฟรีสำหรับ Buyer",
                  "ข้อมูลใช้เพื่อจับคู่ Supplier",
                  "รับข้อเสนอหลายเจ้าในระบบเดียว"
                ].map((item) => (
                  <div className="flex items-center gap-2 rounded-lg bg-white/85 p-3 text-sm font-bold text-slate-700 ring-1 ring-emerald-100" key={item}>
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-soft">
                <Image
                  alt="RFQ submission and quote comparison illustration for OEM Hub Thailand"
                  className="h-full min-h-[420px] w-full object-cover"
                  height={864}
                  priority
                  src="/images/oem-hero-rfq.png"
                  width={1536}
                />
                <div className="friendly-grid absolute inset-0 hidden opacity-50" />
                <div className="relative hidden space-y-4">
                  <div className="rounded-lg bg-gradient-to-br from-primary-deep to-primary p-5 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-white/80">RFQ Preview</p>
                        <h2 className="mt-2 text-2xl font-black">ผลิตสกินแคร์ 3,000 ชิ้น พร้อมฉลากและกล่อง</h2>
                      </div>
                      <ClipboardList className="h-10 w-10 shrink-0" />
                    </div>
                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      {["สเปกชัด", "MOQ พร้อม", "งบประมาณมีช่วง"].map((item) => (
                        <span className="rounded-lg bg-white/14 px-3 py-2 text-center text-sm font-bold" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { title: "จัดข้อมูลให้ Supplier", text: "อ่านโจทย์ง่าย ประเมินราคาเร็ว", icon: FileText },
                      { title: "จับคู่หมวดที่เกี่ยวข้อง", text: "ส่งโจทย์ไปยังผู้ให้บริการที่ตรงงาน", icon: Factory },
                      { title: "ข้อมูลปลอดภัย", text: "ใช้เพื่อประเมินและจับคู่ในระบบ", icon: ShieldCheck },
                      { title: "เทียบข้อเสนอได้", text: "ราคา MOQ lead time อยู่ในรูปแบบเดียวกัน", icon: CheckCircle2 }
                    ].map((item) => (
                      <div className="rounded-lg border border-emerald-100 bg-white/95 p-4 shadow-sm" key={item.title}>
                        <item.icon className="h-6 w-6 text-primary-deep" />
                        <h3 className="mt-3 font-black text-slate-950">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="rfq-wizard" className="container-page section-y scroll-mt-24">
          <RFQWizard />
        </section>
      </main>
    </>
  );
}

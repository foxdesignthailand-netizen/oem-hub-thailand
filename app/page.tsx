import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Factory,
  LineChart,
  PackageCheck,
  Send,
  ShieldCheck,
  Sparkles,
  Star
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SearchRfqBox } from "@/components/search-rfq-box";
import { CategoryCard, SupplierCard } from "@/components/marketplace-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categories, suppliers } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-white">
          <div className="container-page grid min-h-[680px] items-center gap-10 py-12 lg:grid-cols-[1fr_0.9fr] lg:py-16">
            <div>
              <Badge className="mb-5">B2B Marketplace for Brand Builders</Badge>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                เริ่มผลิตสินค้าและสร้างแบรนด์ของคุณ{" "}
                <span className="text-primary-deep">ได้ครบในที่เดียว</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                ค้นหาโรงงาน OEM/ODM ผู้ผลิต บรรจุภัณฑ์ งานพิมพ์ ฉลาก เอกสาร
                และบริการการตลาด พร้อมขอใบเสนอราคาและดีลผ่านระบบอย่างเป็นมืออาชีพ
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/rfq/new" size="lg">
                  <Send className="h-5 w-5" />
                  เริ่มขอใบเสนอราคา
                </Button>
                <Button href="/suppliers" size="lg" variant="outline">
                  ดู Supplier ทั้งหมด
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["โรงงานคุณภาพ", "ตรวจสอบแล้ว"],
                  ["เปรียบเทียบง่าย", "ได้ข้อเสนอที่คุ้มสุด"],
                  ["ปลอดภัย มั่นใจได้", "ข้อมูลไม่ถูกเปิดเผย"]
                ].map(([title, text]) => (
                  <div className="flex items-center gap-3" key={title}>
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-bold">{title}</p>
                      <p className="text-sm text-muted-foreground">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-6 top-8 h-56 w-56 rounded-full bg-primary-soft blur-3xl" />
              <Card className="relative p-5 shadow-soft">
                <div className="rounded-xl bg-[linear-gradient(135deg,#064e3b,#10b981)] p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/75">RFQ ใหม่</p>
                      <h2 className="mt-1 text-2xl font-black">ผลิตสินค้า 10,000 ชิ้น</h2>
                    </div>
                    <Sparkles className="h-9 w-9" />
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/12 p-4">
                      <p className="text-sm text-white/75">Supplier เสนอราคาแล้ว</p>
                      <p className="mt-2 text-3xl font-black">5 ราย</p>
                    </div>
                    <div className="rounded-xl bg-white/12 p-4">
                      <p className="text-sm text-white/75">ราคาเริ่มต้น</p>
                      <p className="mt-2 text-3xl font-black">฿48</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-9 w-9 text-primary" />
                      <div>
                        <p className="font-bold">Verified Supplier</p>
                        <p className="text-sm text-muted-foreground">ผ่านการตรวจสอบเอกสาร</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <PackageCheck className="h-9 w-9 text-primary" />
                      <div>
                        <p className="font-bold">Order Tracking</p>
                        <p className="text-sm text-muted-foreground">ติดตามงานแบบมีหลักฐาน</p>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="mt-4 rounded-xl border border-border bg-muted p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">เปรียบเทียบ Quote</span>
                    <span className="text-primary-deep">ประหยัด 12%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white">
                    <div className="h-2 w-3/4 rounded-full bg-primary" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="container-page -mt-10 relative z-10">
          <SearchRfqBox />
        </section>

        <section className="container-page section-y">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-semibold text-primary-deep">หมวดหมู่สินค้าและบริการ</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                เลือกบริการที่ต้องการ แล้วเริ่มสร้างแบรนด์ได้ทันที
              </h2>
            </div>
            <Button href="/categories" variant="ghost">
              ดูทั้งหมด
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <CategoryCard category={category} featured={index === 0} key={category.slug} />
            ))}
          </div>
        </section>

        <section className="bg-white section-y">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-semibold text-primary-deep">How it works</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                จากไอเดียสินค้า สู่การผลิตจริงใน 4 ขั้นตอน
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {[
                { title: "บอกโจทย์ที่ต้องการผลิต", icon: ClipboardList },
                { title: "รับใบเสนอราคาจากหลาย Supplier", icon: Factory },
                { title: "เลือก Supplier และเริ่มดีลผ่านระบบ", icon: ShieldCheck },
                { title: "จบงาน รีวิว และต่อยอดแบรนด์", icon: LineChart }
              ].map((step, index) => (
                <Card className="p-5 text-center" key={step.title}>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-light text-primary-deep">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <p className="mt-4 text-sm font-bold text-primary-deep">ขั้นตอนที่ {index + 1}</p>
                  <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page section-y">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-semibold text-primary-deep">Verified Network</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Supplier แนะนำที่ผ่านการตรวจสอบ
              </h2>
            </div>
            <Button href="/suppliers" variant="outline">ดู Supplier ทั้งหมด</Button>
          </div>
          <div className="grid gap-4">
            {suppliers.slice(0, 3).map((supplier) => (
              <SupplierCard supplier={supplier} key={supplier.slug} />
            ))}
          </div>
        </section>

        <section className="bg-white section-y">
          <div className="container-page">
            <h2 className="text-3xl font-black sm:text-4xl">
              ทำไมต้องดีลผ่าน OEM Hub Thailand
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {[
                { title: "Supplier ผ่านการตรวจสอบ", icon: ShieldCheck },
                { title: "ขอราคาได้หลายเจ้าในครั้งเดียว", icon: Send },
                { title: "ติดตามงานและหลักฐานในระบบ", icon: PackageCheck },
                { title: "รีวิวจากออเดอร์จริงเท่านั้น", icon: Star }
              ].map((item) => (
                <Card className="p-5" key={item.title}>
                  <item.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    ลดความเสี่ยงในการเลือกคู่ค้าและช่วยให้ทีมตัดสินใจได้เร็วขึ้น
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page py-12">
          <div className="rounded-2xl bg-[linear-gradient(135deg,#047857,#10b981)] p-8 text-white shadow-soft sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-black sm:text-4xl">
                  มีไอเดียสินค้าแล้ว แต่ยังไม่รู้จะเริ่มจากที่ไหน?
                </h2>
                <p className="mt-4 max-w-3xl text-white/85">
                  ส่งโจทย์ของคุณเข้ามา แล้วให้ Supplier ที่เหมาะสมเสนอราคากลับมาในระบบ
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/rfq/new" variant="dark">เริ่มสร้าง RFQ</Button>
                <Button href="/dashboard/supplier" variant="outline" className="border-white bg-white text-primary-deep hover:bg-primary-light">
                  สมัครเป็น Supplier
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

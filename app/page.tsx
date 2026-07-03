import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Factory,
  FileCheck2,
  LineChart,
  MessagesSquare,
  PackageCheck,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Truck
} from "lucide-react";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SearchRfqBox } from "@/components/search-rfq-box";
import { CategoryCard, SupplierCard } from "@/components/marketplace-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categories, suppliers } from "@/lib/data";

const trustItems = [
  { title: "Verified Supplier", text: "เชื่อมต่อกับโรงงานและผู้ให้บริการที่ผ่านการตรวจสอบ", icon: ShieldCheck },
  { title: "Compare Quotes", text: "รับหลายใบเสนอราคาแล้วเทียบเงื่อนไขได้ง่าย", icon: FileCheck2 },
  { title: "Track Work", text: "ติดตามสถานะงาน เอกสาร และการส่งมอบในระบบ", icon: Truck },
  { title: "Real Reviews", text: "รีวิวมาจากงานที่จบผ่านระบบเท่านั้น", icon: Star }
];

const steps = [
  {
    title: "บอกโจทย์",
    text: "กรอกสิ่งที่ต้องการผลิต ปริมาณ งบประมาณ และไฟล์อ้างอิง",
    icon: ClipboardList
  },
  {
    title: "รับใบเสนอราคา",
    text: "Supplier ที่ตรงโจทย์ส่งราคา MOQ lead time และเงื่อนไขกลับมา",
    icon: MessagesSquare
  },
  {
    title: "เปรียบเทียบและเลือก",
    text: "ดูราคา รีวิว มาตรฐาน และประวัติงานก่อนตัดสินใจ",
    icon: Search
  },
  {
    title: "เริ่มผลิตและติดตามงาน",
    text: "เปิด Order ติดตามความคืบหน้า และรีวิวหลังงานเสร็จ",
    icon: PackageCheck
  }
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-b from-emerald-50/80 via-white to-white">
          <div className="container-page grid min-h-[660px] items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
            <div>
              <Badge className="mb-5 px-4 py-2">
                <Sparkles className="h-4 w-4" />
                B2B Quote-based Manufacturing Marketplace
              </Badge>
              <h1 className="max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                บอกโจทย์ครั้งเดียว
                <span className="block text-primary-deep">ให้หลาย Supplier เสนอราคา</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                ค้นหา เปรียบเทียบ และติดตามงานผลิตได้ในระบบเดียว สำหรับแบรนด์ที่ต้องการโรงงาน OEM/ODM
                บรรจุภัณฑ์ งานพิมพ์ เอกสารมาตรฐาน และบริการสร้างแบรนด์ที่เชื่อถือได้
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/rfq/new" size="lg">
                  <Send className="h-5 w-5" />
                  ขอใบเสนอราคา
                </Button>
                <Button href="/suppliers" size="lg" variant="outline">
                  ค้นหา Supplier
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["ฟรีสำหรับ Buyer", "เริ่ม RFQ ได้ทันที"],
                  ["หลายข้อเสนอในที่เดียว", "เทียบราคาและเงื่อนไขง่าย"],
                  ["ติดตามงานเป็นระบบ", "ลดการคุยกระจัดกระจาย"]
                ].map(([title, text]) => (
                  <div className="flex items-center gap-3 rounded-lg bg-white/80 p-3 ring-1 ring-emerald-100" key={title}>
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
                    <div>
                      <p className="font-black text-slate-950">{title}</p>
                      <p className="text-sm text-muted-foreground">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-soft">
                <Image
                  alt="OEM Hub Thailand marketplace illustration with factory, products, verified suppliers and quote comparison"
                  className="h-full min-h-[420px] w-full object-cover"
                  height={864}
                  priority
                  src="/images/oem-hero-marketplace.png"
                  width={1536}
                />
                <div className="friendly-grid absolute inset-0 hidden opacity-50" />
                <div className="relative hidden gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-primary-deep to-primary p-5 text-white shadow-card">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-white/80">RFQ ใหม่</p>
                        <h2 className="mt-2 text-2xl font-black">ผลิตเซรั่ม 5,000 ชิ้น พร้อมกล่องและฉลาก</h2>
                      </div>
                      <Factory className="h-10 w-10 shrink-0" />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {["สกินแคร์", "MOQ 5,000", "30 วัน"].map((item) => (
                        <span className="rounded-lg bg-white/14 px-3 py-2 text-sm font-bold" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      ["Premium Factory Co., Ltd.", "฿165,000", "แนะนำ", "15-20 วัน"],
                      ["Green Manufacturing", "฿152,500", "คุ้มค่า", "18-22 วัน"],
                      ["Thai Cosmetic Maker", "฿148,900", "ราคาเริ่มดี", "20-25 วัน"]
                    ].map(([name, price, label, leadTime]) => (
                      <div className="rounded-lg border border-emerald-100 bg-white/95 p-4 shadow-sm" key={name}>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-black text-slate-950">{name}</p>
                            <p className="mt-1 text-sm text-muted-foreground">Lead time {leadTime}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-primary-deep">{price}</p>
                            <span className="mt-1 inline-flex rounded-full bg-primary-light px-2.5 py-1 text-xs font-black text-primary-deep">
                              {label}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {["Verified", "GMP / ISO", "Track Order"].map((item) => (
                      <div className="rounded-lg bg-emerald-50 p-3 text-center text-sm font-black text-primary-deep ring-1 ring-emerald-100" key={item}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-page -mt-9 relative z-10">
          <SearchRfqBox />
        </section>

        <section className="container-page py-9">
          <div className="grid gap-3 rounded-lg border border-emerald-100 bg-white p-4 shadow-card md:grid-cols-4">
            {trustItems.map((item) => (
              <div className="flex items-start gap-3 p-2" key={item.title}>
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-light text-primary-deep">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-950">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container-page section-y pt-6">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-black text-primary-deep">หมวดหมู่ยอดนิยม</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
                เลือกบริการที่ต้องการ แล้วเริ่มคุยกับ Supplier ที่ใช่
              </h2>
            </div>
            <Button href="/categories" variant="ghost">
              ดูทั้งหมด
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((category, index) => (
              <CategoryCard category={category} featured={index === 0} key={category.slug} />
            ))}
          </div>
        </section>

        <section className="soft-section section-y">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-black text-primary-deep">ทำงานง่าย ๆ ใน 4 ขั้นตอน</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
                จากโจทย์ผลิตสินค้า ไปจนถึง Order ที่ติดตามได้จริง
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {steps.map((step, index) => (
                <div className="relative rounded-lg border border-emerald-100 bg-white p-5 shadow-card" key={step.title}>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary-light text-primary-deep">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-black text-white">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page section-y">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-black text-primary-deep">Supplier แนะนำ</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
                เลือกจากข้อมูลสำคัญที่เทียบได้เร็ว
              </h2>
            </div>
            <Button href="/suppliers" variant="outline">ค้นหา Supplier ทั้งหมด</Button>
          </div>
          <div className="grid gap-4">
            {suppliers.slice(0, 3).map((supplier) => (
              <SupplierCard supplier={supplier} key={supplier.slug} />
            ))}
          </div>
        </section>

        <section className="bg-white section-y">
          <div className="container-page">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="font-black text-primary-deep">ทำไมต้องดีลผ่าน OEM Hub Thailand</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
                  ไม่ใช่แค่รายชื่อโรงงาน แต่เป็นระบบช่วยให้ดีลเกิดขึ้นจริง
                </h2>
                <p className="mt-4 leading-8 text-muted-foreground">
                  เราออกแบบให้ Buyer ส่ง RFQ รับ Quote เปรียบเทียบ เปิด Order ติดตามงาน และรีวิวหลังจบงานในที่เดียว
                  เพื่อให้การผลิตสินค้าเป็นระบบ โปร่งใส และตัดสินใจได้ง่ายขึ้น
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-card sm:col-span-2">
                  <Image
                    alt="OEM Hub Thailand workflow illustration showing tracking, quote comparison, order status and review"
                    className="h-64 w-full object-cover sm:h-72"
                    height={864}
                    src="/images/spot-workflow.png"
                    width={1536}
                  />
                </div>
                {[
                  { title: "RFQ มีโครงสร้าง", text: "Supplier เข้าใจโจทย์เร็วขึ้นและเสนอราคาได้แม่นขึ้น", icon: ClipboardList },
                  { title: "เปรียบเทียบ Quote", text: "ดูราคา MOQ lead time มาตรฐาน และรีวิวในหน้าตัดสินใจเดียว", icon: LineChart },
                  { title: "ติดตามงานในระบบ", text: "รวมสถานะ เอกสาร และข้อความที่เกี่ยวกับ Order ไว้ด้วยกัน", icon: PackageCheck },
                  { title: "รีวิวจากงานจริง", text: "คะแนนเกิดจาก Completed Order เท่านั้น เพิ่มความน่าเชื่อถือให้ marketplace", icon: Star }
                ].map((item) => (
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-5" key={item.title}>
                    <item.icon className="h-8 w-8 text-primary-deep" />
                    <h3 className="mt-4 font-black text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container-page py-12">
          <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-deep via-primary to-emerald-400 p-8 text-white shadow-soft sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-black sm:text-4xl">
                  พร้อมให้ Supplier หลายเจ้าช่วยเสนอราคางานผลิตของคุณหรือยัง?
                </h2>
                <p className="mt-4 max-w-3xl text-white/88">
                  เริ่มจาก RFQ เดียว แล้วใช้ระบบช่วยรวบรวมข้อเสนอ เปรียบเทียบ และติดตามงานอย่างเป็นขั้นตอน
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/rfq/new" variant="white">
                  <Send className="h-4 w-4" />
                  สร้าง RFQ เลย
                </Button>
                <Button href="/suppliers" variant="outline" className="border-white/80 bg-transparent text-white hover:bg-white hover:text-primary-deep">
                  ค้นหา Supplier
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

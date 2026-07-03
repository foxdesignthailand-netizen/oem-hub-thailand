import {
  CheckCircle2,
  Filter,
  Headphones,
  LockKeyhole,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound
} from "lucide-react";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SupplierCard } from "@/components/marketplace-cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { categories, suppliers } from "@/lib/data";

const chips = ["หมวดหมู่: สกินแคร์", "บริการ: ผลิตสินค้า OEM", "มาตรฐาน: GMP"];

const heroTrustItems = [
  {
    title: "Supplier ผ่านการตรวจสอบ",
    text: "มั่นใจในข้อมูลบริษัทและมาตรฐาน",
    icon: ShieldCheck
  },
  {
    title: "จับคู่ตามโจทย์ RFQ",
    text: "ช่วยลดเวลาหาโรงงานที่เหมาะสม",
    icon: UsersRound
  },
  {
    title: "ข้อมูลปลอดภัย",
    text: "เริ่มคุยและติดตามงานผ่านระบบ",
    icon: LockKeyhole
  }
];

const trustStripItems = [
  {
    title: "Verified Supplier",
    text: "ตรวจสอบตัวตนและข้อมูลบริษัท",
    icon: ShieldCheck
  },
  {
    title: "ตอบโจทย์เร็วขึ้น",
    text: "ส่ง RFQ ให้ Supplier ที่เกี่ยวข้อง",
    icon: CheckCircle2
  },
  {
    title: "ทีมงานช่วยแนะนำ",
    text: "ช่วยคัดหมวดหมู่และปรับโจทย์",
    icon: Headphones
  },
  {
    title: "Buyer ใช้งานฟรี",
    text: "เริ่มค้นหาและขอราคาได้ทันที",
    icon: LockKeyhole
  }
];

export default function SuppliersPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-emerald-100 bg-gradient-to-b from-emerald-50/80 to-white">
          <div className="container-page py-10 lg:py-12">
            <div className="grid gap-8 rounded-[28px] border border-emerald-100 bg-white/80 p-6 shadow-soft lg:grid-cols-[1fr_0.9fr] lg:p-8">
              <div>
                <p className="font-black text-primary-deep">ค้นหา Supplier ที่เหมาะกับแบรนด์ของคุณ</p>
                <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                  เปรียบเทียบโรงงานและผู้ให้บริการที่ผ่านการคัดกรอง
                </h1>
                <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">
                  ดูข้อมูล MOQ, lead time, มาตรฐาน, รีวิว และจังหวัด ก่อนส่ง RFQ เพื่อรับใบเสนอราคาจาก Supplier ที่ตรงโจทย์
                </p>
                <div className="mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-11" placeholder="ค้นหา Supplier, สินค้า หรือบริการ" />
                  </div>
                  <Button>
                    <Search className="h-4 w-4" />
                    ค้นหา
                  </Button>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-[24px] border border-emerald-100 bg-white shadow-card">
                <Image
                  alt="Verified supplier factory illustration for OEM Hub Thailand"
                  className="h-full min-h-[320px] w-full object-cover"
                  height={864}
                  priority
                  src="/images/oem-hero-suppliers.png"
                  width={1536}
                />
                <div className="hidden gap-3">
                {heroTrustItems.map((item) => (
                  <div className="flex items-center gap-4 rounded-lg border border-emerald-100 bg-white p-4 shadow-sm" key={item.title}>
                    <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary-light text-primary-deep">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-950">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 rounded-lg border border-emerald-100 bg-white p-4 shadow-card md:grid-cols-4">
              {trustStripItems.map((item) => (
                <div className="flex items-start gap-3 p-2" key={item.title}>
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-light text-primary-deep">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-black text-slate-950">{item.title}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page section-y">
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="font-black text-primary-deep">พบ {suppliers.length * 65 + 1} Supplier ที่เกี่ยวข้อง</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                เลือกจากข้อมูลที่สำคัญต่อการตัดสินใจ
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-sm font-bold text-primary-deep ring-1 ring-primary-soft" key={chip}>
                    {chip}
                    <span aria-hidden>×</span>
                  </span>
                ))}
                <Button size="sm" variant="ghost">ล้างทั้งหมด</Button>
              </div>
            </div>
            <Select className="max-w-xs" defaultValue="recommended">
              <option value="recommended">จัดเรียง: ความเกี่ยวข้อง</option>
              <option value="trusted">ความน่าเชื่อถือสูงสุด</option>
              <option value="rating">คะแนนรีวิวสูงสุด</option>
              <option value="lead-time">Lead time เร็วสุด</option>
            </Select>
          </div>

          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <aside>
              <Card className="sticky top-24 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
                    <Filter className="h-5 w-5 text-primary-deep" />
                    ตัวกรอง
                  </h2>
                  <Button variant="ghost" size="sm">ล้างตัวกรอง</Button>
                </div>
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">หมวดหมู่สินค้า</label>
                    <Select defaultValue="">
                      <option value="" disabled>เลือกหมวดหมู่</option>
                      {categories.map((category) => (
                        <option key={category.slug}>{category.title}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">จังหวัด</label>
                    <Select defaultValue="">
                      <option value="" disabled>เลือกจังหวัด</option>
                      <option>กรุงเทพฯ</option>
                      <option>สมุทรปราการ</option>
                      <option>ชลบุรี</option>
                      <option>ระยอง</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">MOQ ขั้นต่ำ</label>
                    <Select defaultValue="">
                      <option value="" disabled>เลือกช่วง MOQ</option>
                      <option>ไม่กำหนด</option>
                      <option>1-100 ชิ้น</option>
                      <option>100-1,000 ชิ้น</option>
                      <option>มากกว่า 1,000 ชิ้น</option>
                    </Select>
                  </div>
                  <Input placeholder="มาตรฐาน เช่น ISO 9001, GMP" />
                  <div className="space-y-2 text-sm">
                    {["4.5 ดาวขึ้นไป", "Verified Supplier เท่านั้น", "Lead time ภายใน 15 วัน", "มีรีวิวจาก Order จริง"].map((label) => (
                      <label className="flex items-center gap-2 font-medium text-slate-700" key={label}>
                        <input className="h-4 w-4 accent-primary" type="checkbox" />
                        {label}
                      </label>
                    ))}
                  </div>
                  <Button className="w-full">
                    <SlidersHorizontal className="h-4 w-4" />
                    ดูผลลัพธ์
                  </Button>
                </div>
              </Card>
            </aside>

            <section className="space-y-4">
              {suppliers.map((supplier) => (
                <SupplierCard supplier={supplier} key={supplier.slug} />
              ))}
              <div className="rounded-lg border border-emerald-100 bg-primary-light/60 p-5 shadow-card">
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">ยังไม่เจอ Supplier ที่ตรงใจ?</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      สร้าง RFQ แล้วให้ระบบช่วยส่งโจทย์ไปยัง Supplier ที่เกี่ยวข้อง คุณจะได้เทียบข้อเสนอในที่เดียว
                    </p>
                  </div>
                  <Button href="/rfq/new">ให้ทีมช่วยจับคู่</Button>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

import { Filter, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SupplierCard } from "@/components/marketplace-cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { categories, suppliers } from "@/lib/data";

export default function SuppliersPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-page section-y">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="font-semibold text-primary-deep">ค้นหา Supplier</p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">พบซัพพลายเออร์ 326 รายการ</h1>
            <p className="mt-3 text-muted-foreground">คัดกรองโรงงานและผู้ให้บริการที่เหมาะกับโจทย์ของคุณ</p>
          </div>
          <Select className="max-w-xs" defaultValue="trusted">
            <option value="trusted">เรียงตาม: ความน่าเชื่อถือ</option>
            <option value="rating">คะแนนรีวิว</option>
            <option value="lead-time">Lead time เร็วสุด</option>
          </Select>
        </div>
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside>
            <Card className="sticky top-24 p-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Filter className="h-5 w-5" />
                  ตัวกรอง
                </h2>
                <Button variant="ghost" size="sm">ล้างทั้งหมด</Button>
              </div>
              <div className="mt-5 space-y-4">
                <Select defaultValue="">
                  <option value="" disabled>หมวดหมู่สินค้า</option>
                  {categories.map((category) => (
                    <option key={category.slug}>{category.title}</option>
                  ))}
                </Select>
                <Select defaultValue="">
                  <option value="" disabled>จังหวัด</option>
                  <option>กรุงเทพฯ</option>
                  <option>สมุทรปราการ</option>
                  <option>ชลบุรี</option>
                </Select>
                <Select defaultValue="">
                  <option value="" disabled>MOQ ขั้นต่ำ</option>
                  <option>ไม่กำหนด</option>
                  <option>1-100 ชิ้น</option>
                  <option>100-1,000 ชิ้น</option>
                </Select>
                <Input placeholder="มาตรฐาน เช่น ISO 9001" />
                <div className="space-y-2 text-sm">
                  {["4.5 ขึ้นไป", "Verified เท่านั้น", "ภายใน 15 วัน", "มีรีวิวจากออเดอร์จริง"].map((label) => (
                    <label className="flex items-center gap-2" key={label}>
                      <input className="h-4 w-4 accent-primary" type="checkbox" />
                      {label}
                    </label>
                  ))}
                </div>
                <Button className="w-full">
                  <SlidersHorizontal className="h-4 w-4" />
                  ดูผลลัพธ์ 326 รายการ
                </Button>
              </div>
            </Card>
          </aside>
          <section className="space-y-4">
            {suppliers.map((supplier) => (
              <SupplierCard supplier={supplier} key={supplier.slug} />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

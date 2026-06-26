import { notFound } from "next/navigation";
import { CheckCircle2, Heart, Share2, XCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/marketplace-cards";
import { services, suppliers } from "@/lib/data";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((item) => item.slug === params.slug);
  if (!service) notFound();
  const supplier = suppliers.find((item) => item.slug === service.supplierSlug) ?? suppliers[0];

  return (
    <>
      <SiteHeader />
      <main className="container-page py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <Card className="p-6">
              <Badge>{service.category}</Badge>
              <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-black">{service.title}</h1>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <RatingStars rating={service.rating} reviews={28} />
                    <span>ขายแล้ว {service.sold} งาน</span>
                    <span>ผู้เข้าชม 2,341</span>
                  </div>
                </div>
                <Button variant="ghost"><Heart className="h-4 w-4" />บันทึก</Button>
              </div>
              <div className="mt-6 h-[420px] rounded-xl bg-[linear-gradient(135deg,#0f5132,#d1fae5)] p-6">
                <div className="grid h-full place-items-center rounded-xl bg-white/20 text-center text-white">
                  <div>
                    <p className="text-2xl font-black">YOUR BRAND</p>
                    <p className="mt-2 text-white/80">Premium product and packaging gallery</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold">เกี่ยวกับบริการนี้</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{service.description}</p>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <h2 className="text-xl font-bold">รวมในบริการนี้</h2>
                <div className="mt-4 space-y-3">
                  {(service.includes ?? []).map((item: string) => (
                    <p className="flex items-center gap-2 text-sm" key={item}>
                      <CheckCircle2 className="h-4 w-4 text-primary" />{item}
                    </p>
                  ))}
                </div>
              </Card>
              <Card className="p-6">
                <h2 className="text-xl font-bold">ไม่รวมในบริการนี้</h2>
                <div className="mt-4 space-y-3">
                  {(service.excludes ?? []).map((item: string) => (
                    <p className="flex items-center gap-2 text-sm" key={item}>
                      <XCircle className="h-4 w-4 text-muted-foreground" />{item}
                    </p>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-2xl font-bold">ขั้นตอนการทำงาน</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-5">
                {["แจ้งความต้องการ", "เสนอราคา", "ชำระเงิน", "ผลิตและตรวจสอบ", "จัดส่ง"].map((step, index) => (
                  <div className="rounded-xl bg-muted p-4 text-center text-sm font-semibold" key={step}>
                    {index + 1}. {step}
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="p-5">
              <h2 className="text-xl font-bold">ผู้ให้บริการ</h2>
              <div className="mt-4 flex gap-3">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-light text-xl font-black text-primary-deep">
                  {supplier.logo}
                </div>
                <div>
                  <p className="font-bold">{supplier.name}</p>
                  <p className="text-sm text-muted-foreground">{supplier.province}</p>
                  <RatingStars rating={supplier.rating} reviews={supplier.reviews} />
                </div>
              </div>
              <Button href={`/suppliers/${supplier.slug}`} className="mt-5 w-full" variant="outline">
                ดูโปรไฟล์ผู้ขาย
              </Button>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-muted-foreground">ราคาเริ่มต้น</p>
              <p className="mt-1 text-4xl font-black text-primary-deep">฿{service.startingPrice}</p>
              <div className="mt-4 space-y-3 text-sm">
                <p><b>MOQ:</b> {service.moq}</p>
                <p><b>ระยะเวลา:</b> {service.leadTime}</p>
              </div>
              <Button href="/rfq/new" className="mt-5 w-full">ขอราคา</Button>
              <Button href="/rfq/new" className="mt-3 w-full" variant="outline">สร้าง RFQ จากบริการนี้</Button>
              <Button className="mt-3 w-full" variant="ghost"><Share2 className="h-4 w-4" />แชร์บริการนี้</Button>
            </Card>
          </aside>
        </div>
      </main>
    </>
  );
}

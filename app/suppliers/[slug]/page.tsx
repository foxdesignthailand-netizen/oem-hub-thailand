import { notFound } from "next/navigation";
import { MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { RatingStars, ServiceCard, VerifiedBadge } from "@/components/marketplace-cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { services, suppliers } from "@/lib/data";

export function generateStaticParams() {
  return suppliers.map((supplier) => ({ slug: supplier.slug }));
}

export default function SupplierProfilePage({ params }: { params: { slug: string } }) {
  const supplier = suppliers.find((item) => item.slug === params.slug);
  if (!supplier) notFound();
  const supplierServices = services.filter((service) => service.supplierSlug === supplier.slug);

  return (
    <>
      <SiteHeader />
      <main className="container-page py-8">
        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
          <div className="h-64 bg-[linear-gradient(135deg,rgba(4,120,87,.95),rgba(16,185,129,.55)),url('/images/factory-pattern.svg')] p-8 text-white">
            <h1 className="max-w-2xl text-4xl font-black">ครบจบในที่เดียว งานผลิตคุณภาพ มาตรฐานสากล</h1>
            <p className="mt-3 text-white/80">พาร์ทเนอร์การผลิตที่ธุรกิจไว้วางใจ</p>
          </div>
          <div className="grid gap-6 p-6 lg:grid-cols-[160px_1fr_280px]">
            <div className="-mt-24 grid h-36 w-36 place-items-center rounded-2xl border border-border bg-white shadow-soft">
              <span className="text-4xl font-black text-primary-deep">{supplier.logo}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-black">{supplier.name}</h2>
                <VerifiedBadge />
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <RatingStars rating={supplier.rating} reviews={supplier.reviews} />
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{supplier.province}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {supplier.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
              </div>
            </div>
            <Card className="p-4 shadow-none">
              <Button href="/rfq/new" className="w-full">ขอใบเสนอราคา</Button>
              <Button variant="outline" className="mt-3 w-full">
                <MessageCircle className="h-4 w-4" />
                ส่งข้อความ
              </Button>
            </Card>
          </div>
        </section>

        <div className="mt-6 flex gap-2 overflow-x-auto rounded-xl border border-border bg-white p-2">
          {["ภาพรวม", "บริการ", "ผลงาน", "มาตรฐาน/เอกสาร", "รีวิว", "คำถามที่พบบ่อย"].map((tab, index) => (
            <button className={index === 0 ? "rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white" : "rounded-lg px-4 py-2 text-sm font-bold text-gray-700 hover:bg-muted"} key={tab}>
              {tab}
            </button>
          ))}
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold">ภาพรวมบริษัท</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{supplier.description}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                {[
                  ["MOQ ขั้นต่ำ", supplier.moq],
                  ["ระยะเวลาผลิต", supplier.leadTime],
                  ["สำเร็จ", `${supplier.completedOrders}+`],
                  ["หมวดบริการ", supplier.category]
                ].map(([label, value]) => (
                  <div className="rounded-xl bg-muted p-4" key={label}>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-1 font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
            <div>
              <h2 className="mb-4 text-2xl font-bold">บริการของเรา</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {(supplierServices.length ? supplierServices : services).slice(0, 2).map((service) => (
                  <ServiceCard service={service} key={service.slug} />
                ))}
              </div>
            </div>
          </div>
          <aside className="space-y-6">
            <Card className="p-5">
              <h2 className="text-lg font-bold">มาตรฐาน/การรับรอง</h2>
              <div className="mt-4 grid gap-3">
                {["ISO 9001", "ISO 14001", "IATF 16949", "TIS 17025"].map((label) => (
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3" key={label}>
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <b>{label}</b>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h2 className="text-lg font-bold">รีวิวจากลูกค้า</h2>
              <div className="mt-4">
                <p className="text-5xl font-black">{supplier.rating}</p>
                <RatingStars rating={supplier.rating} reviews={supplier.reviews} />
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  งานคุณภาพดีมาก ตรงตามสเปก ส่งงานตรงเวลา ทีมงานสื่อสารดี
                </p>
              </div>
            </Card>
          </aside>
        </section>
      </main>
    </>
  );
}

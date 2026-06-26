import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SupplierCard, CategoryCard } from "@/components/marketplace-cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categories, suppliers } from "@/lib/data";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const category = categories.find((item) => item.slug === params.slug);
  if (!category) notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-white">
          <div className="container-page py-12">
            <p className="font-semibold text-primary-deep">หมวดหมู่</p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">{category.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
              {category.description}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/rfq/new">สร้าง RFQ ในหมวดนี้</Button>
              <Button href="/suppliers" variant="outline">ดู Supplier ที่เกี่ยวข้อง</Button>
            </div>
          </div>
        </section>
        <section className="container-page section-y">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {suppliers.slice(0, 4).map((supplier) => (
                <SupplierCard supplier={supplier} key={supplier.slug} />
              ))}
            </div>
            <aside className="space-y-4">
              <Card className="p-5">
                <h2 className="text-lg font-bold">ข้อมูลตลาด</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <p>ซัพพลายเออร์: <b>{category.count.toLocaleString("th-TH")}</b> ราย</p>
                  <p>MOQ ยอดนิยม: <b>500-1,000 ชิ้น</b></p>
                  <p>Lead time เฉลี่ย: <b>7-20 วัน</b></p>
                </div>
              </Card>
              <Card className="p-5">
                <h2 className="text-lg font-bold">หมวดใกล้เคียง</h2>
                <div className="mt-4 grid gap-3">
                  {categories.filter((item) => item.slug !== category.slug).slice(0, 2).map((item) => (
                    <CategoryCard category={item} key={item.slug} />
                  ))}
                </div>
              </Card>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

import { SiteHeader } from "@/components/site-header";
import { CategoryCard } from "@/components/marketplace-cards";
import { SearchRfqBox } from "@/components/search-rfq-box";
import { categories } from "@/lib/data";

export default function CategoriesPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-page section-y">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="font-semibold text-primary-deep">หมวดหมู่ทั้งหมด</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              เลือกบริการที่ใช่ เพื่อสร้างแบรนด์ของคุณ
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
              รวมบริการสำคัญสำหรับการสร้างแบรนด์สินค้า OEM/ODM ตั้งแต่โรงงานผลิต
              บรรจุภัณฑ์ งานพิมพ์ เอกสารมาตรฐาน ไปจนถึงการตลาด
            </p>
          </div>
          <SearchRfqBox />
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard category={category} key={category.slug} />
          ))}
        </div>
      </main>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  MapPin,
  Megaphone,
  Package,
  PenTool,
  Printer,
  Send,
  ShieldCheck,
  Star,
  Tags,
  Timer,
  UsersRound
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const iconMap = {
  Factory,
  Package,
  Tags,
  Printer,
  PenTool,
  Camera,
  ClipboardCheck,
  ShieldCheck,
  Megaphone
};

const categoryImageMap: Record<string, string> = {
  "oem-odm": "/images/oem-hero-suppliers.png",
  packaging: "/images/category-packaging.png",
  labels: "/images/category-labels.png",
  printing: "/images/category-printing.png",
  design: "/images/category-printing.png",
  content: "/images/category-skincare.png",
  compliance: "/images/spot-compliance.png",
  trademark: "/images/spot-compliance.png",
  marketing: "/images/spot-workflow.png"
};

export function VerifiedBadge() {
  return (
    <Badge tone="green">
      <CheckCircle2 className="h-3.5 w-3.5" />
      Verified Supplier
    </Badge>
  );
}

export function RatingStars({
  rating,
  reviews
}: {
  rating: number;
  reviews?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <Star className="h-4 w-4 fill-warning text-warning" />
      <b>{rating.toFixed(1)}</b>
      {reviews ? <span className="text-muted-foreground">({reviews} รีวิว)</span> : null}
    </span>
  );
}

export function CategoryCard({
  category,
  featured = false
}: {
  category: {
    slug: string;
    title: string;
    description: string;
    count: number;
    icon: string;
  };
  featured?: boolean;
}) {
  const Icon = iconMap[category.icon as keyof typeof iconMap] ?? Package;
  const categoryImage = categoryImageMap[category.slug];
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card
        className={cn(
          "group h-full overflow-hidden p-5 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-soft",
          featured && "border-primary/60 bg-primary-light/40"
        )}
      >
        {categoryImage ? (
          <div className="mb-4 overflow-hidden rounded-lg border border-emerald-100 bg-emerald-50">
            <Image
              alt={`${category.title} illustration`}
              className="h-32 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              height={360}
              src={categoryImage}
              width={640}
            />
          </div>
        ) : null}
        <div className="flex items-start gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-emerald-100 to-white text-primary-deep ring-1 ring-emerald-100">
            <Icon className="h-8 w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-black text-slate-950">{category.title}</h3>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-primary-deep transition group-hover:translate-x-1" />
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {category.description}
            </p>
            <p className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-sm font-black text-primary-deep ring-1 ring-emerald-100">
              {category.count.toLocaleString("th-TH")} รายการ
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function SupplierCard({
  supplier,
  compact = false
}: {
  supplier: any;
  compact?: boolean;
}) {
  return (
    <Card className="grid gap-5 p-5 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-soft lg:grid-cols-[128px_1fr_250px]">
      <div className="relative grid h-32 place-items-center overflow-hidden rounded-lg border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
        <div className="friendly-grid absolute inset-0 opacity-60" />
        <span className="relative grid h-20 w-20 place-items-center rounded-lg bg-white text-2xl font-black text-primary-deep shadow-sm ring-1 ring-emerald-100">
          {supplier.logo}
        </span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {supplier.verified ? <VerifiedBadge /> : null}
          <Badge tone="navy">{supplier.category}</Badge>
        </div>
        <Link href={`/suppliers/${supplier.slug}`} className="mt-2 block text-xl font-black text-slate-950 hover:text-primary-deep">
          {supplier.name}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {supplier.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {supplier.tags.slice(0, compact ? 3 : 5).map((tag: string) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <RatingStars rating={supplier.rating} reviews={supplier.reviews} />
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {supplier.province}
          </span>
          <span className="inline-flex items-center gap-1">
            <UsersRound className="h-4 w-4" />
            {supplier.completedOrders.toLocaleString("th-TH")} งานสำเร็จ
          </span>
        </div>
      </div>
      <div className="rounded-lg border border-emerald-100 bg-emerald-50/55 p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-white p-3 ring-1 ring-emerald-100">
            <p className="text-muted-foreground">MOQ</p>
            <p className="mt-1 font-black text-slate-950">{supplier.moq}</p>
          </div>
          <div className="rounded-lg bg-white p-3 ring-1 ring-emerald-100">
            <p className="flex items-center gap-1 text-muted-foreground">
              <Timer className="h-4 w-4" />
              Lead time
            </p>
            <p className="mt-1 font-black text-slate-950">{supplier.leadTime}</p>
          </div>
          <div className="col-span-2 rounded-lg bg-white p-3 ring-1 ring-emerald-100">
            <p className="text-muted-foreground">มาตรฐาน</p>
            <p className="mt-1 font-black text-slate-950">
              {(supplier.standards ?? ["Verified"]).join(", ")}
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          <Button href="/rfq/new">
            <Send className="h-4 w-4" />
            ขอใบเสนอราคา
          </Button>
          <Button href={`/suppliers/${supplier.slug}`} variant="outline">
            ดูโปรไฟล์
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function ServiceCard({ service }: { service: any }) {
  return (
    <Card className="overflow-hidden transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-soft">
      <div className="h-40 bg-[linear-gradient(135deg,#047857,#22c55e)] p-5 text-white">
        <div className="grid h-full place-items-center rounded-lg border border-white/30 bg-white/10 text-center">
          <Package className="mx-auto h-10 w-10" />
          <p className="mt-2 text-sm font-semibold">{service.category}</p>
        </div>
      </div>
      <div className="p-5">
        <Badge>{service.category}</Badge>
        <h3 className="mt-3 text-lg font-black text-slate-950">{service.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {service.description}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-muted p-3 text-sm">
          <div>
            <p className="text-muted-foreground">เริ่มต้น</p>
            <p className="font-black text-primary-deep">฿{service.startingPrice} / หน่วย</p>
          </div>
          <div>
            <p className="text-muted-foreground">MOQ</p>
            <p className="font-black">{service.moq}</p>
          </div>
        </div>
        <Button href={`/services/${service.slug}`} className="mt-4 w-full">
          ดูรายละเอียด
        </Button>
      </div>
    </Card>
  );
}

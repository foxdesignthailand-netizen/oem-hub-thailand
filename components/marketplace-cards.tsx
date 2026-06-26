import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  Megaphone,
  Package,
  PenTool,
  Printer,
  ShieldCheck,
  Star,
  Tags
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

export function VerifiedBadge() {
  return (
    <Badge tone="green">
      <CheckCircle2 className="h-3.5 w-3.5" />
      ยืนยันตัวตน
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
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card
        className={cn(
          "group h-full p-6 transition hover:-translate-y-1 hover:border-primary/50 hover:bg-primary-light hover:shadow-soft",
          featured && "border-primary/70"
        )}
      >
        <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-primary-light text-primary-deep group-hover:bg-white">
          <Icon className="h-7 w-7" />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">{category.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {category.description}
            </p>
            <p className="mt-4 text-sm font-semibold text-primary-deep">
              {category.count.toLocaleString("th-TH")} ซัพพลายเออร์
            </p>
          </div>
          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary-deep" />
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
    <Card className="grid gap-5 p-5 transition hover:border-primary/50 hover:shadow-soft lg:grid-cols-[140px_1fr_230px]">
      <div className="grid h-32 place-items-center rounded-xl border border-border bg-muted">
        <span className="text-3xl font-black text-primary-deep">{supplier.logo}</span>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/suppliers/${supplier.slug}`} className="text-xl font-bold hover:text-primary-deep">
            {supplier.name}
          </Link>
          {supplier.verified ? <VerifiedBadge /> : null}
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {supplier.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {supplier.tags.slice(0, compact ? 3 : 5).map((tag: string) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <RatingStars rating={supplier.rating} reviews={supplier.reviews} />
          <span>สำเร็จ {supplier.completedOrders.toLocaleString("th-TH")} ออเดอร์</span>
          <span>{supplier.province}</span>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-muted p-4">
        <div className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-1">
          <div>
            <p className="text-muted-foreground">MOQ ขั้นต่ำ</p>
            <p className="font-bold">{supplier.moq}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Lead Time</p>
            <p className="font-bold">{supplier.leadTime}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ช่วงราคา</p>
            <p className="font-bold">{supplier.priceRange}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          <Button href="/rfq/new">ขอใบเสนอราคา</Button>
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
      <div className="h-40 bg-[linear-gradient(135deg,#064e3b,#10b981)] p-5 text-white">
        <div className="grid h-full place-items-center rounded-lg border border-white/20 bg-white/10 text-center">
          <Package className="mx-auto h-10 w-10" />
          <p className="mt-2 text-sm font-semibold">{service.category}</p>
        </div>
      </div>
      <div className="p-5">
        <Badge>{service.category}</Badge>
        <h3 className="mt-3 text-lg font-bold">{service.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {service.description}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-muted p-3 text-sm">
          <div>
            <p className="text-muted-foreground">เริ่มต้น</p>
            <p className="font-bold text-primary-deep">฿{service.startingPrice} / หน่วย</p>
          </div>
          <div>
            <p className="text-muted-foreground">MOQ</p>
            <p className="font-bold">{service.moq}</p>
          </div>
        </div>
        <Button href={`/services/${service.slug}`} className="mt-4 w-full">
          ดูรายละเอียด
        </Button>
      </div>
    </Card>
  );
}

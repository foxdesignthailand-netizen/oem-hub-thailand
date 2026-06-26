import Link from "next/link";
import {
  Bell,
  Heart,
  LogIn,
  Menu,
  MessageCircle,
  Search,
  Send,
  UserRound
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  ["หาโรงงาน", "/suppliers"],
  ["บรรจุภัณฑ์", "/categories/packaging"],
  ["งานพิมพ์", "/categories/printing"],
  ["งานออกแบบ", "/categories/design"],
  ["เอกสารสินค้า", "/categories/compliance"],
  ["การตลาด", "/categories/marketing"],
  ["วิธีใช้งาน", "/how-it-works"]
];

export function Logo() {
  return (
    <Link className="flex items-center gap-3" href="/">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-deep text-lg font-black text-white shadow-sm">
        OH
      </span>
      <span className="leading-tight">
        <span className="block text-xl font-black tracking-tight">OEM Hub</span>
        <span className="block text-xs font-bold uppercase tracking-[0.22em] text-primary-deep">
          Thailand
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="container-page flex h-20 items-center gap-5">
        <Logo />
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navItems.map(([label, href]) => (
            <Link
              className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-primary-light hover:text-primary-deep"
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button href="/dashboard/buyer" variant="ghost">
            <LogIn className="h-4 w-4" />
            เข้าสู่ระบบ
          </Button>
          <Button href="/dashboard/supplier" variant="outline">
            สมัครเป็น Supplier
          </Button>
          <Button href="/rfq/new">
            <Send className="h-4 w-4" />
            ขอใบเสนอราคา
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <Button size="icon" variant="ghost" aria-label="ค้นหา">
            <Search className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" aria-label="เมนู">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export function AppTopbar({ role = "Buyer" }: { role?: string }) {
  return (
    <div className="flex h-20 items-center gap-4 border-b border-border bg-white px-4 sm:px-6">
      <div className="relative hidden flex-1 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          className="h-11 w-full max-w-xl rounded-lg border border-border bg-muted px-10 text-sm outline-none focus:ring-2 focus:ring-primary"
          placeholder="ค้นหา RFQ, คำสั่งซื้อ, ลูกค้า, สินค้า..."
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button size="icon" variant="ghost" aria-label="ข้อความ">
          <MessageCircle className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" aria-label="รายการโปรด">
          <Heart className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" aria-label="แจ้งเตือน">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="hidden items-center gap-3 border-l border-border pl-4 sm:flex">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light text-primary-deep">
            <UserRound className="h-5 w-5" />
          </span>
          <div className="text-sm">
            <p className="font-bold">สวัสดี, รุ่งโรจน์</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

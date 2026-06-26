import Link from "next/link";
import {
  BarChart3,
  Bell,
  Box,
  Building2,
  CreditCard,
  FileText,
  Home,
  MessageCircle,
  PackageCheck,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  Users
} from "lucide-react";
import { Logo, AppTopbar } from "@/components/site-header";
import { cn } from "@/lib/utils";

const icons = {
  Home,
  FileText,
  MessageCircle,
  ShoppingCart,
  CreditCard,
  Star,
  Users,
  Building2,
  ShieldCheck,
  Box,
  BarChart3,
  Bell,
  Settings,
  PackageCheck
};

export function DashboardShell({
  role,
  items,
  children
}: {
  role: string;
  items: { label: string; href: string; icon: keyof typeof icons; active?: boolean; badge?: number }[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-white p-5 lg:block">
        <Logo />
        <div className="mt-8 rounded-xl border border-primary-soft bg-primary-light p-4">
          <p className="text-sm font-bold text-primary-deep">OEM Hub Thailand</p>
          <p className="mt-1 text-xs text-primary-deep/75">{role}</p>
        </div>
        <nav className="mt-6 space-y-1">
          {items.map((item) => {
            const Icon = icons[item.icon];
            return (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-primary-light hover:text-primary-deep",
                  item.active && "bg-primary text-white hover:bg-primary hover:text-white"
                )}
                href={item.href}
                key={item.label}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary-deep">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <AppTopbar role={role} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

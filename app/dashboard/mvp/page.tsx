import { DashboardShell } from "@/components/dashboard-shell";
import { MvpControlPanel } from "@/components/mvp-control-panel";

const items = [
  { label: "Buyer Dashboard", href: "/dashboard/buyer", icon: "Home" as const },
  { label: "Supplier Dashboard", href: "/dashboard/supplier", icon: "Building2" as const },
  { label: "Admin Dashboard", href: "/admin", icon: "ShieldCheck" as const },
  { label: "MVP Control Center", href: "/dashboard/mvp", icon: "PackageCheck" as const, active: true },
  { label: "Deal Room", href: "/dashboard/deal-room", icon: "ShoppingCart" as const },
  { label: "File Center", href: "/dashboard/files", icon: "Database" as const },
  { label: "Workflow Console", href: "/dashboard/workflow", icon: "FileText" as const }
];

export default function MvpDashboardPage() {
  return (
    <DashboardShell items={items} role="MVP Control">
      <MvpControlPanel mode="full" />
    </DashboardShell>
  );
}

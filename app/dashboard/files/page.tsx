import { DashboardShell } from "@/components/dashboard-shell";
import { MvpControlPanel } from "@/components/mvp-control-panel";

const items = [
  { label: "Buyer Dashboard", href: "/dashboard/buyer", icon: "Home" as const },
  { label: "Supplier Dashboard", href: "/dashboard/supplier", icon: "Building2" as const },
  { label: "Admin Dashboard", href: "/admin", icon: "ShieldCheck" as const },
  { label: "MVP Control Center", href: "/dashboard/mvp", icon: "PackageCheck" as const },
  { label: "File Center", href: "/dashboard/files", icon: "Database" as const, active: true }
];

export default function FilesPage() {
  return (
    <DashboardShell items={items} role="Storage">
      <MvpControlPanel mode="files" />
    </DashboardShell>
  );
}

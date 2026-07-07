import { DashboardShell } from "@/components/dashboard-shell";
import { MvpControlPanel } from "@/components/mvp-control-panel";

const items = [
  { label: "Admin Dashboard", href: "/admin", icon: "Home" as const },
  { label: "Operations", href: "/admin/operations", icon: "ShieldCheck" as const, active: true },
  { label: "Supabase Status", href: "/admin/supabase-status", icon: "Database" as const },
  { label: "MVP Control Center", href: "/dashboard/mvp", icon: "PackageCheck" as const },
  { label: "File Center", href: "/dashboard/files", icon: "FileText" as const }
];

export default function AdminOperationsPage() {
  return (
    <DashboardShell items={items} role="Admin">
      <MvpControlPanel mode="admin" />
    </DashboardShell>
  );
}

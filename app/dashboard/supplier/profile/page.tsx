import { DashboardShell } from "@/components/dashboard-shell";
import { MvpControlPanel } from "@/components/mvp-control-panel";

const items = [
  { label: "Supplier Dashboard", href: "/dashboard/supplier", icon: "Home" as const },
  { label: "Company Profile", href: "/dashboard/supplier/profile", icon: "Building2" as const, active: true },
  { label: "Incoming RFQs", href: "/dashboard/supplier/rfqs", icon: "FileText" as const, badge: 8 },
  { label: "Deal Room", href: "/dashboard/deal-room", icon: "ShoppingCart" as const },
  { label: "File Center", href: "/dashboard/files", icon: "Database" as const },
  { label: "MVP Control Center", href: "/dashboard/mvp", icon: "PackageCheck" as const }
];

export default function SupplierProfilePage() {
  return (
    <DashboardShell items={items} role="Supplier">
      <MvpControlPanel mode="supplier" />
    </DashboardShell>
  );
}

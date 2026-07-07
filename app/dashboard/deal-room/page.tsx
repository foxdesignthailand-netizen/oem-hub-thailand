import { DashboardShell } from "@/components/dashboard-shell";
import { MvpControlPanel } from "@/components/mvp-control-panel";

const items = [
  { label: "Buyer Dashboard", href: "/dashboard/buyer", icon: "Home" as const },
  { label: "MVP Control Center", href: "/dashboard/mvp", icon: "PackageCheck" as const },
  { label: "Deal Room", href: "/dashboard/deal-room", icon: "ShoppingCart" as const, active: true },
  { label: "File Center", href: "/dashboard/files", icon: "Database" as const },
  { label: "Workflow Console", href: "/dashboard/workflow", icon: "FileText" as const }
];

export default function DealRoomPage() {
  return (
    <DashboardShell items={items} role="Buyer / Supplier">
      <MvpControlPanel mode="deal" />
    </DashboardShell>
  );
}

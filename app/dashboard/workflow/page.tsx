import { DashboardShell } from "@/components/dashboard-shell";
import { WorkflowConsole } from "@/components/workflow-console";
import { Badge } from "@/components/ui/badge";

const items = [
  { label: "Buyer Dashboard", href: "/dashboard/buyer", icon: "Home" as const },
  { label: "Supplier Dashboard", href: "/dashboard/supplier", icon: "Building2" as const },
  { label: "Admin Dashboard", href: "/admin", icon: "ShieldCheck" as const },
  { label: "Workflow Console", href: "/dashboard/workflow", icon: "PackageCheck" as const, active: true },
  { label: "Supabase Status", href: "/admin/supabase-status", icon: "Database" as const }
];

export default function WorkflowConsolePage() {
  return (
    <DashboardShell items={items} role="MVP Workflow">
      <div className="mb-6">
        <Badge className="mb-3">Phase 2-6 MVP</Badge>
        <h1 className="text-3xl font-black text-slate-950">RFQ to Order Workflow Console</h1>
        <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">
          หน้านี้ทำให้ทดสอบ workflow สำคัญของ OEM Hub Thailand ได้ครบลูป:
          Buyer สร้าง RFQ, Supplier ส่ง Quote, Buyer Accept, Manual Payment, Admin Verify,
          Supplier ส่งงาน, Buyer Completed และ Review
        </p>
      </div>
      <WorkflowConsole />
    </DashboardShell>
  );
}

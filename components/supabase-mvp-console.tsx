"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileUp,
  KeyRound,
  PackageCheck,
  RefreshCw,
  Send,
  ShieldCheck,
  Star,
  Store,
  UserRound
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/supabase/types";
import {
  loadMvpSession,
  mvpAcceptQuote,
  mvpCompleteOrder,
  mvpConfirmBuyerPayment,
  mvpCreateReview,
  mvpCreateRfq,
  mvpGetSnapshot,
  mvpMarkReadyForReview,
  mvpRegisterFile,
  mvpRegisterUser,
  mvpReportBuyerPayment,
  mvpReportPlatformFee,
  mvpSendQuote,
  mvpUpsertSupplierProfile,
  mvpVerifyPlatformFee,
  saveMvpSession,
  type MvpActionResult,
  type MvpSession,
  type MvpSnapshot
} from "@/lib/supabase/mvp-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";

const roleOptions: UserRole[] = ["BUYER", "SUPPLIER", "ADMIN", "SUPER_ADMIN"];

const actionGroups = [
  {
    title: "Buyer",
    description: "สร้าง RFQ, accept Quote, แจ้งชำระเงิน, ปิดงาน และรีวิว",
    icon: UserRound
  },
  {
    title: "Supplier",
    description: "จัดการโปรไฟล์ ส่ง Quote ยืนยันรับเงิน และส่งงาน",
    icon: Store
  },
  {
    title: "Admin",
    description: "ตรวจสอบ Order Activation Fee และดู snapshot ระบบ",
    icon: ShieldCheck
  }
];

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function getRows(snapshot: MvpSnapshot | undefined, key: keyof MvpSnapshot) {
  const rows = snapshot?.[key];
  return Array.isArray(rows) ? rows.slice(0, 4) : [];
}

export function SupabaseMvpConsole() {
  const [session, setSession] = useState<MvpSession>(() => loadMvpSession());
  const [displayName, setDisplayName] = useState("Buyer Demo");
  const [password, setPassword] = useState("oemhub-demo-123456");
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<MvpActionResult>({
    ok: true,
    message: "พร้อมเชื่อมต่อ Supabase MVP"
  });
  const [snapshot, setSnapshot] = useState<MvpSnapshot | undefined>();

  useEffect(() => {
    setSession(loadMvpSession());
  }, []);

  const hasSupabase = useMemo(() => Boolean(createSupabaseBrowserClient()), []);

  const updateSession = (next: Partial<MvpSession>) => {
    const merged = { ...session, ...next };
    setSession(merged);
    saveMvpSession(merged);
  };

  const run = async (label: string, action: () => Promise<MvpActionResult | { ok: boolean; message: string; snapshot?: MvpSnapshot }>) => {
    setBusy(label);
    const response = await action();
    setBusy(null);
    setResult({
      ok: response.ok,
      message: response.message,
      data: "data" in response ? response.data : undefined
    });

    if ("snapshot" in response && response.snapshot) {
      setSnapshot(response.snapshot);
    }

    const latest = loadMvpSession();
    setSession(latest);
  };

  const signUp = async () => {
    const client = createSupabaseBrowserClient();
    if (!client) {
      setResult({ ok: false, message: "ยังไม่ได้ตั้งค่า Supabase ใน .env.local" });
      return;
    }

    setBusy("signup");
    const { error } = await client.auth.signUp({
      email: session.actorEmail,
      password,
      options: {
        data: {
          display_name: displayName,
          role: session.role
        }
      }
    });
    setBusy(null);

    if (error) {
      setResult({ ok: false, message: error.message });
      return;
    }

    await run("register-user", () =>
      mvpRegisterUser({
        email: session.actorEmail,
        role: session.role,
        displayName
      })
    );
  };

  const signIn = async () => {
    const client = createSupabaseBrowserClient();
    if (!client) {
      setResult({ ok: false, message: "ยังไม่ได้ตั้งค่า Supabase ใน .env.local" });
      return;
    }

    setBusy("signin");
    const { error } = await client.auth.signInWithPassword({
      email: session.actorEmail,
      password
    });
    setBusy(null);

    setResult(error ? { ok: false, message: error.message } : { ok: true, message: "เข้าสู่ระบบ Supabase Auth แล้ว" });
  };

  const signOut = async () => {
    const client = createSupabaseBrowserClient();
    await client?.auth.signOut();
    setResult({ ok: true, message: "ออกจากระบบแล้ว" });
  };

  const refreshSnapshot = () => run("snapshot", () => mvpGetSnapshot());

  return (
    <Card className="border-emerald-100">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="mb-3">
              <Database className="h-3.5 w-3.5" />
              Supabase MVP Operations
            </Badge>
            <h2 className="text-2xl font-black text-slate-950">ระบบจริงที่ต่อฐานข้อมูลแล้ว</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              ใช้ส่วนนี้ทดสอบ Auth, RFQ, Quote, Order, Payment, Admin verification, Supplier profile, File metadata และ Review
              ผ่าน Supabase RPC ใหม่ หลังรัน migration ล่าสุด
            </p>
          </div>
          <Badge tone={hasSupabase ? "green" : "red"}>
            {hasSupabase ? "Supabase configured" : "Missing .env.local"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-2xl border border-border p-4">
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-primary" />
              <h3 className="font-black text-slate-950">Auth / Role MVP</h3>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input
                onChange={(event) => updateSession({ actorEmail: event.target.value })}
                placeholder="อีเมลผู้ใช้งาน"
                value={session.actorEmail}
              />
              <Input
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="ชื่อที่แสดง"
                value={displayName}
              />
              <Input
                onChange={(event) => setPassword(event.target.value)}
                placeholder="รหัสผ่านทดสอบ"
                type="password"
                value={password}
              />
              <Select
                onChange={(event) => updateSession({ role: event.target.value as UserRole })}
                value={session.role}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button disabled={busy === "signup"} onClick={signUp}>
                สมัคร/บันทึกผู้ใช้
              </Button>
              <Button disabled={busy === "signin"} onClick={signIn} variant="outline">
                เข้าสู่ระบบ
              </Button>
              <Button onClick={signOut} variant="ghost">
                ออกจากระบบ
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <h3 className="font-black text-slate-950">MVP Session</h3>
            <div className="mt-3 grid gap-2 text-sm">
              <SessionLine label="Buyer" value={session.buyerEmail} />
              <SessionLine label="Supplier" value={session.supplierEmail} />
              <SessionLine label="Admin" value={session.adminEmail} />
              <SessionLine label="RFQ" value={session.rfqNo ?? "-"} />
              <SessionLine label="Quote" value={session.quoteNo ?? "-"} />
              <SessionLine label="Order" value={session.orderNo ?? "-"} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {actionGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div className="rounded-2xl border border-border bg-white p-4" key={group.title}>
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-black text-slate-950">{group.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{group.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ActionButton busy={busy} label="1. สร้าง RFQ จริง" onClick={() => run("create-rfq", () => mvpCreateRfq())} icon={Send} />
          <ActionButton busy={busy} label="2. Supplier ส่ง Quote" onClick={() => run("send-quote", () => mvpSendQuote())} icon={ClipboardCheck} />
          <ActionButton busy={busy} label="3. Accept Quote → Order" onClick={() => run("accept-quote", () => mvpAcceptQuote())} icon={PackageCheck} />
          <ActionButton busy={busy} label="4. Buyer แจ้งชำระเงิน" onClick={() => run("buyer-payment", () => mvpReportBuyerPayment())} icon={CheckCircle2} />
          <ActionButton busy={busy} label="5. Supplier ยืนยันรับเงิน" onClick={() => run("confirm-payment", () => mvpConfirmBuyerPayment())} icon={Store} />
          <ActionButton busy={busy} label="6. แจ้ง Activation Fee" onClick={() => run("report-fee", () => mvpReportPlatformFee())} icon={ShieldCheck} />
          <ActionButton busy={busy} label="7. Admin Verify Fee" onClick={() => run("verify-fee", () => mvpVerifyPlatformFee())} icon={ShieldCheck} />
          <ActionButton busy={busy} label="8. Supplier ส่งงาน" onClick={() => run("ready-review", () => mvpMarkReadyForReview())} icon={PackageCheck} />
          <ActionButton busy={busy} label="9. Buyer ปิดงาน" onClick={() => run("complete-order", () => mvpCompleteOrder())} icon={CheckCircle2} />
          <ActionButton busy={busy} label="10. Review หลังจบงาน" onClick={() => run("create-review", () => mvpCreateReview())} icon={Star} />
          <ActionButton busy={busy} label="Supplier Profile" onClick={() => run("supplier-profile", () => mvpUpsertSupplierProfile())} icon={Store} />
          <ActionButton busy={busy} label="Register RFQ File" onClick={() => run("register-file", () => mvpRegisterFile())} icon={FileUp} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className={`rounded-2xl border p-4 ${result.ok ? "border-emerald-100 bg-emerald-50" : "border-red-100 bg-red-50"}`}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-black text-slate-950">Action Result</h3>
              <Badge tone={result.ok ? "green" : "red"}>{result.ok ? "OK" : "Error"}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.message}</p>
            <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-slate-950 p-3 text-xs leading-6 text-emerald-100">
              {formatJson(result.data ?? {})}
            </pre>
          </div>

          <div className="rounded-2xl border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-black text-slate-950">Database Snapshot</h3>
              <Button onClick={refreshSnapshot} size="sm" variant="outline">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <SnapshotList title="RFQs" rows={getRows(snapshot, "rfqs")} />
              <SnapshotList title="Quotes" rows={getRows(snapshot, "quotes")} />
              <SnapshotList title="Orders" rows={getRows(snapshot, "orders")} />
              <SnapshotList title="Payments" rows={getRows(snapshot, "payments")} />
              <SnapshotList title="Suppliers" rows={getRows(snapshot, "suppliers")} />
              <SnapshotList title="Files" rows={getRows(snapshot, "files")} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionButton({
  label,
  icon: Icon,
  busy,
  onClick
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  busy: string | null;
  onClick: () => void;
}) {
  return (
    <Button className="justify-between" disabled={Boolean(busy)} onClick={onClick} variant="primary">
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {busy ? "กำลังทำงาน..." : label}
      </span>
    </Button>
  );
}

function SessionLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
      <span className="font-bold text-muted-foreground">{label}</span>
      <span className="truncate text-right font-black text-slate-950">{value}</span>
    </div>
  );
}

function SnapshotList({ title, rows }: { title: string; rows: Array<Record<string, unknown>> }) {
  return (
    <div className="rounded-xl border border-border bg-muted p-3">
      <p className="font-black text-slate-950">{title}</p>
      <div className="mt-2 space-y-2">
        {rows.length ? (
          rows.map((row, index) => (
            <pre className="max-h-24 overflow-auto rounded-lg bg-white p-2 text-[11px] leading-5 text-slate-700" key={index}>
              {formatJson(row)}
            </pre>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">ยังไม่มีข้อมูล หรือยังไม่ได้กด Refresh</p>
        )}
      </div>
    </div>
  );
}

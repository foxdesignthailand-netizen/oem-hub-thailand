import { CheckCircle2, Database, ExternalLink, KeyRound, XCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createSupabaseServerClient, getSupabaseConfigStatus } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

async function getSupabaseStatus() {
  const config = getSupabaseConfigStatus();

  if (!config.isConfigured) {
    return {
      config,
      canConnect: false,
      schemaReady: false,
      message: "ยังไม่ได้ตั้งค่า Supabase URL และ anon key ในไฟล์ .env.local"
    };
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return {
      config,
      canConnect: false,
      schemaReady: false,
      message: "ยังสร้าง Supabase client ไม่ได้"
    };
  }

  const { data, error } = await supabase
    .from("system_settings")
    .select("key,value,description")
    .in("key", ["phase_1_schema_version", "phase_2_6_workflow_version"]);

  if (error) {
    return {
      config,
      canConnect: false,
      schemaReady: false,
      message: error.message
    };
  }

  const settings = (data ?? []) as Array<{ key: string }>;
  const markers = settings.map((item) => item.key);
  const hasPhase1 = markers.includes("phase_1_schema_version");
  const hasWorkflow = markers.includes("phase_2_6_workflow_version");

  return {
    config,
    canConnect: true,
    schemaReady: hasPhase1 && hasWorkflow,
    message:
      hasPhase1 && hasWorkflow
        ? "เชื่อมต่อ Supabase และพบ schema + workflow version แล้ว"
        : hasPhase1
          ? "เชื่อมต่อ Supabase ได้และพบ Phase 1 แล้ว แต่ยังไม่พบ Phase 2-6 workflow migration"
          : "เชื่อมต่อ Supabase ได้ แต่ยังไม่พบ schema version ให้รัน migration ก่อน"
  };
}

export default async function SupabaseStatusPage() {
  const status = await getSupabaseStatus();

  return (
    <>
      <SiteHeader />
      <main className="container-page py-10">
        <div className="mb-8 max-w-3xl">
          <Badge className="mb-4 px-4 py-2">
            <Database className="h-4 w-4" />
            Phase 1 Backend Foundation
          </Badge>
          <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
            Supabase connection status
          </h1>
          <p className="mt-3 leading-7 text-muted-foreground">
            หน้านี้ใช้เช็กแบบปลอดภัยว่าโปรเจกต์ตั้งค่า Supabase แล้วหรือยัง โดยไม่แสดง secret key
            และไม่กระทบหน้า public marketplace เดิม
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <h2 className="flex items-center gap-2 font-black text-slate-950">
                {status.config.isConfigured ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Environment
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {status.config.isConfigured
                  ? "พบค่า NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY แล้ว"
                  : "ยังขาดค่าที่จำเป็นสำหรับเชื่อม Supabase"}
              </p>
              {status.config.missingKeys.length ? (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">
                  {status.config.missingKeys.join(", ")}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="flex items-center gap-2 font-black text-slate-950">
                {status.canConnect ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Database
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{status.message}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="flex items-center gap-2 font-black text-slate-950">
                {status.schemaReady ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <KeyRound className="h-5 w-5 text-amber-500" />
                )}
                Schema
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {status.schemaReady
                  ? "ฐานข้อมูลมี marker ของ Phase 1 และ Phase 2-6 แล้ว พร้อมต่อ API จริงเข้ากับหน้าจอ"
                  : "หลังสร้าง Supabase project ให้รัน migration ในโฟลเดอร์ supabase/migrations ให้ครบทั้ง 2 ไฟล์ก่อน"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 rounded-lg border border-emerald-100 bg-emerald-50/70 p-5">
          <h2 className="font-black text-primary-deep">ลำดับถัดไป</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>สร้าง Supabase project ในบัญชีของคุณ</li>
            <li>คัดลอกค่า URL และ anon key มาใส่ในไฟล์ .env.local</li>
            <li>รัน SQL migration จากโฟลเดอร์ supabase/migrations ใน Supabase SQL Editor</li>
            <li>กลับมา refresh หน้านี้เพื่อดูสถานะ</li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/rfq/new">ไปหน้า RFQ</Button>
            <Button href="/admin" variant="outline">
              กลับ Admin
            </Button>
            <Button href="https://supabase.com/dashboard" variant="ghost">
              Supabase Dashboard
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

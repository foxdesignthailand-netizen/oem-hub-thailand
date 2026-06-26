"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container-page flex min-h-screen items-center justify-center py-20">
      <div className="max-w-md rounded-xl border border-border bg-white p-8 text-center shadow-card">
        <AlertTriangle className="mx-auto h-10 w-10 text-danger" />
        <h1 className="mt-4 text-2xl font-bold">เกิดข้อผิดพลาด</h1>
        <p className="mt-2 text-muted-foreground">
          ระบบโหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
        </p>
        <Button className="mt-6" onClick={reset}>
          โหลดใหม่
        </Button>
      </div>
    </main>
  );
}

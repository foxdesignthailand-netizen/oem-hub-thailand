import Link from "next/link";
import { EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-page flex min-h-screen items-center justify-center py-20">
      <EmptyState
        title="ไม่พบหน้าที่คุณต้องการ"
        description="ลิงก์นี้อาจถูกย้ายหรือยังไม่ได้เปิดใช้งาน"
        action={
          <Button asChild>
            <Link href="/">กลับหน้าแรก</Link>
          </Button>
        }
      />
    </main>
  );
}

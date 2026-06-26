import { CheckCircle2, Clock, Paperclip, Send, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatBaht } from "@/lib/utils";

export function StatCard({
  title,
  value,
  change,
  tone = "green"
}: {
  title: string;
  value: string;
  change: string;
  tone?: "green" | "blue" | "orange" | "purple" | "red";
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-light text-primary-deep">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
      </div>
      <Badge className="mt-4" tone={tone === "red" ? "red" : tone}>
        {change}
      </Badge>
    </Card>
  );
}

export function QuoteComparisonTable({ quotes }: { quotes: any[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h2 className="text-xl font-bold">เปรียบเทียบใบเสนอราคา</h2>
          <p className="text-sm text-muted-foreground">ได้รับใบเสนอราคา {quotes.length} รายการ</p>
        </div>
        <Button variant="outline">ตัวกรอง</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-5 py-3">ผู้เสนอราคา</th>
              <th className="px-5 py-3">ราคา</th>
              <th className="px-5 py-3">MOQ</th>
              <th className="px-5 py-3">Lead Time</th>
              <th className="px-5 py-3">คะแนน</th>
              <th className="px-5 py-3">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr className="border-t border-border" key={quote.supplier}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {quote.recommended ? <Badge>แนะนำ</Badge> : null}
                    <span className="font-semibold">{quote.supplier}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <b className="text-primary-deep">฿{quote.price.toFixed(2)} / ชิ้น</b>
                  <p className="text-xs text-muted-foreground">{formatBaht(quote.total)} รวม</p>
                </td>
                <td className="px-5 py-4">{quote.moq}</td>
                <td className="px-5 py-4">{quote.leadTime}</td>
                <td className="px-5 py-4">★ {quote.rating}</td>
                <td className="px-5 py-4">
                  <Button size="sm">เลือกใบเสนอราคา</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function OrderTimeline() {
  const steps = ["เปิดคำสั่งซื้อ", "ยืนยันแบบ", "เริ่มผลิต", "ตรวจคุณภาพ", "จัดส่ง"];
  return (
    <div className="grid gap-3 sm:grid-cols-5">
      {steps.map((step, index) => (
        <div className="rounded-xl border border-border bg-white p-4 text-center" key={step}>
          <div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-primary-light text-primary-deep">
            {index < 3 ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
          </div>
          <p className="mt-3 text-sm font-semibold">{index + 1}. {step}</p>
        </div>
      ))}
    </div>
  );
}

export function MessageThread() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">ข้อความล่าสุด</h2>
        <Button variant="ghost" size="sm">ดูทั้งหมด</Button>
      </div>
      <div className="mt-5 space-y-4">
        {["Precision Part Co., Ltd.", "คุณ รุ่งโรจน์"].map((name, index) => (
          <div className={index === 1 ? "ml-8 rounded-xl bg-primary-light p-4" : "rounded-xl bg-muted p-4"} key={name}>
            <p className="text-sm font-bold">{name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {index === 0
                ? "แนบใบเสนอราคาพร้อมรายละเอียดเพิ่มเติมให้แล้วครับ"
                : "ขอบคุณครับ ขอสอบถามเรื่องการชำระเงินและการรับประกันสินค้าเพิ่มเติมครับ"}
            </p>
            {index === 0 ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-white p-3 text-sm">
                <Paperclip className="h-4 w-4 text-danger" />
                Quotation_RFQ-2024-00089.pdf
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <input className="h-11 flex-1 rounded-lg border border-border px-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="พิมพ์ข้อความ..." />
        <Button size="icon" aria-label="ส่งข้อความ">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export function AdminDataTable({
  title,
  rows
}: {
  title: string;
  rows: { id: string; name: string; meta: string; status: string }[];
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-5">
        <h2 className="text-lg font-bold">{title}</h2>
        <Button variant="ghost" size="sm">ดูทั้งหมด</Button>
      </div>
      <table className="w-full text-left text-sm">
        <tbody>
          {rows.map((row) => (
            <tr className="border-b border-border last:border-0" key={row.id}>
              <td className="p-4 font-semibold text-primary-deep">{row.id}</td>
              <td className="p-4">{row.name}</td>
              <td className="p-4 text-muted-foreground">{row.meta}</td>
              <td className="p-4 text-right">
                <Badge tone={row.status.includes("รอ") ? "orange" : "green"}>{row.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileUp,
  Package,
  Send
} from "lucide-react";
import { categories } from "@/lib/data";
import { Alert, ToastPreview } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const steps = [
  "เลือกหมวด",
  "รายละเอียดสินค้า",
  "จำนวน / งบประมาณ",
  "บริการเพิ่มเติม",
  "แนบไฟล์อ้างอิง",
  "ตรวจสอบและส่ง"
];

export function RFQWizard() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(categories[0].slug);
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card className="p-5 sm:p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>ขั้นตอนที่ {step + 1} จาก {steps.length}</span>
            <span className="text-primary-deep">{Math.round(progress)}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {steps.map((label, index) => (
              <div
                className={cn(
                  "rounded-lg border border-border bg-white px-3 py-2 text-center text-xs font-semibold text-muted-foreground",
                  index === step && "border-primary bg-primary-light text-primary-deep",
                  index < step && "border-primary-soft bg-primary-light text-primary-deep"
                )}
                key={label}
              >
                {index + 1}. {label}
              </div>
            ))}
          </div>
        </div>

        {step === 0 ? (
          <section>
            <h1 className="text-2xl font-bold">เลือกหมวดหมู่ที่ใกล้เคียงที่สุด</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              เลือกหมวดหลักเพื่อให้ระบบจับคู่กับ Supplier ที่เหมาะสม
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 6).map((item) => (
                <button
                  className={cn(
                    "rounded-xl border border-border bg-white p-4 text-left transition hover:border-primary hover:bg-primary-light",
                    category === item.slug && "border-primary bg-primary-light"
                  )}
                  key={item.slug}
                  onClick={() => setCategory(item.slug)}
                  type="button"
                >
                  <Package className="h-6 w-6 text-primary-deep" />
                  <p className="mt-3 font-bold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {step === 1 ? (
          <section className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold">บอกสินค้าที่ต้องการผลิต</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                ยิ่งรายละเอียดชัด Supplier จะประเมินราคาและเวลาได้แม่นยำขึ้น
              </p>
            </div>
            <Input placeholder="ชื่อสินค้า เช่น เซรั่มวิตามินซี 30 ml" />
            <Textarea placeholder="รายละเอียดสินค้า วัสดุ ขนาด สี มาตรฐาน หรือ reference ที่ต้องการ" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="วัสดุ / สูตร / เกรดสินค้า" />
              <Input placeholder="ขนาด / น้ำหนัก / ปริมาตร" />
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="space-y-5">
            <h1 className="text-2xl font-bold">จำนวน งบประมาณ และกำหนดส่ง</h1>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input placeholder="จำนวนผลิต เช่น 10,000 ชิ้น" />
              <Input placeholder="งบประมาณ เช่น 150,000 บาท" />
              <Input type="date" />
            </div>
            <Select defaultValue="">
              <option value="" disabled>
                ความเร่งด่วน
              </option>
              <option>ปกติ</option>
              <option>เร่งด่วนภายใน 14 วัน</option>
              <option>ต้องการปรึกษาก่อน</option>
            </Select>
            <Alert
              title="ข้อมูลของคุณจะถูกเก็บเป็นความลับ"
              description="Supplier จะเห็นข้อมูล RFQ แบบจำกัดจนกว่าคุณจะเลือกเริ่มดีลกับรายนั้น"
            />
          </section>
        ) : null}

        {step === 3 ? (
          <section>
            <h1 className="text-2xl font-bold">เลือกบริการเพิ่มเติม</h1>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["ออกแบบแพ็กเกจ", "ขึ้นทะเบียน อย.", "ถ่ายภาพสินค้า", "ทำฉลาก / สติ๊กเกอร์", "จัดส่งสินค้า", "ที่ปรึกษาการตลาด"].map((label) => (
                <label className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 text-sm font-semibold" key={label}>
                  <input className="h-4 w-4 accent-primary" type="checkbox" />
                  {label}
                </label>
              ))}
            </div>
          </section>
        ) : null}

        {step === 4 ? (
          <section>
            <h1 className="text-2xl font-bold">แนบไฟล์ reference</h1>
            <div className="mt-6 rounded-xl border border-dashed border-primary-soft bg-primary-light p-8 text-center">
              <FileUp className="mx-auto h-10 w-10 text-primary-deep" />
              <p className="mt-4 font-bold">ลากไฟล์มาวาง หรือเลือกไฟล์จากเครื่อง</p>
              <p className="mt-2 text-sm text-muted-foreground">
                รองรับ PDF, AI, PSD, JPG, PNG, XLSX และ Drawing
              </p>
              <Button className="mt-5" variant="outline">เลือกไฟล์</Button>
            </div>
          </section>
        ) : null}

        {step === 5 ? (
          <section>
            <h1 className="text-2xl font-bold">ตรวจสอบก่อนส่ง RFQ</h1>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["หมวดหมู่", categories.find((item) => item.slug === category)?.title ?? "-"],
                ["สินค้า", "เซรั่มวิตามินซี 30 ml"],
                ["จำนวน", "10,000 ชิ้น"],
                ["งบประมาณ", "150,000 บาท"],
                ["กำหนดส่ง", "ภายใน 30 วัน"],
                ["บริการเพิ่มเติม", "แพ็กเกจ, ฉลาก, ถ่ายภาพ"]
              ].map(([label, value]) => (
                <div className="rounded-xl border border-border bg-muted p-4" key={label}>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 font-bold">{value}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
          <Button
            disabled={step === 0}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4" />
            ย้อนกลับ
          </Button>
          <Button onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>
            {step === steps.length - 1 ? (
              <>
                <Send className="h-4 w-4" />
                ส่ง RFQ
              </>
            ) : (
              <>
                ถัดไป
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </Card>

      <aside className="space-y-4">
        <Card className="p-5">
          <h2 className="text-lg font-bold">RFQ ที่ดีควรมี</h2>
          <div className="mt-4 space-y-3 text-sm">
            {["รายละเอียดสินค้า", "จำนวนผลิตที่ชัดเจน", "รูปภาพหรือไฟล์ตัวอย่าง", "มาตรฐานที่ต้องการ", "กำหนดเวลาที่คาดหวัง"].map((item) => (
              <div className="flex items-center gap-2" key={item}>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <Badge>ระบบจับคู่อัตโนมัติ</Badge>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            หลังส่ง RFQ ระบบจะคัด Supplier ที่เหมาะกับหมวดสินค้า กำลังผลิต และพื้นที่ให้คุณ
          </p>
        </Card>
      </aside>
      <ToastPreview />
    </div>
  );
}

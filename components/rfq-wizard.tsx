"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Box,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  FileText,
  FileUp,
  HelpCircle,
  Mail,
  Megaphone,
  Package,
  PackageCheck,
  PenTool,
  Phone,
  Printer,
  Send,
  ShieldCheck,
  Sparkles,
  Tags,
  WalletCards
} from "lucide-react";
import { categories } from "@/lib/data";
import { Alert, ToastPreview } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createInitialWorkflowState, createRfq, workflowStorageKey, type WorkflowState } from "@/lib/workflow";

const steps = [
  { title: "เลือกประเภทสินค้า", icon: Package },
  { title: "ระบุรายละเอียดสินค้า", icon: FileText },
  { title: "สเปกและปริมาณ", icon: ClipboardCheck },
  { title: "งบประมาณและเวลา", icon: WalletCards },
  { title: "ข้อมูลติดต่อ", icon: Mail },
  { title: "ตรวจสอบและส่ง RFQ", icon: Send }
];

const categoryIcons = {
  Factory,
  Package,
  Tags,
  Printer,
  PenTool,
  Camera,
  ClipboardCheck,
  ShieldCheck,
  Megaphone
};

const productExamples = [
  { label: "สกินแคร์", hint: "ครีม เซรั่ม โทนเนอร์", icon: Sparkles },
  { label: "อาหารเสริม", hint: "แคปซูล ผงชงดื่ม วิตามิน", icon: PackageCheck },
  { label: "บรรจุภัณฑ์", hint: "ขวด ฝา ซอง กล่อง", icon: Box },
  { label: "ฉลาก", hint: "สติ๊กเกอร์ ฉลากกันน้ำ ฟอยล์", icon: Tags },
  { label: "งานพิมพ์", hint: "กล่อง โบรชัวร์ การ์ดสินค้า", icon: FileText },
  { label: "อื่น ๆ", hint: "ชิ้นส่วน งานเฉพาะทาง", icon: HelpCircle }
];

const productExampleImages = [
  "/images/category-skincare.png",
  "/images/oem-hero-marketplace.png",
  "/images/category-packaging.png",
  "/images/category-labels.png",
  "/images/category-printing.png",
  "/images/spot-workflow.png"
];

const sidebarChecklist = [
  "รายละเอียดสินค้า",
  "จำนวนผลิต",
  "สเปก/มาตรฐาน",
  "งบประมาณ",
  "กำหนดเวลา",
  "ข้อมูลติดต่อ"
];

export function RFQWizard() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(categories[0].slug);
  const [example, setExample] = useState(productExamples[0].label);
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);
  const selectedCategory = categories.find((item) => item.slug === category);

  const goNext = () => setStep((current) => Math.min(steps.length - 1, current + 1));
  const goBack = () => setStep((current) => Math.max(0, current - 1));
  const submitRfq = () => {
    if (typeof window === "undefined") return;

    let currentState: WorkflowState;
    const raw = window.localStorage.getItem(workflowStorageKey);

    try {
      currentState = raw ? (JSON.parse(raw) as WorkflowState) : createInitialWorkflowState();
    } catch {
      currentState = createInitialWorkflowState();
    }

    const nextState = createRfq(currentState, {
      title: `${example} สำหรับแบรนด์ใหม่ พร้อมรายละเอียดการผลิต`,
      category: selectedCategory?.title ?? "OEM / ODM",
      quantity: 3000,
      budget: 150000
    });

    window.localStorage.setItem(workflowStorageKey, JSON.stringify(nextState));
    window.location.href = "/dashboard/workflow";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card className="overflow-hidden border-emerald-100">
        <div className="border-b border-emerald-100 bg-gradient-to-r from-white to-emerald-50/70 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-primary-deep">
                ขั้นตอนที่ {step + 1} จาก {steps.length}
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">{steps[step].title}</h2>
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-primary-deep ring-1 ring-emerald-100">
              {Math.round(progress)}% complete
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full bg-white ring-1 ring-emerald-100">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
            {steps.map((item, index) => (
              <button
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-border/80 bg-white px-3 py-3 text-left text-xs font-bold text-muted-foreground transition",
                  index === step && "border-primary bg-primary-light text-primary-deep shadow-sm",
                  index < step && "border-primary-soft bg-primary-light/70 text-primary-deep"
                )}
                key={item.title}
                onClick={() => setStep(index)}
                type="button"
              >
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-xs",
                    index <= step && "bg-primary text-white"
                  )}
                >
                  {index < step ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </span>
                <span className="leading-5">{item.title}</span>
                <item.icon className="hidden h-4 w-4 shrink-0 opacity-70 sm:block" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {step === 0 ? (
            <section>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-950">เริ่มจากเลือกสิ่งที่ใกล้เคียงกับงานของคุณที่สุด</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    ถ้ายังไม่แน่ใจ เลือกหมวดที่ใกล้ที่สุดก่อน แล้วเพิ่มรายละเอียดในขั้นตอนถัดไปได้
                  </p>
                </div>
                <Badge className="w-fit">เลือกได้คร่าว ๆ ก่อน</Badge>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.slice(0, 6).map((item) => {
                  const Icon = categoryIcons[item.icon as keyof typeof categoryIcons] ?? Package;
                  return (
                    <button
                      className={cn(
                        "group rounded-lg border border-border/80 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary-light hover:shadow-card",
                        category === item.slug && "border-primary bg-primary-light shadow-card"
                      )}
                      key={item.slug}
                      onClick={() => setCategory(item.slug)}
                      type="button"
                    >
                      <div className="flex items-start gap-3">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-50 text-primary-deep ring-1 ring-emerald-100 group-hover:bg-white">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-black text-slate-950">{item.title}</p>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-7">
                <p className="font-black text-slate-950">หรือเลือกตัวอย่างสินค้าที่ใกล้เคียง</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {productExamples.map((item, index) => {
                    const image = productExampleImages[index];

                    return (
                      <button
                        className={cn(
                          "grid gap-3 overflow-hidden rounded-lg border border-border/80 bg-white p-3 text-left transition hover:border-primary hover:bg-primary-light",
                          example === item.label && "border-primary bg-primary-light"
                        )}
                        key={item.label}
                        onClick={() => setExample(item.label)}
                        type="button"
                      >
                        {image ? (
                          <Image
                            alt={`${item.label} example`}
                            className="h-24 w-full rounded-md object-cover"
                            height={240}
                            src={image}
                            width={480}
                          />
                        ) : null}
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-primary-deep">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-black text-slate-950">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.hint}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}

          {step === 1 ? (
            <section className="space-y-5">
              <div>
                <h3 className="text-2xl font-black text-slate-950">เล่าให้ Supplier เข้าใจว่าคุณอยากผลิตอะไร</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  เขียนแบบภาษาธรรมดาได้เลย เช่น รูปแบบสินค้า กลิ่น สี ขนาด วัสดุ หรือ reference ที่ชอบ
                </p>
              </div>
              <Input placeholder={`ชื่อสินค้า เช่น ${example === "อื่น ๆ" ? "ชิ้นส่วนตามแบบ" : `${example} สำหรับแบรนด์ใหม่`}`} />
              <Textarea placeholder="รายละเอียดสินค้า เช่น ต้องการผลิตเซรั่มบำรุงผิว 30 ml เนื้อบางเบา กลิ่นอ่อน พร้อมขวด ปั๊ม ฉลาก และกล่อง" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input placeholder="วัสดุ / สูตร / เกรดสินค้า เช่น Food grade, Natural, Aluminum 6061" />
                <Input placeholder="ขนาด / น้ำหนัก / ปริมาตร เช่น 30 ml, 100 g, 10 x 15 cm" />
              </div>
              <Alert
                title="ยังไม่รู้สเปกครบก็เริ่มได้"
                description="กรอกเท่าที่มี ระบบจะช่วยจัดโครงข้อมูลให้ Supplier เข้าใจง่ายขึ้น และคุณสามารถแนบ reference เพิ่มได้ภายหลัง"
              />
            </section>
          ) : null}

          {step === 2 ? (
            <section className="space-y-5">
              <div>
                <h3 className="text-2xl font-black text-slate-950">ระบุสเปกสำคัญและจำนวนผลิต</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  ข้อมูลส่วนนี้ช่วยให้ Supplier ประเมิน MOQ ต้นทุน และความเป็นไปได้ของงานได้แม่นขึ้น
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input placeholder="จำนวนผลิต เช่น 1,000 ชิ้น" />
                <Input placeholder="MOQ ที่รับได้ เช่น 500 ชิ้น" />
                <Input placeholder="จำนวนแบบ / สี / SKU เช่น 3 สี" />
              </div>
              <Textarea placeholder="สเปกหรือมาตรฐานที่ต้องการ เช่น GMP, ISO 9001, อย., Food grade, กันน้ำ, ทนความร้อน, Pantone สีที่ต้องการ" />
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
                <p className="font-black text-primary-deep">ตัวอย่างสเปกที่ช่วยให้ใบเสนอราคาแม่นขึ้น</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["สูตร/วัสดุ", "ขนาด", "จำนวน", "มาตรฐาน", "ไฟล์แบบ", "ตัวอย่างสินค้า"].map((item) => (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-emerald-100" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="space-y-5">
              <div>
                <h3 className="text-2xl font-black text-slate-950">บอกช่วงงบประมาณและเวลาที่ต้องการ</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  ไม่จำเป็นต้องเป็นตัวเลขสุดท้าย ระบุเป็นช่วงเพื่อให้ Supplier แนะนำทางเลือกที่เหมาะสมได้
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input placeholder="งบประมาณ เช่น 150,000 บาท" />
                <Input placeholder="ราคาต่อหน่วยเป้าหมาย เช่น ไม่เกิน 50 บาท" />
                <Input type="date" />
              </div>
              <Select defaultValue="">
                <option value="" disabled>
                  ความเร่งด่วน
                </option>
                <option>ปกติ ยืดหยุ่นได้</option>
                <option>ต้องการราคาเร็วภายใน 3 วัน</option>
                <option>ต้องเริ่มผลิตภายใน 14 วัน</option>
                <option>ต้องการปรึกษาก่อนกำหนดเวลา</option>
              </Select>
              <Alert
                title="ข้อมูลของคุณปลอดภัย"
                description="ข้อมูลของคุณจะใช้เพื่อจับคู่ Supplier ที่เหมาะสมและช่วยให้ประเมินราคาได้แม่นขึ้นเท่านั้น"
              />
            </section>
          ) : null}

          {step === 4 ? (
            <section className="space-y-5">
              <div>
                <h3 className="text-2xl font-black text-slate-950">ข้อมูลติดต่อสำหรับติดตาม RFQ</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  ระบบใช้ข้อมูลนี้สำหรับแจ้งเตือนใบเสนอราคาและประสานงานในระบบ OEM Hub
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input placeholder="ชื่อผู้ติดต่อ" />
                <Input placeholder="ชื่อบริษัท / แบรนด์" />
                <Input placeholder="อีเมล" type="email" />
                <Input placeholder="เบอร์โทรศัพท์" />
              </div>
              <Textarea placeholder="ช่องทางติดต่อหรือหมายเหตุเพิ่มเติม เช่น เวลาที่สะดวกให้ติดต่อ หรือผู้ประสานงานสำรอง" />
              <div className="rounded-lg border border-dashed border-primary-soft bg-primary-light/70 p-5">
                <FileUp className="h-8 w-8 text-primary-deep" />
                <p className="mt-3 font-black text-slate-950">แนบไฟล์ reference ถ้ามี</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  รองรับ PDF, AI, PSD, JPG, PNG, XLSX และ Drawing เพื่อช่วยให้ Supplier เข้าใจภาพรวมเร็วขึ้น
                </p>
                <Button className="mt-4" variant="outline">เลือกไฟล์</Button>
              </div>
            </section>
          ) : null}

          {step === 5 ? (
            <section>
              <div>
                <h3 className="text-2xl font-black text-slate-950">ตรวจสอบข้อมูลก่อนส่ง RFQ</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  หลังส่งแล้ว ระบบจะใช้ข้อมูลนี้ช่วยจับคู่ Supplier ที่เกี่ยวข้องเพื่อให้เสนอราคากลับมา
                </p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["ประเภทสินค้า", selectedCategory?.title ?? "-"],
                  ["ตัวอย่างสินค้า", example],
                  ["รายละเอียดสินค้า", "เซรั่ม 30 ml พร้อมขวด ฉลาก และกล่อง"],
                  ["จำนวนผลิต", "1,000-3,000 ชิ้น"],
                  ["งบประมาณ", "ประมาณ 150,000 บาท"],
                  ["กำหนดเวลา", "ต้องการเริ่มภายใน 30 วัน"],
                  ["มาตรฐาน", "GMP / อย. ถ้ามี"],
                  ["ข้อมูลติดต่อ", "ทีมจัดซื้อ / Brand owner"]
                ].map(([label, value]) => (
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50/45 p-4" key={label}>
                    <p className="text-sm font-bold text-muted-foreground">{label}</p>
                    <p className="mt-1 font-black text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-emerald-100 bg-white p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-deep" />
                  <p className="text-sm leading-6 text-muted-foreground">
                    ข้อมูลของคุณปลอดภัย และจะใช้เพื่อจับคู่ Supplier ที่เหมาะสมกับโจทย์นี้เท่านั้น
                  </p>
                </div>
              </div>
            </section>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-emerald-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <Button
            disabled={step === 0}
            onClick={goBack}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4" />
            ย้อนกลับ
          </Button>
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <Button
              className="min-w-[190px]"
              onClick={step === steps.length - 1 ? submitRfq : goNext}
              size="lg"
            >
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
            <p className="text-xs text-muted-foreground">
              ข้อมูลของคุณปลอดภัย และจะใช้เพื่อจับคู่ Supplier ที่เหมาะสม
            </p>
          </div>
        </div>
      </Card>

      <aside className="space-y-4">
        <Card className="sticky top-24 border-emerald-100 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-light text-primary-deep">
              <BadgeCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-black text-primary-deep">Checklist</p>
              <h2 className="text-lg font-black text-slate-950">RFQ ที่ดีควรมี</h2>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            {sidebarChecklist.map((item) => (
              <div className="flex items-center gap-3 rounded-lg bg-emerald-50/70 p-3 font-bold text-slate-700" key={item}>
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-emerald-100 bg-white p-4">
            <p className="font-black text-primary-deep">เคล็ดลับ</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              ยิ่งกรอกข้อมูลครบ Supplier จะยิ่งประเมินราคา MOQ และเวลาผลิตได้แม่นขึ้น
            </p>
          </div>
        </Card>

        <Card className="border-emerald-100 bg-primary-light/60 p-5">
          <Badge>ระบบช่วยจัดโจทย์ให้ Supplier</Badge>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            หลังส่ง RFQ ระบบจะใช้หมวดหมู่ สเปก จำนวน และพื้นที่ เพื่อช่วยจับคู่กับ Supplier ที่เกี่ยวข้อง
          </p>
        </Card>

        <Card className="border-emerald-100 p-5">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary-deep" />
            <h3 className="font-black text-slate-950">ต้องการให้ทีมช่วย?</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            หากยังไม่แน่ใจว่าจะเลือกหมวดไหน ให้กรอกเท่าที่มี ทีมงานสามารถช่วยปรับโจทย์ให้พร้อมส่ง Supplier ได้
          </p>
        </Card>
      </aside>
      <ToastPreview />
    </div>
  );
}

import { Mail, MapPin, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-page section-y">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section>
            <p className="font-semibold text-primary-deep">ติดต่อเรา</p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">ให้ทีม OEM Hub ช่วยคุณเริ่มต้น</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              ไม่แน่ใจว่าควรเลือก Supplier แบบไหน หรืออยากให้ช่วยประเมินโจทย์ก่อนส่ง RFQ ส่งข้อมูลมาได้เลย
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: Phone, title: "02-000-0000", text: "จันทร์-ศุกร์ 09:00-18:00" },
                { icon: Mail, title: "hello@oemhub.co.th", text: "ตอบกลับภายใน 1 วันทำการ" },
                { icon: MapPin, title: "กรุงเทพมหานคร ประเทศไทย", text: "ให้บริการทั่วประเทศ" }
              ].map((item) => (
                <Card className="flex items-center gap-4 p-4" key={item.title}>
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-light text-primary-deep">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
          <Card className="p-6">
            <h2 className="text-2xl font-bold">ส่งข้อความถึงทีมงาน</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input placeholder="ชื่อ-นามสกุล" />
              <Input placeholder="อีเมล" type="email" />
              <Input placeholder="เบอร์โทร" />
              <Select defaultValue="">
                <option value="" disabled>หัวข้อที่ต้องการติดต่อ</option>
                <option>ต้องการหา Supplier</option>
                <option>สมัครเป็น Supplier</option>
                <option>สอบถามแพ็กเกจองค์กร</option>
              </Select>
            </div>
            <Textarea className="mt-4" placeholder="เล่าโจทย์หรือคำถามของคุณ" />
            <Button className="mt-5 w-full">ส่งข้อความ</Button>
          </Card>
        </div>
      </main>
    </>
  );
}

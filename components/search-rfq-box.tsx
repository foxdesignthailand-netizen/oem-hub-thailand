import { Search, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";

export function SearchRfqBox() {
  return (
    <Card className="border-emerald-100 bg-white/95 p-4 shadow-soft sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-black text-primary-deep">
            <Sparkles className="h-4 w-4" />
            เริ่มต้นจากโจทย์ของคุณ
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-950">
            ขอใบเสนอราคา หรือค้นหา Supplier ที่เหมาะกับงานผลิต
          </h2>
        </div>
        <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary-deep">
          ฟรี ไม่มีค่าใช้จ่ายสำหรับ Buyer
        </span>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1.7fr_repeat(3,0.9fr)_auto]">
        <Input
          placeholder="บอกสิ่งที่ต้องการผลิต เช่น สกินแคร์ 1,000 ชิ้น พร้อมบรรจุภัณฑ์"
        />
        <Select defaultValue="">
          <option value="" disabled>
            หมวดหมู่
          </option>
          <option>โรงงาน OEM / ODM</option>
          <option>บรรจุภัณฑ์</option>
          <option>งานพิมพ์</option>
          <option>เอกสาร อย. / GMP / ISO</option>
        </Select>
        <Select defaultValue="">
          <option value="" disabled>
            จำนวนผลิต
          </option>
          <option>100-500 ชิ้น</option>
          <option>500-1,000 ชิ้น</option>
          <option>มากกว่า 1,000 ชิ้น</option>
        </Select>
        <Select defaultValue="">
          <option value="" disabled>
            งบประมาณ
          </option>
          <option>ต่ำกว่า 50,000</option>
          <option>50,000-200,000</option>
          <option>มากกว่า 200,000</option>
        </Select>
        <Button href="/rfq/new" className="whitespace-nowrap">
          <Send className="h-4 w-4" />
          เริ่ม RFQ
        </Button>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          {["สกินแคร์", "อาหารเสริม", "ขวดและฝา", "สติ๊กเกอร์", "กล่องพิมพ์แบรนด์"].map((item) => (
            <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200" key={item}>
              {item}
            </span>
          ))}
        </div>
        <Button href="/suppliers" variant="ghost" className="justify-start sm:justify-center">
          <Search className="h-4 w-4" />
          ค้นหา Supplier ก่อน
        </Button>
      </div>
    </Card>
  );
}

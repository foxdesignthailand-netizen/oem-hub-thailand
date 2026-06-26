import { Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";

export function SearchRfqBox() {
  return (
    <Card className="p-5 sm:p-6">
      <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(5,1fr)]">
        <Input
          className="lg:col-span-2"
          placeholder="คุณอยากผลิตอะไร? เช่น ครีม, อาหารเสริม, น้ำยา, ขวด, ฉลาก, กล่อง"
        />
        <Select defaultValue="">
          <option value="" disabled>
            หมวดหมู่
          </option>
          <option>โรงงาน OEM / ODM</option>
          <option>บรรจุภัณฑ์</option>
          <option>งานพิมพ์</option>
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
            จังหวัด
          </option>
          <option>กรุงเทพฯ</option>
          <option>สมุทรปราการ</option>
          <option>ชลบุรี</option>
        </Select>
        <Select defaultValue="">
          <option value="" disabled>
            งบประมาณ
          </option>
          <option>ต่ำกว่า 50,000</option>
          <option>50,000-200,000</option>
          <option>มากกว่า 200,000</option>
        </Select>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button href="/suppliers" variant="outline">
          <Search className="h-4 w-4" />
          ค้นหา Supplier
        </Button>
        <Button href="/rfq/new">
          <Send className="h-4 w-4" />
          สร้าง RFQ ให้หลายเจ้าเสนอราคา
        </Button>
      </div>
    </Card>
  );
}

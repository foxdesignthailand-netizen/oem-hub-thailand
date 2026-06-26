import { SiteHeader } from "@/components/site-header";
import { RFQWizard } from "@/components/rfq-wizard";

export default function NewRFQPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-page section-y">
        <div className="mb-8">
          <p className="font-semibold text-primary-deep">สร้าง RFQ ใหม่</p>
          <h1 className="mt-2 text-4xl font-black">บอกโจทย์ครั้งเดียว ให้หลาย Supplier เสนอราคา</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            ฟอร์มนี้ช่วยจัดข้อมูลให้ครบถ้วน เหมาะกับการส่งให้โรงงานหรือผู้ให้บริการประเมินราคาอย่างมืออาชีพ
          </p>
        </div>
        <RFQWizard />
      </main>
    </>
  );
}

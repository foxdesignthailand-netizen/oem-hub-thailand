# AGENTS.md

คุยด้วยภาษาไทยเป็นหลัก

## Before Working

ก่อนเริ่มแก้โค้ดหรือ implement feature ใหม่ ให้ AI agent อ่านไฟล์ต่อไปนี้ก่อน:

1. `README.md`
2. `PROJECT_BRIEF.md`
3. `BUSINESS_RULES.md`
4. `FEATURE_GOVERNANCE.md`
5. `PHASE_1_PLAN.md`
6. `AGENTS.md`

ถ้ามี requirement ใหม่จากผู้ใช้ที่ขัดกับไฟล์เหล่านี้ ให้ยึด requirement ล่าสุดของผู้ใช้ก่อน แล้วอัปเดตเอกสารที่เกี่ยวข้องด้วยเมื่อเหมาะสม

## Project Understanding

OEM Hub Thailand เป็น B2B Marketplace สำหรับดีลการผลิตและบริการสร้างแบรนด์ ไม่ใช่เว็บ directory รายชื่อโรงงานธรรมดา

หัวใจของระบบคือ:

RFQ -> Quote -> Accept Quote -> Order -> Buyer pays Supplier directly -> Supplier pays Order Activation Fee -> Work Timeline -> Completed -> Review

## Do Not Misunderstand

- ไม่ใช่เว็บ Directory เฉย ๆ
- ไม่ใช่เว็บลงประกาศฟรีแล้วให้โทรคุยกันเองทั้งหมด
- ไม่ใช่ marketplace สินค้าทั่วไปแบบ Shopee
- MVP ไม่ใช่ escrow หรือ payment gateway เต็มรูปแบบ
- Buyer ไม่จ่าย Platform Fee ใน MVP
- Buyer ไม่เห็น Platform Fee
- Supplier เป็นผู้จ่าย Order Activation Fee
- Platform ไม่ถือเงินค่าผลิตก้อนใหญ่ใน MVP
- Platform Fee คิดจากยอดดีลเต็ม
- Commission/Fee rate ต้อง configurable ในอนาคต ห้าม hardcode เป็น 20% ถาวร
- Review ต้องมาจาก Completed Order เท่านั้น

## Coding Principles

- ใช้ Next.js App Router, TypeScript, Tailwind CSS ตามโครงปัจจุบัน
- รักษา reusable components ใน `components/`
- เก็บ business mock/domain model ไว้ใน `lib/`
- แยก Buyer visibility, Supplier visibility, และ Admin visibility ให้ถูกต้อง
- อย่าแสดง Platform Fee ในหน้า Buyer
- อย่าใส่ secret ลง repo
- อย่า commit `node_modules`, `.next`, `.env`, หรือไฟล์ build/cache

## Current Important Files

- `lib/commerce.ts` - domain model ใหม่ของ payment/order/fee/reliability
- `lib/data.ts` - marketplace mock data
- `components/commerce-widgets.tsx` - widgets สำหรับ order payment, activation fee, reliability score
- `app/dashboard/buyer/rfq/[id]/page.tsx` - Buyer RFQ/Order detail
- `app/dashboard/supplier/page.tsx` - Supplier overview
- `app/admin/page.tsx` - Admin overview

## Git Workflow

หลังแก้ไขงานสำคัญ:

```bash
npm run typecheck
npm run build
git status
git add .
git commit -m "Short useful message"
git push
```

## Handoff Instruction For A New Codex User

ถ้าเปิดโปรเจกต์นี้ใน Codex user ใหม่ ให้เริ่มด้วยคำสั่ง/ข้อความ:

อ่าน `README.md`, `PROJECT_BRIEF.md`, `BUSINESS_RULES.md`, `FEATURE_GOVERNANCE.md`, `PHASE_1_PLAN.md` และ `AGENTS.md` ก่อน จากนั้นตรวจโครงสร้าง `app/`, `components/`, `lib/` แล้วค่อยทำงานต่อจากสถานะปัจจุบัน

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OEM Hub Thailand | B2B Marketplace for Brand Builders",
  description:
    "ค้นหาโรงงาน OEM/ODM ซัพพลายเออร์ บรรจุภัณฑ์ งานพิมพ์ และบริการสร้างแบรนด์ พร้อมระบบ RFQ และดีลรูม"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}

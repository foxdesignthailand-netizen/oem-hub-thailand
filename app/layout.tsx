import type { Metadata } from "next";
import type React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "OEM Hub Thailand | B2B Quote-based Manufacturing Marketplace",
  description:
    "ค้นหา Supplier สร้าง RFQ เปรียบเทียบใบเสนอราคา เปิด Order และติดตามงานผลิตสำหรับธุรกิจแบรนด์ในประเทศไทย"
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

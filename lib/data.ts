export type Category = {
  slug: string;
  title: string;
  description: string;
  count: number;
  icon: string;
};

export type Supplier = {
  slug: string;
  logo: string;
  name: string;
  category: string;
  province: string;
  rating: number;
  reviews: number;
  completedOrders: number;
  moq: string;
  leadTime: string;
  priceRange: string;
  verified: boolean;
  tags: string[];
  standards?: string[];
  description: string;
};

export type Service = {
  slug: string;
  title: string;
  category: string;
  supplierSlug: string;
  supplierName: string;
  startingPrice: number;
  moq: string;
  leadTime: string;
  rating: number;
  sold: number;
  description: string;
  includes?: string[];
  excludes?: string[];
  files?: string[];
};

export const categories: Category[] = [
  {
    slug: "oem-odm",
    title: "โรงงาน OEM / ODM",
    description: "โรงงานผลิตสินค้าแบบครบวงจรสำหรับสกินแคร์ อาหารเสริม เครื่องดื่ม และสินค้าไลฟ์สไตล์",
    count: 1245,
    icon: "Factory"
  },
  {
    slug: "packaging",
    title: "ขวด / ฝา / บรรจุภัณฑ์",
    description: "ขวด กระปุก ซอง กล่อง และแพ็กเกจสำหรับสินค้าภายใต้แบรนด์ของคุณ",
    count: 968,
    icon: "Package"
  },
  {
    slug: "labels",
    title: "สติ๊กเกอร์ / ฉลาก",
    description: "ฉลากสินค้า สติ๊กเกอร์กันน้ำ ฟอยล์ และงานพิมพ์ตามแบบ พร้อมไฟล์ผลิต",
    count: 876,
    icon: "Tags"
  },
  {
    slug: "printing",
    title: "กล่อง / งานพิมพ์",
    description: "กล่องกระดาษ งานพิมพ์ออฟเซ็ต ดิจิทัล Spot UV และงานพิมพ์พรีเมียม",
    count: 742,
    icon: "Printer"
  },
  {
    slug: "design",
    title: "ออกแบบโลโก้ / แพ็กเกจ",
    description: "ออกแบบแบรนด์ ฉลาก แพ็กเกจ และไฟล์พร้อมส่งต่อให้โรงงานผลิต",
    count: 615,
    icon: "PenTool"
  },
  {
    slug: "content",
    title: "ถ่ายภาพสินค้า / คอนเทนต์",
    description: "ภาพสินค้า วิดีโอ คอนเทนต์ขาย และภาพสำหรับ marketplace หรือ social commerce",
    count: 403,
    icon: "Camera"
  },
  {
    slug: "compliance",
    title: "เอกสาร อย. / GMP / ISO",
    description: "ที่ปรึกษา เอกสารรับรอง มาตรฐานโรงงาน และทะเบียนสินค้าที่แบรนด์ต้องใช้",
    count: 525,
    icon: "ClipboardCheck"
  },
  {
    slug: "trademark",
    title: "เครื่องหมายการค้า",
    description: "จดทะเบียนเครื่องหมายการค้า ตรวจชื่อ และเตรียมเอกสารประกอบการยื่น",
    count: 286,
    icon: "ShieldCheck"
  },
  {
    slug: "marketing",
    title: "การตลาด / Shopee / TikTok",
    description: "วางแผนเปิดตัว ยิงแอด คอนเทนต์ และดูแลช่องทางขายหลังผลิตสินค้า",
    count: 688,
    icon: "Megaphone"
  }
];

export const suppliers: Supplier[] = [
  {
    slug: "greenway-industry",
    logo: "GI",
    name: "บริษัท กรีนเวย์ อินดัสทรี จำกัด",
    category: "ชิ้นส่วนเครื่องจักร / งานกลึง CNC",
    province: "สมุทรปราการ",
    rating: 4.8,
    reviews: 128,
    completedOrders: 1250,
    moq: "100 ชิ้น",
    leadTime: "7-15 วัน",
    priceRange: "฿50 - ฿2,000",
    verified: true,
    standards: ["ISO 9001", "IATF 16949"],
    tags: ["ชิ้นส่วนเครื่องจักร", "งานกลึง CNC", "งานเชื่อมประกอบ", "งานโลหะแผ่น"],
    description:
      "โรงงานผลิตชิ้นส่วนเครื่องจักรและงานโลหะครบวงจร ด้วยเครื่องจักร CNC มาตรฐานสากล เหมาะกับงานที่ต้องการความแม่นยำและส่งมอบตรงเวลา"
  },
  {
    slug: "precise-manufacturing",
    logo: "PM",
    name: "บริษัท พรีไซซ์ แมนูแฟคเจอริ่ง จำกัด",
    category: "แม่พิมพ์ / บรรจุภัณฑ์พลาสติก",
    province: "ชลบุรี",
    rating: 4.7,
    reviews: 96,
    completedOrders: 980,
    moq: "500 ชิ้น",
    leadTime: "10-20 วัน",
    priceRange: "฿10 - ฿500",
    verified: true,
    standards: ["ISO 9001", "GMP"],
    tags: ["ฉีดพลาสติก", "แม่พิมพ์", "ออกแบบผลิตภัณฑ์", "ประกอบชิ้นงาน"],
    description:
      "ผู้เชี่ยวชาญงานพลาสติกฉีดขึ้นรูปและแม่พิมพ์ มีทีมออกแบบช่วยปรับแบบให้พร้อมผลิตจริง เหมาะกับแบรนด์ที่ต้องการคุณภาพคงที่"
  },
  {
    slug: "siam-tech-solutions",
    logo: "ST",
    name: "บริษัท สยามเทค โซลูชั่นส์ จำกัด",
    category: "เครื่องจักรอัตโนมัติ / ระบบควบคุม",
    province: "ระยอง",
    rating: 4.6,
    reviews: 78,
    completedOrders: 760,
    moq: "1 ชุด",
    leadTime: "20-30 วัน",
    priceRange: "฿5,000 - ฿100,000",
    verified: true,
    standards: ["ISO 9001"],
    tags: ["เครื่องจักรอัตโนมัติ", "สายพานลำเลียง", "ตู้ควบคุมไฟฟ้า"],
    description:
      "รับผลิตและประกอบเครื่องจักรอัตโนมัติ สายพานลำเลียง และระบบควบคุมสำหรับธุรกิจที่ต้องการเพิ่มกำลังผลิต"
  },
  {
    slug: "eco-packaging",
    logo: "EP",
    name: "บริษัท อีโค่ แพคเกจจิ้ง จำกัด",
    category: "บรรจุภัณฑ์รักษ์โลก",
    province: "นครปฐม",
    rating: 4.5,
    reviews: 64,
    completedOrders: 620,
    moq: "1,000 ชิ้น",
    leadTime: "7-14 วัน",
    priceRange: "฿1 - ฿50",
    verified: true,
    standards: ["ISO 9001", "FSC"],
    tags: ["บรรจุภัณฑ์พลาสติก", "บรรจุภัณฑ์รักษ์โลก", "พิมพ์โลโก้"],
    description:
      "ผู้ผลิตบรรจุภัณฑ์พลาสติกและบรรจุภัณฑ์รักษ์โลก ช่วยเลือกวัสดุให้เหมาะกับภาพลักษณ์แบรนด์และงบประมาณ"
  },
  {
    slug: "nexus-electronics",
    logo: "NE",
    name: "บริษัท เน็กซัส อิเล็กทรอนิกส์ จำกัด",
    category: "PCB / ประกอบอิเล็กทรอนิกส์",
    province: "ปทุมธานี",
    rating: 4.7,
    reviews: 112,
    completedOrders: 1100,
    moq: "100 แผ่น",
    leadTime: "5-10 วัน",
    priceRange: "฿100 - ฿5,000",
    verified: true,
    standards: ["ISO 9001", "IPC"],
    tags: ["PCB", "SMT", "ประกอบอิเล็กทรอนิกส์", "ทดสอบคุณภาพ"],
    description:
      "รับผลิตแผงวงจร PCB และประกอบอิเล็กทรอนิกส์ครบวงจร มีขั้นตอนทดสอบคุณภาพก่อนส่งมอบ"
  }
];

export const services: Service[] = [
  {
    slug: "custom-printed-box",
    title: "กล่องกระดาษพิมพ์แบรนด์ (Custom Printed Box)",
    category: "บรรจุภัณฑ์",
    supplierSlug: "eco-packaging",
    supplierName: "GreenPack Co., Ltd.",
    startingPrice: 7.5,
    moq: "500 ใบ",
    leadTime: "7-10 วันทำการ",
    rating: 4.9,
    sold: 156,
    description:
      "บริการออกแบบและผลิตกล่องกระดาษพิมพ์โลโก้แบรนด์คุณภาพสูง เลือกวัสดุและเทคนิคการพิมพ์ได้หลากหลาย เหมาะกับสินค้า D2C และของพรีเมียม",
    includes: ["ออกแบบโครงสร้างกล่อง", "พิมพ์ 4 สี (CMYK)", "เคลือบผิวด้าน/เงา", "ไดคัทตามแบบ", "ประกอบพร้อมใช้งาน"],
    excludes: ["ค่าตัวอย่าง", "ค่าจัดส่ง", "ถ่ายภาพสินค้า", "จดทะเบียน อย."],
    files: ["ไฟล์โลโก้ AI/PDF", "ขนาดสินค้า", "ตัวอย่างสี", "ข้อความบนกล่อง"]
  },
  {
    slug: "cnc-machined-part",
    title: "ชิ้นส่วน Machined Part งาน CNC",
    category: "ชิ้นส่วนเครื่องจักร",
    supplierSlug: "greenway-industry",
    supplierName: "Greenway Industry",
    startingPrice: 142.5,
    moq: "100 ชิ้น",
    leadTime: "15 วัน",
    rating: 4.8,
    sold: 88,
    description:
      "ผลิตชิ้นส่วนโลหะตามแบบ Drawing ด้วยเครื่อง CNC Milling และ Turning รองรับ Aluminum 6061, Steel และ Stainless"
  }
];

export const rfqs = [
  {
    id: "RFQ-2024-0056",
    title: "สกรูสแตนเลส M6 x 20 มม.",
    date: "20 พ.ค. 2567",
    status: "รอใบเสนอราคา",
    quotes: 3
  },
  {
    id: "RFQ-2024-0055",
    title: "ชิ้นส่วนกลึง CNC",
    date: "19 พ.ค. 2567",
    status: "ได้รับใบเสนอราคา",
    quotes: 5
  },
  {
    id: "RFQ-2024-0054",
    title: "แผ่นโลหะพับขึ้นรูป",
    date: "18 พ.ค. 2567",
    status: "ได้รับใบเสนอราคา",
    quotes: 4
  }
];

export const quotes = [
  {
    supplier: "Precision Part Co., Ltd.",
    price: 142.5,
    total: 712500,
    moq: "1,000 ชิ้น",
    leadTime: "15 วัน",
    accuracy: "30 มิ.ย. 2567",
    rating: 4.9,
    recommended: true
  },
  {
    supplier: "Thai Manufacturing Solution Ltd.",
    price: 148,
    total: 740000,
    moq: "1,000 ชิ้น",
    leadTime: "18 วัน",
    accuracy: "28 มิ.ย. 2567",
    rating: 4.7,
    recommended: false
  },
  {
    supplier: "Smart Part Technology Co., Ltd.",
    price: 135,
    total: 675000,
    moq: "2,000 ชิ้น",
    leadTime: "20 วัน",
    accuracy: "25 มิ.ย. 2567",
    rating: 4.5,
    recommended: false
  }
];

export const orders = [
  { id: "PO-2024-0231", supplier: "พรีไซซ์ อินดัสทรี จำกัด", total: 45600, progress: 60, status: "กำลังผลิต" },
  { id: "PO-2024-0230", supplier: "เมทัลเวิร์ค จำกัด", total: 32800, progress: 80, status: "ตรวจรับสินค้า" },
  { id: "PO-2024-0229", supplier: "อีโค่โปรดักส์ จำกัด", total: 18750, progress: 100, status: "จัดส่งแล้ว" }
];

export const activities = [
  "มีใบเสนอราคาใหม่สำหรับ RFQ-2024-0055",
  "คำสั่งซื้อ PO-2024-0230 อยู่ระหว่างตรวจรับสินค้า",
  "RFQ-2024-0056 ใกล้ถึงกำหนดปิดรับข้อเสนอ",
  "มีรายการรออนุมัติ 4 รายการ"
];

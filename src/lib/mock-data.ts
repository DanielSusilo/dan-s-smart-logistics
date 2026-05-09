export type ShipmentStage =
  | "Ordered"
  | "Raw Material"
  | "Manufacturing"
  | "Bea Cukai Clearance"
  | "Distribution"
  | "Retail";

export const STAGES: ShipmentStage[] = [
  "Ordered",
  "Raw Material",
  "Manufacturing",
  "Bea Cukai Clearance",
  "Distribution",
  "Retail",
];

export type ShipmentStatus = "Pending" | "In Transit" | "Cleared" | "Completed";

export interface TimelineEvent {
  stage: ShipmentStage;
  timestamp: string;
  location: string;
  txHash: string;
  signedBy: string;
  completed: boolean;
}

export type PaymentStatus = "Unpaid" | "Paid" | "Refunded";

export interface Transaction {
  id: string;
  shipmentId: string;
  amount: number;
  method: "Wallet" | "Bank Transfer" | "QRIS";
  status: "Success" | "Pending" | "Failed";
  txHash: string;
  createdAt: string;
  payer: string;
}

export interface Shipment {
  id: string;
  itemName: string;
  origin: string;
  destination: string;
  supplier: string;
  currentStage: ShipmentStage;
  status: ShipmentStatus;
  createdAt: string;
  weightKg: number;
  hsCode: string;
  timeline: TimelineEvent[];
  amount: number;
  paymentStatus: PaymentStatus;
  resi: string | null;
  customerEmail?: string;
}

const tx = (seed: string) =>
  "0x" +
  Array.from(seed)
    .map((c) => c.charCodeAt(0).toString(16))
    .join("")
    .padEnd(40, "a4f9c2b1e8d7")
    .slice(0, 40);

const baseAmount = (kg: number) => Math.round(kg * 4500 + 750000);

export const SHIPMENTS: Shipment[] = [
  {
    id: "DSL-8829",
    itemName: "Industrial Coffee Beans (Premium Arabica)",
    origin: "Pelabuhan Tanjung Emas, Semarang",
    destination: "Jakarta Distribution Hub",
    supplier: "PT Cipta Logistik Nusantara",
    currentStage: "Distribution",
    status: "In Transit",
    createdAt: "2026-04-14",
    weightKg: 12500,
    hsCode: "0901.21.00",
    amount: baseAmount(12500),
    paymentStatus: "Paid",
    resi: "SLA-RX-8829-2026",
    customerEmail: "customer@cipta.co.id",
    timeline: [
      { stage: "Ordered", timestamp: "2026-04-14 08:12", location: "Semarang HQ", txHash: tx("ord8829"), signedBy: "PT Cipta Logistik", completed: true },
      { stage: "Raw Material", timestamp: "2026-04-16 14:30", location: "Gudang Ungaran", txHash: tx("raw8829"), signedBy: "Supplier Node", completed: true },
      { stage: "Manufacturing", timestamp: "2026-04-20 09:45", location: "Pabrik Demak", txHash: tx("man8829"), signedBy: "Manufacturing Node", completed: true },
      { stage: "Bea Cukai Clearance", timestamp: "2026-04-24 11:02", location: "Bea Cukai Semarang", txHash: tx("bea8829"), signedBy: "Bea Cukai Officer #214", completed: true },
      { stage: "Distribution", timestamp: "2026-04-28 06:20", location: "Tol Trans-Jawa", txHash: tx("dis8829"), signedBy: "Logistics Node", completed: true },
      { stage: "Retail", timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
    ],
  },
  {
    id: "DSL-8830",
    itemName: "Electronic Components (Microcontrollers)",
    origin: "Pelabuhan Tanjung Priok, Jakarta",
    destination: "Surabaya Tech Park",
    supplier: "PT Mitra Elektronik Jaya",
    currentStage: "Bea Cukai Clearance",
    status: "Pending",
    createdAt: "2026-04-22",
    weightKg: 850,
    hsCode: "8542.31.00",
    amount: baseAmount(850),
    paymentStatus: "Paid",
    resi: null,
    customerEmail: "customer@cipta.co.id",
    timeline: [
      { stage: "Ordered", timestamp: "2026-04-22 10:00", location: "Jakarta HQ", txHash: tx("ord8830"), signedBy: "PT Mitra Elektronik", completed: true },
      { stage: "Raw Material", timestamp: "2026-04-23 12:00", location: "Shenzhen → Tanjung Priok", txHash: tx("raw8830"), signedBy: "Import Node", completed: true },
      { stage: "Manufacturing", timestamp: "2026-04-25 16:30", location: "N/A (Direct Import)", txHash: tx("man8830"), signedBy: "—", completed: true },
      { stage: "Bea Cukai Clearance", timestamp: "Awaiting", location: "Bea Cukai Tanjung Priok", txHash: "", signedBy: "—", completed: false },
      { stage: "Distribution", timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
      { stage: "Retail", timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
    ],
  },
  {
    id: "DSL-8831",
    itemName: "Tekstil Batik Export Grade",
    origin: "Pekalongan",
    destination: "Pelabuhan Tanjung Emas, Semarang",
    supplier: "Koperasi Batik Pekalongan",
    currentStage: "Bea Cukai Clearance",
    status: "Pending",
    createdAt: "2026-04-25",
    weightKg: 2200,
    hsCode: "5208.52.00",
    amount: baseAmount(2200),
    paymentStatus: "Unpaid",
    resi: null,
    customerEmail: "customer@cipta.co.id",
    timeline: [
      { stage: "Ordered", timestamp: "2026-04-25 09:00", location: "Pekalongan", txHash: tx("ord8831"), signedBy: "Koperasi Batik", completed: true },
      { stage: "Raw Material", timestamp: "2026-04-26 08:00", location: "Workshop Pekalongan", txHash: tx("raw8831"), signedBy: "Supplier Node", completed: true },
      { stage: "Manufacturing", timestamp: "2026-04-28 17:00", location: "Pekalongan", txHash: tx("man8831"), signedBy: "Manufacturing Node", completed: true },
      { stage: "Bea Cukai Clearance", timestamp: "Awaiting", location: "Bea Cukai Semarang", txHash: "", signedBy: "—", completed: false },
      { stage: "Distribution", timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
      { stage: "Retail", timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
    ],
  },
  {
    id: "DSL-8832",
    itemName: "Crude Palm Oil (CPO)",
    origin: "Dumai, Riau",
    destination: "Rotterdam (Export)",
    supplier: "PT Sawit Makmur Sejahtera",
    currentStage: "Retail",
    status: "Completed",
    createdAt: "2026-03-30",
    weightKg: 48000,
    hsCode: "1511.10.00",
    amount: baseAmount(48000),
    paymentStatus: "Paid",
    resi: "SLA-RX-8832-2026",
    customerEmail: "customer@cipta.co.id",
    timeline: STAGES.map((s, i) => ({
      stage: s,
      timestamp: `2026-04-${String(2 + i * 3).padStart(2, "0")} 10:00`,
      location: ["Dumai", "Kebun Riau", "Refinery Dumai", "Bea Cukai Dumai", "Pelabuhan Dumai", "Rotterdam"][i],
      txHash: tx(`s8832-${i}`),
      signedBy: ["Supplier", "Supplier", "Manufacturer", "Bea Cukai Officer #119", "Shipping Line", "Buyer"][i],
      completed: true,
    })),
  },
  {
    id: "DSL-8833",
    itemName: "Furniture Rotan Cirebon",
    origin: "Cirebon",
    destination: "Pelabuhan Tanjung Emas, Semarang",
    supplier: "CV Rotan Indah",
    currentStage: "Manufacturing",
    status: "In Transit",
    createdAt: "2026-04-27",
    weightKg: 1800,
    hsCode: "9401.51.00",
    amount: baseAmount(1800),
    paymentStatus: "Unpaid",
    resi: null,
    customerEmail: "customer@cipta.co.id",
    timeline: [
      { stage: "Ordered", timestamp: "2026-04-27 11:00", location: "Cirebon", txHash: tx("ord8833"), signedBy: "CV Rotan Indah", completed: true },
      { stage: "Raw Material", timestamp: "2026-04-28 09:00", location: "Workshop Cirebon", txHash: tx("raw8833"), signedBy: "Supplier Node", completed: true },
      { stage: "Manufacturing", timestamp: "2026-04-30 15:00", location: "Cirebon", txHash: tx("man8833"), signedBy: "Manufacturing Node", completed: true },
      { stage: "Bea Cukai Clearance", timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
      { stage: "Distribution", timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
      { stage: "Retail", timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
    ],
  },
];

export const TRANSACTIONS_SEED: Transaction[] = [
  {
    id: "TRX-20260414-001",
    shipmentId: "DSL-8829",
    amount: baseAmount(12500),
    method: "Wallet",
    status: "Success",
    txHash: tx("trx8829"),
    createdAt: "2026-04-14 08:30",
    payer: "PT Cipta Logistik Nusantara",
  },
  {
    id: "TRX-20260422-002",
    shipmentId: "DSL-8830",
    amount: baseAmount(850),
    method: "Bank Transfer",
    status: "Success",
    txHash: tx("trx8830"),
    createdAt: "2026-04-22 11:14",
    payer: "PT Mitra Elektronik Jaya",
  },
  {
    id: "TRX-20260330-003",
    shipmentId: "DSL-8832",
    amount: baseAmount(48000),
    method: "Wallet",
    status: "Success",
    txHash: tx("trx8832"),
    createdAt: "2026-03-30 09:02",
    payer: "PT Sawit Makmur Sejahtera",
  },
];

export interface RegistryEntity {
  publicKey: string;
  name: string;
  role: "Supplier" | "Manufacturer" | "Logistics" | "Bea Cukai" | "Retailer";
  location: string;
  verified: boolean;
  joined: string;
}

export const REGISTRY: RegistryEntity[] = [
  { publicKey: "8xK4...c2Vp", name: "PT Cipta Logistik Nusantara", role: "Logistics", location: "Semarang", verified: true, joined: "2025-11-02" },
  { publicKey: "9aQ2...m7Lr", name: "PT Mitra Elektronik Jaya", role: "Supplier", location: "Jakarta", verified: true, joined: "2025-12-14" },
  { publicKey: "Bn5T...z4Yu", name: "Bea Cukai Semarang", role: "Bea Cukai", location: "Semarang", verified: true, joined: "2025-09-01" },
  { publicKey: "Cf8R...p1Nq", name: "Bea Cukai Tanjung Priok", role: "Bea Cukai", location: "Jakarta Utara", verified: true, joined: "2025-09-01" },
  { publicKey: "Dh3W...x6Mb", name: "Koperasi Batik Pekalongan", role: "Manufacturer", location: "Pekalongan", verified: true, joined: "2026-01-20" },
  { publicKey: "Ej7Y...k9Vc", name: "PT Sawit Makmur Sejahtera", role: "Supplier", location: "Dumai, Riau", verified: true, joined: "2025-10-08" },
  { publicKey: "Fk2P...t5Hd", name: "CV Rotan Indah", role: "Manufacturer", location: "Cirebon", verified: false, joined: "2026-03-12" },
  { publicKey: "Gm9L...r3Qw", name: "Indomaret Distribution", role: "Retailer", location: "Nationwide", verified: true, joined: "2025-08-15" },
];
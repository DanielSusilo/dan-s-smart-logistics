import { createContext, useContext, useState, ReactNode } from "react";
import { SHIPMENTS, Shipment, ShipmentStage, Transaction, TRANSACTIONS_SEED } from "@/lib/mock-data";

interface ShipmentsState {
  shipments: Shipment[];
  transactions: Transaction[];
  addShipment: (data: { itemName: string; origin: string; destination: string; supplier: string; weightKg: number; hsCode: string }) => Shipment;
  approveCustoms: (id: string) => void;
  rejectCustoms: (id: string) => void;
  payShipment: (id: string, method: Transaction["method"], payer: string) => Transaction;
  generateResi: (id: string) => string;
  getById: (id: string) => Shipment | undefined;
}

const ShipmentsContext = createContext<ShipmentsState | undefined>(undefined);

const tx = () =>
  "0x" +
  Array.from({ length: 40 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");

export function ShipmentsProvider({ children }: { children: ReactNode }) {
  const [shipments, setShipments] = useState<Shipment[]>(SHIPMENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS_SEED);

  const addShipment: ShipmentsState["addShipment"] = (data) => {
    const id = `DSL-${8834 + shipments.length}`;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    const amount = Math.round(data.weightKg * 4500 + 750000);
    const newShip: Shipment = {
      id,
      itemName: data.itemName,
      origin: data.origin,
      destination: data.destination,
      supplier: data.supplier,
      currentStage: "Ordered",
      status: "Pending",
      createdAt: now.slice(0, 10),
      weightKg: data.weightKg,
      hsCode: data.hsCode,
      amount,
      paymentStatus: "Unpaid",
      resi: null,
      timeline: [
        { stage: "Ordered" as ShipmentStage, timestamp: now, location: data.origin, txHash: tx(), signedBy: "Admin Node", completed: true },
        { stage: "Raw Material" as ShipmentStage, timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
        { stage: "Manufacturing" as ShipmentStage, timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
        { stage: "Bea Cukai Clearance" as ShipmentStage, timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
        { stage: "Distribution" as ShipmentStage, timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
        { stage: "Retail" as ShipmentStage, timestamp: "—", location: "Pending", txHash: "", signedBy: "—", completed: false },
      ],
    };
    setShipments((prev) => [newShip, ...prev]);
    return newShip;
  };

  const approveCustoms = (id: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const now = new Date().toISOString().slice(0, 16).replace("T", " ");
        const resi = s.resi ?? `SLA-RX-${id.replace("DSL-", "")}-2026`;
        return {
          ...s,
          currentStage: "Distribution",
          status: "In Transit",
          resi,
          timeline: s.timeline.map((t) =>
            t.stage === "Bea Cukai Clearance"
              ? { ...t, completed: true, timestamp: now, txHash: tx(), signedBy: "Bea Cukai Officer (Wallet)" }
              : t,
          ),
        };
      }),
    );
  };

  const rejectCustoms = (id: string) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Pending" } : s)),
    );
  };

  const payShipment: ShipmentsState["payShipment"] = (id, method, payer) => {
    const ship = shipments.find((s) => s.id === id);
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    const trx: Transaction = {
      id: `TRX-${Date.now()}`,
      shipmentId: id,
      amount: ship?.amount ?? 0,
      method,
      status: "Success",
      txHash: tx(),
      createdAt: now,
      payer,
    };
    setTransactions((prev) => [trx, ...prev]);
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, paymentStatus: "Paid" } : s)),
    );
    return trx;
  };

  const generateResi: ShipmentsState["generateResi"] = (id) => {
    const num = `SLA-RX-${id.replace("DSL-", "")}-2026`;
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, resi: num } : s)),
    );
    return num;
  };

  const getById = (id: string) => shipments.find((s) => s.id.toLowerCase() === id.toLowerCase());

  return (
    <ShipmentsContext.Provider value={{ shipments, transactions, addShipment, approveCustoms, rejectCustoms, payShipment, generateResi, getById }}>
      {children}
    </ShipmentsContext.Provider>
  );
}

export function useShipments() {
  const ctx = useContext(ShipmentsContext);
  if (!ctx) throw new Error("useShipments must be used within ShipmentsProvider");
  return ctx;
}
import { useMemo, useState } from "react";
import { Receipt, Download, Hash, Wallet, Building, QrCode, Search, FileCheck2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { useShipments } from "@/context/ShipmentsContext";
import { toast } from "sonner";

const fmtIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const methodIcon = (m: string) =>
  m === "Wallet" ? Wallet : m === "Bank Transfer" ? Building : QrCode;

export default function Transactions() {
  const { transactions, shipments, generateResi } = useShipments();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return transactions.filter(
      (t) =>
        !term ||
        t.id.toLowerCase().includes(term) ||
        t.shipmentId.toLowerCase().includes(term) ||
        t.payer.toLowerCase().includes(term),
    );
  }, [transactions, q]);

  const totals = useMemo(() => {
    const sum = transactions.reduce((a, t) => a + (t.status === "Success" ? t.amount : 0), 0);
    return { count: transactions.length, sum };
  }, [transactions]);

  const handleGenerate = (shipmentId: string) => {
    const num = generateResi(shipmentId);
    toast.success("Resi pengiriman dibuat", { description: num });
  };

  return (
    <DashboardLayout variant="admin" title="Transaksi & Resi" subtitle="Pembayaran on-chain dan resi pengiriman">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Transaksi</span>
            <Receipt className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{totals.count}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Nilai Berhasil</span>
            <Wallet className="h-4 w-4 text-success" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{fmtIDR(totals.sum)}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Resi Aktif</span>
            <FileCheck2 className="h-4 w-4 text-success" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">
            {shipments.filter((s) => s.resi).length}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <h2 className="font-display text-base font-semibold">Riwayat Transaksi</h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari TRX / DSL / payer…" className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">TRX ID</th>
                <th className="px-6 py-3 font-medium">Shipment</th>
                <th className="px-6 py-3 font-medium">Payer</th>
                <th className="px-6 py-3 font-medium">Metode</th>
                <th className="px-6 py-3 font-medium">Nilai</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Tx Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((t) => {
                const Icon = methodIcon(t.method);
                return (
                  <tr key={t.id} className="hover:bg-muted/30">
                    <td className="px-6 py-3 font-mono text-xs">{t.id}</td>
                    <td className="px-6 py-3 font-mono text-xs text-primary">{t.shipmentId}</td>
                    <td className="px-6 py-3">{t.payer}</td>
                    <td className="px-6 py-3"><span className="inline-flex items-center gap-1.5 text-muted-foreground"><Icon className="h-3.5 w-3.5" />{t.method}</span></td>
                    <td className="px-6 py-3 font-medium">{fmtIDR(t.amount)}</td>
                    <td className="px-6 py-3"><StatusBadge variant={t.status === "Success" ? "success" : t.status === "Pending" ? "warning" : "muted"}>{t.status}</StatusBadge></td>
                    <td className="px-6 py-3"><span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground"><Hash className="h-3 w-3" />{t.txHash.slice(0, 14)}…</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-display text-base font-semibold">Generator Resi Pengiriman</h2>
          <p className="text-xs text-muted-foreground">Buat nomor resi untuk shipment yang sudah lolos clearance</p>
        </div>
        <div className="divide-y divide-border">
          {shipments.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-primary">{s.id}</span>
                  <StatusBadge variant={s.paymentStatus === "Paid" ? "success" : "warning"}>{s.paymentStatus}</StatusBadge>
                </div>
                <div className="mt-0.5 text-sm font-medium">{s.itemName}</div>
                <div className="text-xs text-muted-foreground">{s.supplier} · {fmtIDR(s.amount)}</div>
              </div>
              <div className="flex items-center gap-3">
                {s.resi ? (
                  <span className="font-mono text-sm font-semibold text-success">{s.resi}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Belum ada resi</span>
                )}
                <Button
                  size="sm"
                  variant={s.resi ? "outline" : "default"}
                  onClick={() => handleGenerate(s.id)}
                  className="gap-1.5"
                  disabled={s.paymentStatus !== "Paid"}
                >
                  <Download className="h-3.5 w-3.5" />
                  {s.resi ? "Regenerate" : "Generate Resi"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
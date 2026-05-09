import { useState, useMemo } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Hash, User, LogOut, Wallet, Building, QrCode, Loader2, FileCheck2, Receipt, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShipments } from "@/context/ShipmentsContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";
import { useWallet } from "@/context/WalletContext";
import { Shipment } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { StatusBadge } from "@/components/StatusBadge";
import { ShipmentTimeline } from "@/components/ShipmentTimeline";
import { NotificationBell } from "@/components/NotificationBell";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fmtIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function CustomerPortal() {
  const { shipments, transactions, payShipment } = useShipments();
  const { address, disconnect } = useWallet();
  const { user } = useAuth();
  const { push } = useNotifications();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(shipments[0]?.id ?? "");
  const [payOpen, setPayOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<"Wallet" | "Bank Transfer" | "QRIS">("Wallet");
  const [paying, setPaying] = useState(false);
  const [resiOpen, setResiOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return shipments;
    const q = query.toLowerCase();
    return shipments.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.itemName.toLowerCase().includes(q) ||
        s.supplier.toLowerCase().includes(q),
    );
  }, [shipments, query]);

  const selected: Shipment | undefined =
    shipments.find((s) => s.id === selectedId) ?? filtered[0];

  const myTransactions = useMemo(
    () => (selected ? transactions.filter((t) => t.shipmentId === selected.id) : []),
    [transactions, selected],
  );

  const stats = useMemo(() => {
    return {
      total: shipments.length,
      transit: shipments.filter((s) => s.status === "In Transit").length,
      pending: shipments.filter((s) => s.status === "Pending").length,
      completed: shipments.filter((s) => s.status === "Completed").length,
    };
  }, [shipments]);

  const statusVariant = (s: Shipment["status"]) =>
    s === "Completed" ? "success" : s === "In Transit" ? "info" : s === "Pending" ? "warning" : "muted";

  const handlePay = async () => {
    if (!selected) return;
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1500));
    const trx = payShipment(selected.id, payMethod, user?.company ?? user?.name ?? "Customer");
    push({
      type: "success",
      title: "Pembayaran berhasil",
      message: `${trx.id} · ${fmtIDR(trx.amount)} untuk ${selected.id}`,
      shipmentId: selected.id,
      targetRoles: ["customer", "admin"],
    });
    toast.success("Pembayaran terkonfirmasi", { description: `Tx ${trx.txHash.slice(0, 14)}…` });
    setPaying(false);
    setPayOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-card px-3 py-1.5 ring-1 ring-border sm:flex">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">{address}</span>
            </div>
            <NotificationBell />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                disconnect();
                navigate("/");
              }}
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 lg:py-10">
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Customer Portal
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track your shipments and verify each step on-chain.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total", value: stats.total, icon: Package, tone: "info" as const },
            { label: "In Transit", value: stats.transit, icon: Truck, tone: "info" as const },
            { label: "Pending", value: stats.pending, icon: Clock, tone: "warning" as const },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, tone: "success" as const },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-4 shadow-card transition-smooth hover:shadow-elegant"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg",
                    s.tone === "success" && "bg-success-soft text-success",
                    s.tone === "warning" && "bg-warning-soft text-warning",
                    s.tone === "info" && "bg-primary/10 text-primary",
                  )}
                >
                  <s.icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div className="rounded-2xl border border-border bg-card shadow-card">
            <div className="border-b border-border p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or item…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="max-h-[560px] divide-y divide-border overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No shipments found.
                </div>
              ) : (
                filtered.map((s) => {
                  const active = selected?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className={cn(
                        "flex w-full flex-col gap-1.5 px-4 py-3.5 text-left transition-smooth hover:bg-muted/40",
                        active && "bg-primary/5",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-primary">{s.id}</span>
                        <StatusBadge variant={statusVariant(s.status)}>{s.status}</StatusBadge>
                      </div>
                      <div className="truncate font-medium text-foreground">{s.itemName}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{s.origin.split(",")[0]} → {s.destination.split(",")[0]}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-card">
            {selected ? (
              <>
                <div className="border-b border-border p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-primary">{selected.id}</span>
                        <StatusBadge variant={statusVariant(selected.status)}>{selected.status}</StatusBadge>
                        <StatusBadge variant={selected.paymentStatus === "Paid" ? "success" : "warning"}>
                          {selected.paymentStatus}
                        </StatusBadge>
                      </div>
                      <h2 className="mt-2 font-display text-xl font-semibold text-foreground sm:text-2xl">
                        {selected.itemName}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">{selected.supplier}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        <Hash className="h-3 w-3" /> HS {selected.hsCode}
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Tagihan</div>
                        <div className="font-display text-lg font-bold text-foreground">{fmtIDR(selected.amount)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Origin</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{selected.origin.split(",")[0]}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Destination</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{selected.destination.split(",")[0]}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Weight</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{selected.weightKg.toLocaleString()} kg</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Created</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{selected.createdAt}</div>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-5">
                    {selected.paymentStatus !== "Paid" ? (
                      <Button onClick={() => setPayOpen(true)} className="gap-2 bg-gradient-primary shadow-glow">
                        <CreditCard className="h-4 w-4" /> Bayar Sekarang ({fmtIDR(selected.amount)})
                      </Button>
                    ) : (
                      <Button variant="outline" disabled className="gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" /> Lunas
                      </Button>
                    )}
                    {selected.resi ? (
                      <Button variant="outline" onClick={() => setResiOpen(true)} className="gap-2">
                        <FileCheck2 className="h-4 w-4" /> Lihat Resi
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Resi terbit otomatis setelah Bea Cukai ACC.</span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <Tabs defaultValue="timeline">
                    <TabsList>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      <TabsTrigger value="transactions">Transaksi ({myTransactions.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="timeline" className="mt-4">
                      <ShipmentTimeline shipment={selected} />
                    </TabsContent>
                    <TabsContent value="transactions" className="mt-4">
                      {myTransactions.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                          Belum ada transaksi untuk shipment ini.
                        </div>
                      ) : (
                        <div className="divide-y divide-border rounded-xl border border-border">
                          {myTransactions.map((t) => (
                            <div key={t.id} className="flex items-center justify-between gap-3 p-4">
                              <div>
                                <div className="font-mono text-xs font-semibold">{t.id}</div>
                                <div className="mt-0.5 text-xs text-muted-foreground">{t.createdAt} · {t.method}</div>
                                <div className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-primary">
                                  <Hash className="h-3 w-3" /> {t.txHash.slice(0, 18)}…
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-display text-base font-semibold">{fmtIDR(t.amount)}</div>
                                <StatusBadge variant={t.status === "Success" ? "success" : "warning"}>{t.status}</StatusBadge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-12 text-center">
                <Package className="h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">Select a shipment to view details.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      <Dialog open={payOpen} onOpenChange={(o) => !paying && setPayOpen(o)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <CreditCard className="h-6 w-6 text-primary-foreground" />
            </div>
            <DialogTitle className="text-center font-display text-2xl">Pembayaran Shipment</DialogTitle>
            <DialogDescription className="text-center">
              {selected?.id} · {fmtIDR(selected?.amount ?? 0)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {([
              { v: "Wallet", icon: Wallet, label: "Wallet (Solana)", desc: "Konfirmasi 1-2 detik" },
              { v: "Bank Transfer", icon: Building, label: "Bank Transfer", desc: "BCA · Mandiri · BNI" },
              { v: "QRIS", icon: QrCode, label: "QRIS", desc: "Semua e-wallet" },
            ] as const).map((m) => {
              const active = payMethod === m.v;
              return (
                <button
                  key={m.v}
                  onClick={() => setPayMethod(m.v)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-smooth",
                    active ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/40",
                  )}
                >
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    <m.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{m.label}</div>
                    <div className="text-xs text-muted-foreground">{m.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setPayOpen(false)} disabled={paying}>Batal</Button>
            <Button onClick={handlePay} disabled={paying} className="gap-2 bg-gradient-success text-success-foreground shadow-glow">
              {paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Memproses…</> : <><CheckCircle2 className="h-4 w-4" /> Bayar {fmtIDR(selected?.amount ?? 0)}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resi Modal */}
      <Dialog open={resiOpen} onOpenChange={setResiOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Resi Pengiriman</DialogTitle>
            <DialogDescription>Tunjukkan kepada kurir untuk verifikasi.</DialogDescription>
          </DialogHeader>
          {selected?.resi && (
            <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-subtle p-6 text-center">
              <Receipt className="mx-auto h-8 w-8 text-primary" />
              <div className="mt-3 font-mono text-2xl font-bold tracking-wider text-foreground">{selected.resi}</div>
              <div className="mt-2 text-xs text-muted-foreground">{selected.itemName}</div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 text-left text-xs">
                <div><div className="text-muted-foreground">Asal</div><div className="font-medium">{selected.origin.split(",")[0]}</div></div>
                <div><div className="text-muted-foreground">Tujuan</div><div className="font-medium">{selected.destination.split(",")[0]}</div></div>
                <div><div className="text-muted-foreground">Berat</div><div className="font-medium">{selected.weightKg.toLocaleString()} kg</div></div>
                <div><div className="text-muted-foreground">Status</div><div className="font-medium">{selected.status}</div></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => window.print()} className="gap-2"><FileCheck2 className="h-4 w-4" /> Cetak / Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
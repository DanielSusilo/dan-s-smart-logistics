import { useState, useMemo } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Hash, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShipments } from "@/context/ShipmentsContext";
import { useWallet } from "@/context/WalletContext";
import { Shipment } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { StatusBadge } from "@/components/StatusBadge";
import { ShipmentTimeline } from "@/components/ShipmentTimeline";
import { NotificationBell } from "@/components/NotificationBell";
import { cn } from "@/lib/utils";

export default function CustomerPortal() {
  const { shipments } = useShipments();
  const { address, disconnect } = useWallet();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(shipments[0]?.id ?? "");

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
                      </div>
                      <h2 className="mt-2 font-display text-xl font-semibold text-foreground sm:text-2xl">
                        {selected.itemName}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">{selected.supplier}</p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <Hash className="h-3 w-3" /> HS {selected.hsCode}
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
                </div>
                <div className="p-6">
                  <h3 className="mb-4 font-display text-base font-semibold">Supply chain timeline</h3>
                  <ShipmentTimeline shipment={selected} />
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
    </div>
  );
}
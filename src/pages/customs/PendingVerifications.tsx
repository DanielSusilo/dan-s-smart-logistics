import { useState } from "react";
import { ShieldCheck, Loader2, Check, X, Hash, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShipments } from "@/context/ShipmentsContext";
import { Shipment } from "@/lib/mock-data";
import { toast } from "sonner";
import { useNotifications } from "@/context/NotificationsContext";

export default function PendingVerifications() {
  const { shipments, approveCustoms, rejectCustoms } = useShipments();
  const { push } = useNotifications();
  const [active, setActive] = useState<Shipment | null>(null);
  const [signing, setSigning] = useState(false);

  const pending = shipments.filter(
    (s) => s.currentStage === "Bea Cukai Clearance" && s.status === "Pending",
  );

  const handleApprove = async () => {
    if (!active) return;
    setSigning(true);
    await new Promise((r) => setTimeout(r, 1300));
    approveCustoms(active.id);
    push({
      type: "success",
      title: "Customs cleared",
      message: `${active.id} — ${active.itemName} berhasil ditandatangani Bea Cukai.`,
      shipmentId: active.id,
    });
    setSigning(false);
    setActive(null);
    toast.success("Customs cleared", { description: "Signature broadcast to mainnet." });
  };

  const handleReject = () => {
    if (!active) return;
    rejectCustoms(active.id);
    push({
      type: "error",
      title: "Shipment ditolak",
      message: `${active.id} ditolak oleh Bea Cukai dan dikembalikan ke antrian.`,
      shipmentId: active.id,
    });
    setActive(null);
    toast.error("Shipment rejected");
  };

  return (
    <DashboardLayout variant="customs" title="Pending Verifications" subtitle="Awaiting Bea Cukai signature">
      <div className="rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-warning" />
            <h2 className="font-display text-base font-semibold">Queue ({pending.length})</h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Bea Cukai Node · Online</span>
        </div>
        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">All clear</h3>
            <p className="mt-1 text-sm text-muted-foreground">No shipments pending verification.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Item</th>
                  <th className="px-6 py-3 font-medium">Origin</th>
                  <th className="px-6 py-3 font-medium">HS Code</th>
                  <th className="px-6 py-3 font-medium">Weight</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pending.map((s) => (
                  <tr key={s.id} className="transition-smooth hover:bg-muted/30">
                    <td className="px-6 py-4"><span className="font-mono text-xs font-semibold text-primary">{s.id}</span></td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{s.itemName}</div>
                      <div className="text-xs text-muted-foreground">{s.supplier}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{s.origin.split(",")[0]}</td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{s.hsCode}</td>
                    <td className="px-6 py-4 text-muted-foreground">{s.weightKg.toLocaleString()} kg</td>
                    <td className="px-6 py-4">
                      <Button size="sm" onClick={() => setActive(s)} className="gap-1.5 bg-gradient-primary shadow-glow">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verify &amp; Sign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && !signing && setActive(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <DialogTitle className="text-center font-display text-2xl">Signature request</DialogTitle>
            <DialogDescription className="text-center">
              Your wallet is requesting permission to sign customs clearance for this shipment.
            </DialogDescription>
          </DialogHeader>
          {active && (
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Shipment</span>
                <span className="font-mono text-xs font-semibold text-primary">{active.id}</span>
              </div>
              <div className="mt-2 font-display text-lg font-semibold text-foreground">{active.itemName}</div>
              <div className="mt-1 text-sm text-muted-foreground">{active.supplier}</div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Origin</div><div className="mt-0.5 text-foreground">{active.origin.split(",")[0]}</div></div>
                <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">HS Code</div><div className="mt-0.5 font-mono text-foreground">{active.hsCode}</div></div>
                <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Weight</div><div className="mt-0.5 text-foreground">{active.weightKg.toLocaleString()} kg</div></div>
                <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Action</div><StatusBadge variant="warning" className="mt-0.5">Customs Clearance</StatusBadge></div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-2 font-mono text-[11px] text-muted-foreground">
                <Hash className="h-3 w-3" /> Program: BeaCukaiSig11111111111111111111111111111111
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" /> Network fee ~ 0.000005 SOL · ≤ 2s confirmation
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleReject} disabled={signing} className="gap-2">
              <X className="h-4 w-4" /> Reject
            </Button>
            <Button onClick={handleApprove} disabled={signing} className="gap-2 bg-gradient-success text-success-foreground shadow-glow hover:opacity-95">
              {signing ? (<><Loader2 className="h-4 w-4 animate-spin" /> Signing…</>) : (<><Check className="h-4 w-4" /> Approve &amp; Sign</>)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
import { useState } from "react";
import { Loader2, PackagePlus, Sparkles, Hash } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { useShipments } from "@/context/ShipmentsContext";
import { toast } from "sonner";

export default function ManageShipments() {
  const { shipments, addShipment } = useShipments();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    itemName: "",
    origin: "Pelabuhan Tanjung Emas, Semarang",
    destination: "",
    supplier: "",
    weightKg: "",
    hsCode: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemName || !form.destination || !form.supplier) {
      toast.error("Please complete all required fields");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    const newShip = addShipment({
      itemName: form.itemName,
      origin: form.origin,
      destination: form.destination,
      supplier: form.supplier,
      weightKg: Number(form.weightKg) || 0,
      hsCode: form.hsCode || "0000.00.00",
    });
    setLoading(false);
    toast.success(`Shipment ${newShip.id} signed on-chain`, {
      description: "Transaction confirmed in 1.2s",
    });
    setForm({ itemName: "", origin: "Pelabuhan Tanjung Emas, Semarang", destination: "", supplier: "", weightKg: "", hsCode: "" });
  };

  return (
    <DashboardLayout variant="admin" title="Manage Shipments" subtitle="Create new logistics records on the blockchain">
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PackagePlus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-semibold">New shipment</h2>
                <p className="text-xs text-muted-foreground">Sign a fresh record on Solana</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="itemName">Item name</Label>
                <Input id="itemName" placeholder="e.g. Premium Arabica Coffee" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="origin">Origin</Label>
                <Textarea id="origin" rows={2} value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className="mt-1.5 resize-none" />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" placeholder="e.g. Jakarta Distribution Hub" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" placeholder="e.g. PT Cipta Logistik Nusantara" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" placeholder="12500" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="hs">HS Code</Label>
                  <Input id="hs" placeholder="0901.21.00" value={form.hsCode} onChange={(e) => setForm({ ...form, hsCode: e.target.value })} className="mt-1.5 font-mono" />
                </div>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="mt-6 w-full gap-2 bg-gradient-primary shadow-glow transition-smooth hover:shadow-elegant">
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Signing transaction…</>) : (<><Sparkles className="h-4 w-4" /> Create &amp; Sign on Blockchain</>)}
            </Button>
          </form>
        </div>
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card shadow-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-display text-base font-semibold">All shipments ({shipments.length})</h2>
              <p className="text-xs text-muted-foreground">Most recent first</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-6 py-3 font-medium">ID</th><th className="px-6 py-3 font-medium">Item</th><th className="px-6 py-3 font-medium">Stage</th><th className="px-6 py-3 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shipments.map((s) => (
                    <tr key={s.id} className="transition-smooth hover:bg-muted/30">
                      <td className="px-6 py-3"><span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-primary"><Hash className="h-3 w-3" />{s.id.replace("DSL-", "")}</span></td>
                      <td className="px-6 py-3"><div className="font-medium text-foreground">{s.itemName}</div><div className="text-xs text-muted-foreground">{s.supplier}</div></td>
                      <td className="px-6 py-3 text-muted-foreground">{s.currentStage}</td>
                      <td className="px-6 py-3"><StatusBadge variant={s.status === "Completed" ? "success" : s.status === "Pending" ? "warning" : "info"}>{s.status}</StatusBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
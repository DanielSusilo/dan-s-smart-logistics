import { CheckCircle2, Hash } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { useShipments } from "@/context/ShipmentsContext";

export default function ClearedGoods() {
  const { shipments } = useShipments();
  const cleared = shipments.filter((s) => {
    const beaEvent = s.timeline.find((t) => t.stage === "Bea Cukai Clearance");
    return beaEvent?.completed;
  });

  return (
    <DashboardLayout variant="customs" title="Cleared Goods" subtitle="Shipments verified and signed by Bea Cukai">
      <div className="rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <h2 className="font-display text-base font-semibold">Cleared ({cleared.length})</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Item</th>
                <th className="px-6 py-3 font-medium">Cleared at</th>
                <th className="px-6 py-3 font-medium">Tx Hash</th>
                <th className="px-6 py-3 font-medium">Signed by</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cleared.map((s) => {
                const evt = s.timeline.find((t) => t.stage === "Bea Cukai Clearance")!;
                return (
                  <tr key={s.id} className="transition-smooth hover:bg-muted/30">
                    <td className="px-6 py-4"><span className="font-mono text-xs font-semibold text-primary">{s.id}</span></td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{s.itemName}</div>
                      <div className="text-xs text-muted-foreground">{s.origin.split(",")[0]}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{evt.timestamp}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-foreground">
                        <Hash className="h-3 w-3 opacity-60" />
                        {evt.txHash.slice(0, 10)}…
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{evt.signedBy}</td>
                    <td className="px-6 py-4"><StatusBadge variant="success">Cleared</StatusBadge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
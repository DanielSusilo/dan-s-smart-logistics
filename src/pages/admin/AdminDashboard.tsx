import { Package, Clock, CheckCircle2, TrendingUp, ArrowUpRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { useShipments } from "@/context/ShipmentsContext";

export default function AdminDashboard() {
  const { shipments } = useShipments();
  const total = shipments.length;
  const pending = shipments.filter((s) => s.currentStage === "Bea Cukai Clearance" && s.status === "Pending").length;
  const completed = shipments.filter((s) => s.status === "Completed").length;
  const inTransit = shipments.filter((s) => s.status === "In Transit").length;

  const stats = [
    { label: "Total Shipments", value: total, icon: Package, accent: "text-primary", bg: "bg-primary/10", trend: "+12%" },
    { label: "Pending Clearance", value: pending, icon: Clock, accent: "text-warning", bg: "bg-warning-soft", trend: "Bea Cukai" },
    { label: "In Transit", value: inTransit, icon: TrendingUp, accent: "text-primary", bg: "bg-primary/10", trend: "Live" },
    { label: "Completed", value: completed, icon: CheckCircle2, accent: "text-success", bg: "bg-success-soft", trend: "+8%" },
  ];

  return (
    <DashboardLayout variant="admin" title="Dashboard" subtitle="Operational overview · live on-chain">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:shadow-elegant"
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} ${s.accent}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{s.trend}</span>
            </div>
            <div className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Recent shipments</h2>
            <p className="text-xs text-muted-foreground">Last 5 logistics events signed on-chain</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {shipments.slice(0, 5).map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition-smooth hover:bg-muted/40">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-primary">{s.id}</span>
                <div>
                  <div className="text-sm font-medium text-foreground">{s.itemName}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.origin.split(",")[0]} → {s.destination.split(",")[0]}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge
                  variant={
                    s.status === "Completed" ? "success" : s.status === "Pending" ? "warning" : "info"
                  }
                >
                  {s.currentStage}
                </StatusBadge>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
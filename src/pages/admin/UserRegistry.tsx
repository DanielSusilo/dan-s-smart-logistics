import { Search, BadgeCheck, Hash } from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { REGISTRY } from "@/lib/mock-data";

export default function UserRegistry() {
  const [q, setQ] = useState("");
  const filtered = REGISTRY.filter(
    (e) =>
      e.name.toLowerCase().includes(q.toLowerCase()) ||
      e.publicKey.toLowerCase().includes(q.toLowerCase()) ||
      e.role.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <DashboardLayout variant="admin" title="User Registry" subtitle="Off-chain entities mapped to on-chain public keys">
      <div className="rounded-2xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div>
            <h2 className="font-display text-base font-semibold">Registered entities</h2>
            <p className="text-xs text-muted-foreground">{filtered.length} of {REGISTRY.length} shown</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, key, role…" className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Entity</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Public Key</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((e) => (
                <tr key={e.publicKey} className="transition-smooth hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium text-foreground">{e.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{e.role}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground">
                      <Hash className="h-3 w-3 opacity-60" />
                      {e.publicKey}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{e.location}</td>
                  <td className="px-6 py-4">
                    {e.verified ? (
                      <StatusBadge variant="success"><BadgeCheck className="h-3 w-3" /> Verified</StatusBadge>
                    ) : (
                      <StatusBadge variant="warning">Pending</StatusBadge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{e.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
import { useMemo, useState } from "react";
import {
  Search,
  ShieldCheck,
  Anchor,
  Boxes,
  Link2,
  ArrowRight,
  Sparkles,
  Globe2,
  MapPin,
  Package,
} from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShipmentTimeline } from "@/components/ShipmentTimeline";
import { StatusBadge } from "@/components/StatusBadge";
import { useShipments } from "@/context/ShipmentsContext";
import { toast } from "sonner";

const Index = () => {
  const { getById, shipments } = useShipments();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showSuggest, setShowSuggest] = useState(false);

  const result = activeId ? getById(activeId) : null;

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return shipments
      .filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.itemName.toLowerCase().includes(q) ||
          s.supplier.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q) ||
          s.hsCode.toLowerCase().includes(q),
      )
      .slice(0, 5);
  }, [query, shipments]);

  const select = (id: string) => {
    setActiveId(id);
    setQuery(id);
    setShowSuggest(false);
    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const found = getById(q) ?? suggestions[0];
    if (found) {
      select(found.id);
    } else {
      toast.error("Item tidak ditemukan", {
        description: `Tidak ada shipment yang cocok dengan "${q}". Coba DSL-8829, "Coffee", atau "Cipta".`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-x-0 top-0 -z-0 h-[520px] bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container relative pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-card backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-success" />
              Live on Solana Devnet · Bea Cukai Pilot
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Transparent, Immutable, and{" "}
              <span className="bg-gradient-to-r from-primary via-primary-glow to-success bg-clip-text text-transparent">
                Secure Logistics
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Real-time, on-chain visibility for port operations and customs clearance across
              Indonesia. From Tanjung Emas to Tanjung Priok — every signature, verified.
            </p>
          </div>

          {/* Tracking */}
          <div id="track" className="mx-auto mt-12 max-w-2xl">
            <form
              onSubmit={handleSearch}
              className="group relative flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-elegant transition-smooth focus-within:border-primary focus-within:shadow-glow"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                <Search className="h-5 w-5" />
              </div>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Item ID — try DSL-8829"
                className="h-11 flex-1 border-0 bg-transparent px-0 font-mono text-base shadow-none focus-visible:ring-0"
              />
              <Button type="submit" className="h-11 gap-2 bg-gradient-primary px-5 shadow-glow">
                Track
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Sample IDs:</span>
              {shipments.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setQuery(s.id);
                    setActiveId(s.id);
                    setTimeout(
                      () =>
                        document
                          .getElementById("result")
                          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                      50,
                    );
                  }}
                  className="rounded-full border border-border bg-card px-2.5 py-1 font-mono transition-smooth hover:border-primary hover:text-primary"
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>

          {/* Trust strip */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { k: "12,840+", v: "Shipments tracked" },
              { k: "98.7%", v: "On-time clearance" },
              { k: "47", v: "Bea Cukai nodes" },
              { k: "0", v: "Tampering events" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-xl border border-border bg-card/60 p-4 text-center backdrop-blur"
              >
                <div className="font-display text-2xl font-bold text-foreground">{s.k}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULT */}
      {result && (
        <section id="result" className="border-t border-border bg-gradient-subtle">
          <div className="container py-16 animate-fade-in-up">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-2xl border border-border bg-card shadow-elegant">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-6 sm:p-8">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-primary">{result.id}</span>
                      <StatusBadge
                        variant={
                          result.status === "Completed"
                            ? "success"
                            : result.status === "Pending"
                              ? "warning"
                              : "info"
                        }
                      >
                        {result.status}
                      </StatusBadge>
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-bold text-foreground">
                      {result.itemName}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {result.origin}{" "}
                      <ArrowRight className="mx-1 inline h-3 w-3" /> {result.destination}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Supplier</div>
                      <div className="mt-0.5 font-medium text-foreground">{result.supplier}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">HS Code</div>
                      <div className="mt-0.5 font-mono text-foreground">{result.hsCode}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <ShipmentTimeline shipment={result} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section id="how" className="border-t border-border">
        <div className="container py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built for Indonesian ports
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every actor signs with their wallet. Every event lives on-chain. No more lost
              paperwork, no more forged stamps.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                icon: Anchor,
                title: "Port-native",
                desc: "Designed around Tanjung Emas, Tanjung Priok, and Belawan workflows.",
              },
              {
                icon: ShieldCheck,
                title: "Bea Cukai signed",
                desc: "Customs officers approve clearance with cryptographic signatures.",
              },
              {
                icon: Link2,
                title: "Immutable trail",
                desc: "From raw material to retail — a single, tamper-proof timeline.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card/50">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Boxes className="h-4 w-4 text-primary" />
            © {new Date().getFullYear()} Dan.s Logistic — Built for Indonesian supply chains.
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Globe2 className="h-3.5 w-3.5" />
            Solana Mainnet · v0.1.0-mvp
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Shield, Anchor, User, Loader2, ArrowLeft, Mail, Lock, Building2, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth, AuthRole } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const roleMeta: Record<AuthRole, { label: string; desc: string; icon: typeof Shield; tone: string }> = {
  admin: { label: "Admin", desc: "Operasi & registry", icon: Shield, tone: "primary" },
  "bea-cukai": { label: "Bea Cukai", desc: "Verifikasi customs", tone: "success", icon: Anchor },
  customer: { label: "Customer", desc: "Lacak shipment", tone: "primary", icon: User },
};

const routeFor = (r: AuthRole) =>
  r === "admin" ? "/admin" : r === "bea-cukai" ? "/customs" : "/customer";

export default function Auth() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "register" ? "register" : "login";
  const initialRole = (params.get("role") as AuthRole) || "customer";
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [role, setRole] = useState<AuthRole>(initialRole);
  const [loading, setLoading] = useState(false);

  // login fields
  const [lEmail, setLEmail] = useState("");
  const [lPass, setLPass] = useState("");

  // register fields
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPass, setRPass] = useState("");
  const [rPass2, setRPass2] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(lEmail, lPass);
      toast.success(`Selamat datang, ${u.name}`);
      navigate(routeFor(u.role));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rPass.length < 6) return toast.error("Password minimal 6 karakter.");
    if (rPass !== rPass2) return toast.error("Konfirmasi password tidak cocok.");
    setLoading(true);
    try {
      const u = await register({ email: rEmail, password: rPass, name, role, company });
      toast.success(`Akun ${roleMeta[u.role].label} dibuat`, { description: "Wallet on-chain ter-generate." });
      navigate(routeFor(u.role));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (r: AuthRole) => {
    if (r === "admin") { setLEmail("admin@danslogistic.id"); setLPass("admin123"); }
    if (r === "bea-cukai") { setLEmail("officer@beacukai.go.id"); setLPass("bea12345"); }
    if (r === "customer") { setLEmail("customer@cipta.co.id"); setLPass("cust1234"); }
    setMode("login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-primary/10 to-transparent" />

      <div className="relative">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/"><BrandLogo /></Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke beranda
          </Link>
        </div>

        <div className="container grid gap-8 py-10 lg:grid-cols-[1fr_minmax(0,440px)] lg:py-16">
          {/* LEFT: Pitch + demo accounts */}
          <div className="hidden flex-col justify-center lg:flex">
            <span className="font-mono text-[10px] uppercase tracking-widest text-success">Secured by Solana</span>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight">
              Masuk ke jaringan logistik <span className="bg-gradient-to-r from-primary via-primary-glow to-success bg-clip-text text-transparent">on-chain</span> Indonesia.
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Setiap akun otomatis mendapat wallet Solana untuk menandatangani pergerakan barang dari pelabuhan hingga gudang.
            </p>

            <div className="mt-8 space-y-2.5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Akun demo</div>
              {(Object.keys(roleMeta) as AuthRole[]).map((r) => {
                const m = roleMeta[r];
                const Icon = m.icon;
                return (
                  <button
                    key={r}
                    onClick={() => fillDemo(r)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-smooth hover:border-primary hover:shadow-glow"
                  >
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      r === "bea-cukai" ? "bg-success/10 text-success" : "bg-primary/10 text-primary",
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{m.label}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">
                        {r === "admin" && "admin@danslogistic.id · admin123"}
                        {r === "bea-cukai" && "officer@beacukai.go.id · bea12345"}
                        {r === "customer" && "customer@cipta.co.id · cust1234"}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-primary">Isi otomatis →</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Card */}
          <div className="rounded-2xl border border-border bg-card/95 p-6 shadow-elegant backdrop-blur sm:p-8">
            <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "register")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Masuk</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="l-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="l-email" type="email" required value={lEmail} onChange={(e) => setLEmail(e.target.value)} placeholder="nama@perusahaan.id" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="l-pass">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="l-pass" type="password" required value={lPass} onChange={(e) => setLPass(e.target.value)} placeholder="••••••••" className="pl-9" />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full gap-2 bg-gradient-primary shadow-glow">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Menghubungkan wallet…</> : "Masuk & Hubungkan Wallet"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Daftar sebagai</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(roleMeta) as AuthRole[]).map((r) => {
                        const m = roleMeta[r];
                        const Icon = m.icon;
                        const active = role === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={cn(
                              "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-smooth",
                              active
                                ? "border-primary bg-primary/5 shadow-glow"
                                : "border-border bg-card hover:border-primary/40",
                            )}
                          >
                            <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                            <span className="text-xs font-semibold">{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="r-name">Nama lengkap</Label>
                      <div className="relative">
                        <UserCircle2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="r-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Budi Santoso" className="pl-9" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="r-company">{role === "bea-cukai" ? "Kantor" : "Perusahaan"}</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="r-company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder={role === "bea-cukai" ? "Bea Cukai Semarang" : "PT Contoh Logistik"} className="pl-9" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="r-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="r-email" type="email" required value={rEmail} onChange={(e) => setREmail(e.target.value)} placeholder="nama@perusahaan.id" className="pl-9" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="r-pass">Password</Label>
                      <Input id="r-pass" type="password" required value={rPass} onChange={(e) => setRPass(e.target.value)} placeholder="Min. 6 karakter" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="r-pass2">Konfirmasi</Label>
                      <Input id="r-pass2" type="password" required value={rPass2} onChange={(e) => setRPass2(e.target.value)} placeholder="Ulangi password" />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full gap-2 bg-gradient-primary shadow-glow">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Membuat wallet…</> : "Daftar & Generate Wallet"}
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground">
                    Dengan mendaftar, sebuah wallet Solana akan otomatis dibuat untuk akun Anda.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
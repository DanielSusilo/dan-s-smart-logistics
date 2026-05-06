import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, ChevronDown, LogOut, Copy, Check, Shield, Anchor, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWallet } from "@/context/WalletContext";
import { toast } from "sonner";

export function WalletButton() {
  const { connected, address, role, connect, disconnect, connecting } = useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async (r: "admin" | "bea-cukai" | "customer") => {
    setOpen(false);
    await connect(r);
    toast.success("Wallet connected", { description: "Phantom-compatible signature verified." });
    navigate(r === "admin" ? "/admin" : r === "bea-cukai" ? "/customs" : "/customer");
  };

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  if (connected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 border-border bg-card font-mono text-xs">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse-ring" />
            {address}
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-display">
            Connected as <span className="text-primary">{role === "admin" ? "Admin" : role === "bea-cukai" ? "Bea Cukai" : "Customer"}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopy} className="gap-2">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            <span className="font-mono text-xs">{address}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              disconnect();
              navigate("/");
              toast("Wallet disconnected");
            }}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={connecting}
        className="gap-2 bg-gradient-primary shadow-glow transition-smooth hover:shadow-elegant"
      >
        <Wallet className="h-4 w-4" />
        {connecting ? "Connecting…" : "Connect Wallet"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Connect your wallet</DialogTitle>
            <DialogDescription>
              Select the role you want to authenticate as. In production, your role is derived from your wallet's on-chain registry entry.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 pt-2">
            <button
              onClick={() => handleConnect("admin")}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-smooth hover:border-primary hover:shadow-glow"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">Admin</div>
                <div className="text-sm text-muted-foreground">Manage shipments, registry, and operations.</div>
              </div>
              <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground transition-smooth group-hover:translate-x-1 group-hover:text-primary" />
            </button>
            <button
              onClick={() => handleConnect("bea-cukai")}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-smooth hover:border-success hover:shadow-glow"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-success/10 text-success">
                <Anchor className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">Bea Cukai</div>
                <div className="text-sm text-muted-foreground">Verify and sign customs clearance on-chain.</div>
              </div>
              <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground transition-smooth group-hover:translate-x-1 group-hover:text-success" />
            </button>
            <button
              onClick={() => handleConnect("customer")}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-smooth hover:border-primary hover:shadow-glow"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">Customer</div>
                <div className="text-sm text-muted-foreground">Track your shipments and view on-chain proofs.</div>
              </div>
              <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground transition-smooth group-hover:translate-x-1 group-hover:text-primary" />
            </button>
          </div>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Powered by Solana · Phantom-compatible
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, ChevronDown, LogOut, Copy, Check, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/context/WalletContext";
import { toast } from "sonner";

export function WalletButton() {
  const { connected, address, role, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const dashRoute = role === "admin" ? "/admin" : role === "bea-cukai" ? "/customs" : "/customer";

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
          <DropdownMenuItem onClick={() => navigate(dashRoute)} className="gap-2">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy} className="gap-2">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            <span className="font-mono text-xs">{address}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              disconnect();
              navigate("/");
              toast("Wallet terputus");
            }}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => navigate("/auth?mode=login")} className="hidden sm:inline-flex">
        Masuk
      </Button>
      <Button
        onClick={() => navigate("/auth?mode=register")}
        className="gap-2 bg-gradient-primary shadow-glow transition-smooth hover:shadow-elegant"
      >
        <Wallet className="h-4 w-4" />
        Daftar / Login
      </Button>
    </div>
  );
}
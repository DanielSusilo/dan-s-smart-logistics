import { Link } from "react-router-dom";
import { BrandLogo } from "./BrandLogo";
import { WalletButton } from "./WalletButton";
import { NotificationBell } from "./NotificationBell";
import { useWallet } from "@/context/WalletContext";

export function TopNav() {
  const { connected } = useWallet();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="transition-smooth hover:opacity-80">
          <BrandLogo />
        </Link>
        <div className="flex items-center gap-3">
          <a href="#track" className="hidden text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground sm:inline">
            Track
          </a>
          <a href="#how" className="hidden text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground sm:inline">
            How it works
          </a>
          {connected && <NotificationBell />}
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
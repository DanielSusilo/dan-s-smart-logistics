import { Anchor } from "lucide-react";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
        <Anchor className="h-5 w-5 text-primary-foreground" strokeWidth={2.25} />
        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success ring-2 ring-background" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          Sea Logistic <span className="text-primary-glow">Ancor</span>
        </span>
        <span className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          On-Chain Port & Customs
        </span>
      </div>
    </div>
  );
}
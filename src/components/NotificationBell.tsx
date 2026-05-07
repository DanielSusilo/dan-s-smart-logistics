import { Bell, CheckCheck, AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";
import { useNotifications, Notification } from "@/context/NotificationsContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const iconFor = (t: Notification["type"]) =>
  t === "success" ? CheckCircle2 : t === "warning" ? AlertTriangle : t === "error" ? XCircle : Info;

const toneFor = (t: Notification["type"]) =>
  t === "success" ? "text-success bg-success-soft" :
  t === "warning" ? "text-warning bg-warning-soft" :
  t === "error" ? "text-destructive bg-destructive/10" :
  "text-primary bg-primary/10";

const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}d`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}j`;
  return `${Math.floor(s / 86400)}h`;
};

export function NotificationBell({ className }: { className?: string }) {
  const { notifications, unreadCount, markAllRead, clear } = useNotifications();

  return (
    <DropdownMenu onOpenChange={(o) => o && unreadCount > 0 && setTimeout(markAllRead, 800)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative h-9 w-9 rounded-full", className)}
          aria-label="Notifikasi"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[340px] p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-primary" />
            <span className="font-display text-sm font-semibold">Notifikasi</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">
                {unreadCount} baru
              </span>
            )}
          </div>
          <button
            onClick={() => clear()}
            className="text-[11px] text-muted-foreground hover:text-foreground"
          >
            Bersihkan
          </button>
        </div>
        <div className="max-h-[360px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
              <CheckCheck className="h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-xs text-muted-foreground">Tidak ada notifikasi.</p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = iconFor(n.type);
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-3 border-b border-border px-3 py-3 last:border-b-0",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", toneFor(n.type))}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">{n.title}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                    {n.shipmentId && (
                      <span className="mt-1 inline-block font-mono text-[10px] text-primary">{n.shipmentId}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
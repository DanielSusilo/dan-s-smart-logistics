import { Check, Clock, Hash } from "lucide-react";
import { Shipment, STAGES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ShipmentTimeline({ shipment }: { shipment: Shipment }) {
  const currentIdx = STAGES.indexOf(shipment.currentStage);

  return (
    <ol className="relative space-y-1">
      {shipment.timeline.map((event, idx) => {
        const isCompleted = event.completed;
        const isCurrent = idx === currentIdx && !isCompleted;
        const isLast = idx === shipment.timeline.length - 1;

        return (
          <li key={event.stage} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[19px] top-10 h-full w-px",
                  isCompleted ? "bg-success/40" : "bg-border",
                )}
              />
            )}
            <div
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 transition-smooth",
                isCompleted
                  ? "bg-success text-success-foreground ring-success/15"
                  : isCurrent
                    ? "bg-warning text-warning-foreground ring-warning/15 animate-pulse-ring"
                    : "bg-muted text-muted-foreground ring-background",
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" strokeWidth={3} />
              ) : (
                <Clock className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h4
                  className={cn(
                    "font-display font-semibold",
                    isCompleted ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {event.stage}
                </h4>
                {isCompleted && (
                  <span className="rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                    Verified
                  </span>
                )}
                {isCurrent && (
                  <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning">
                    In progress
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {event.location} · {event.timestamp}
              </p>
              {isCompleted && event.txHash && (
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-mono text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    {event.txHash.slice(0, 10)}…{event.txHash.slice(-6)}
                  </span>
                  <span className="text-muted-foreground/70">
                    Signed by <span className="font-medium text-foreground/80">{event.signedBy}</span>
                  </span>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
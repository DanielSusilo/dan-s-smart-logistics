import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { useAuth, AuthRole } from "./AuthContext";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  shipmentId?: string;
  targetRoles?: AuthRole[];
  read: boolean;
  createdAt: number;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  push: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markAllRead: () => void;
  clear: () => void;
}

const Ctx = createContext<NotificationsState | undefined>(undefined);

const SEED: Notification[] = [
  {
    id: "n1",
    title: "Shipment cleared",
    message: "DSL-8829 telah lolos pemeriksaan Bea Cukai Semarang.",
    type: "success",
    shipmentId: "DSL-8829",
    read: false,
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: "n2",
    title: "Menunggu verifikasi",
    message: "DSL-8830 menunggu tanda tangan Bea Cukai Tanjung Priok.",
    type: "warning",
    shipmentId: "DSL-8830",
    read: false,
    createdAt: Date.now() - 1000 * 60 * 90,
  },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(SEED);
  const { user } = useAuth();

  const push: NotificationsState["push"] = useCallback((n) => {
    setNotifications((prev) => [
      { ...n, id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, read: false, createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clear = () => setNotifications([]);

  const visible = useMemo(
    () =>
      notifications.filter(
        (n) => !n.targetRoles || (user && n.targetRoles.includes(user.role)),
      ),
    [notifications, user],
  );
  const unreadCount = visible.filter((n) => !n.read).length;

  return (
    <Ctx.Provider value={{ notifications: visible, unreadCount, push, markAllRead, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
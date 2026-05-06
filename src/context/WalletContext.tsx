import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "admin" | "bea-cukai" | "customer" | null;

interface WalletState {
  connected: boolean;
  address: string | null;
  role: Role;
  connect: (role: Exclude<Role, null>) => Promise<void>;
  disconnect: () => void;
  connecting: boolean;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

const mockAddress = () =>
  "DnsL" +
  Array.from({ length: 6 }, () =>
    "ABCDEFGHJKLMNPQRSTUVWXYZ123456789"[Math.floor(Math.random() * 33)],
  ).join("") +
  "..." +
  Array.from({ length: 4 }, () =>
    "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)],
  ).join("");

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [connecting, setConnecting] = useState(false);

  const connect = async (r: Exclude<Role, null>) => {
    setConnecting(true);
    await new Promise((res) => setTimeout(res, 1100));
    setAddress(mockAddress());
    setRole(r);
    setConnected(true);
    setConnecting(false);
  };

  const disconnect = () => {
    setConnected(false);
    setAddress(null);
    setRole(null);
  };

  return (
    <WalletContext.Provider value={{ connected, address, role, connect, disconnect, connecting }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
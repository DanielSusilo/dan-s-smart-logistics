import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useWallet, Role } from "@/context/WalletContext";

export function ProtectedRoute({
  children,
  allow,
}: {
  children: ReactNode;
  allow: Exclude<Role, null>;
}) {
  const { connected, role } = useWallet();
  if (!connected) return <Navigate to="/" replace />;
  if (role !== allow) return <Navigate to="/" replace />;
  return <>{children}</>;
}
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type AuthRole = "admin" | "bea-cukai" | "customer";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AuthRole;
  company?: string;
  walletAddress: string;
  createdAt: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

interface AuthState {
  user: AuthUser | null;
  users: AuthUser[];
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: AuthRole;
    company?: string;
  }) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_USERS = "dansl_users";
const STORAGE_SESSION = "dansl_session";

const mockAddress = () =>
  "DnsL" +
  Array.from({ length: 6 }, () =>
    "ABCDEFGHJKLMNPQRSTUVWXYZ123456789"[Math.floor(Math.random() * 33)],
  ).join("") +
  "..." +
  Array.from({ length: 4 }, () =>
    "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)],
  ).join("");

const seed = (): StoredUser[] => [
  {
    id: "u-admin",
    email: "admin@danslogistic.id",
    password: "admin123",
    name: "Admin Operasional",
    role: "admin",
    company: "Dan.s Logistic HQ",
    walletAddress: "DnsLADMIN42...kx9p",
    createdAt: "2026-01-10",
  },
  {
    id: "u-bea",
    email: "officer@beacukai.go.id",
    password: "bea12345",
    name: "Officer Bea Cukai",
    role: "bea-cukai",
    company: "Bea Cukai Semarang",
    walletAddress: "DnsLBEACUK1...m4qr",
    createdAt: "2026-01-12",
  },
  {
    id: "u-cust",
    email: "customer@cipta.co.id",
    password: "cust1234",
    name: "Budi Santoso",
    role: "customer",
    company: "PT Cipta Logistik Nusantara",
    walletAddress: "DnsLCUST88...t7zw",
    createdAt: "2026-02-05",
  },
];

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (!raw) {
      const s = seed();
      localStorage.setItem(STORAGE_USERS, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return seed();
  }
}

function saveUsers(u: StoredUser[]) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(u));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>(() => loadUsers());
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_SESSION);
      if (s) setUser(JSON.parse(s));
    } catch {}
  }, []);

  const persistSession = (u: AuthUser | null) => {
    if (u) localStorage.setItem(STORAGE_SESSION, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_SESSION);
  };

  const login: AuthState["login"] = async (email, password) => {
    await new Promise((r) => setTimeout(r, 700));
    const found = storedUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) throw new Error("Email atau password salah.");
    const { password: _pw, ...safe } = found;
    setUser(safe);
    persistSession(safe);
    return safe;
  };

  const register: AuthState["register"] = async (data) => {
    await new Promise((r) => setTimeout(r, 900));
    if (storedUsers.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error("Email sudah terdaftar.");
    }
    const newUser: StoredUser = {
      id: `u-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      company: data.company,
      walletAddress: mockAddress(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const next = [...storedUsers, newUser];
    setStoredUsers(next);
    saveUsers(next);
    const { password: _pw, ...safe } = newUser;
    setUser(safe);
    persistSession(safe);
    return safe;
  };

  const logout = () => {
    setUser(null);
    persistSession(null);
  };

  const users: AuthUser[] = storedUsers.map(({ password: _p, ...rest }) => rest);

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
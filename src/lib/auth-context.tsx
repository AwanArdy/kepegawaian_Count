import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { demoUsers, type User, type Role } from "./simpeg-data";

interface AuthCtx {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const r = typeof window !== "undefined" ? localStorage.getItem("simpeg_role") : null;
    if (r && demoUsers[r]) setUser(demoUsers[r]);
  }, []);

  const login = (role: Role) => {
    localStorage.setItem("simpeg_role", role);
    setUser(demoUsers[role]);
  };
  const logout = () => {
    localStorage.removeItem("simpeg_role");
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

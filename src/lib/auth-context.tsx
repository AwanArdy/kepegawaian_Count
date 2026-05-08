import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getStoredUsers, type User, type Role } from "./simpeg-data";

interface AuthCtx {
  user: User | null;
  login: (role: string) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("simpeg_user_id") : null;
    const users = getStoredUsers();
    if (userId && users[userId]) setUser(users[userId]);
  }, []);

  const login = (userId: string) => {
    const users = getStoredUsers();
    if (users[userId]) {
      localStorage.setItem("simpeg_user_id", userId);
      setUser(users[userId]);
    }
  };
  const logout = () => {
    localStorage.removeItem("simpeg_user_id");
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

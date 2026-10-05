import type { Utilisateur } from "../types/auth";
import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";

interface AuthContextType {
  user: Utilisateur | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = Boolean(user);
  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    setUser(response.data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };
  useEffect(() => {
    const checkCookie = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkCookie();
  }, []);
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

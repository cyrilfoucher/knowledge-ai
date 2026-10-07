import type { Utilisateur } from "../types/auth";
import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";

interface AuthContextType {
  user: Utilisateur | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<Utilisateur>;
  signUp: (name: string, email: string, password: string) => Promise<Utilisateur>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
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
    return response.data.user;
  };
  const signUp = async (name: string, email: string, password: string) => {
    await api.post("/auth/register", { name, email, password });
    return login(email, password);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };
  const updateProfile = async (name: string, email: string) => {
    const response = await api.patch("/auth/me", { name, email });
    setUser(response.data.user);
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
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, signUp, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

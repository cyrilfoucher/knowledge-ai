import type { Utilisateur } from "../types/auth";
import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import api from "../api/axios";

interface AuthContextType {
  user: Utilisateur | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<Utilisateur>;
  signUp: (name: string, email: string, password: string) => Promise<Utilisateur>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  loginDemo: () => Promise<Utilisateur>;
  loginDemoAdmin: () => Promise<Utilisateur>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = Boolean(user);

  const login = async (email: string, password: string) => {
    const response = await api.post<{ user: Utilisateur }>("/auth/login", { email, password });
    setUser(response.data.user);
    return response.data.user;
  };
  const loginDemo = async () => {
    const response = await api.post<{ user: Utilisateur }>("/auth/demo");
    setUser(response.data.user);
    return response.data.user;
  };
  const loginDemoAdmin = async () => {
    const response = await api.post<{ user: Utilisateur }>("/auth/demo-admin");
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
    const response = await api.patch<{ user: Utilisateur }>("/auth/me", { name, email });
    setUser(response.data.user);
  };

  useEffect(() => {
    const checkCookie = async () => {
      try {
        const response = await api.get<{ user: Utilisateur }>("/auth/me");
        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkCookie();
  }, []);

  useEffect(() => {
    const id = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const url = isAxiosError(error) ? error.config?.url : undefined;
        const isAuthRequest = url === "/auth/me" || url === "/auth/login";
        if (isAxiosError(error) && error.response?.status === 401 && !isAuthRequest) {
          setUser(null);
          toast.error("Ta session a expiré, reconnecte-toi.", { id: "session-expired" });
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signUp,
        logout,
        updateProfile,
        loginDemo,
        loginDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

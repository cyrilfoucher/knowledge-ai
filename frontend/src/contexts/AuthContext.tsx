import type { Utilisateur } from "../types/auth";
import { createContext } from "react";

interface AuthContextType {
  utilisateur: Utilisateur | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, motDePasse: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;

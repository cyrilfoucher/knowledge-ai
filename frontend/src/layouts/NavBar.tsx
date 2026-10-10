import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="text-lg font-semibold text-heading">
            DevKnowledge
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/knowledge" className="text-sm hover:text-primary hidden sm:block">
              Mes connaissances
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-surface hover:text-text"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary"
              >
                {user?.name.charAt(0)}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-surface py-1 shadow-lg">
                  <p className="px-4 py-2 text-xs text-muted">{user?.email}</p>
                  <NavLink to="/account" className="block px-4 py-2 text-sm hover:bg-bg">
                    Mon compte
                  </NavLink>
                  <NavLink
                    to="/knowledge"
                    className="block px-4 py-2 text-sm hover:bg-bg sm:hidden"
                  >
                    Mes connaissances
                  </NavLink>

                  <button
                    onClick={logout}
                    className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-danger hover:bg-bg"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/login" className="text-sm text-muted hover:text-text">
                Connexion
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-on-primary hover:bg-primary-hover"
              >
                Inscription
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

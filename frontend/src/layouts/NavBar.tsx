import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function closeMenus() {
    setMenuOpen(false);
    setMobileOpen(false);
  }

  function handleLogout() {
    closeMenus();
    logout();
  }

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const themeLabel = theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre";
  const desktopLink = "hidden text-sm hover:text-primary sm:block";
  const mobileLink = "block rounded-md px-3 py-2 text-sm hover:bg-surface";

  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <NavLink to="/" onClick={closeMenus} className="text-lg font-semibold text-heading">
            DevKnowledge
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/knowledge" className={desktopLink}>
              Mes connaissances
            </NavLink>
          )}
          <NavLink to="/explore" className={desktopLink}>
            Découvrir
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={desktopLink}>
              Administration
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <button
            onClick={onToggleTheme}
            aria-label={themeLabel}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted hover:bg-surface hover:text-text"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu du compte"
                aria-expanded={menuOpen}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary"
              >
                {user?.name.charAt(0)}
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-52 rounded-lg border border-border bg-surface py-1 shadow-lg">
                  <p className="px-4 py-2 text-xs text-muted">{user?.email}</p>
                  <NavLink
                    to="/account"
                    onClick={closeMenus}
                    className="block px-4 py-2 text-sm hover:bg-bg"
                  >
                    Mon compte
                  </NavLink>
                  <button
                    onClick={handleLogout}
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

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted hover:text-text sm:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border px-4 py-3 sm:hidden">
          {isAuthenticated && <p className="px-3 pb-2 text-xs text-muted">{user?.email}</p>}

          <NavLink to="/explore" onClick={closeMenus} className={mobileLink}>
            Découvrir
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/knowledge" onClick={closeMenus} className={mobileLink}>
                Mes connaissances
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" onClick={closeMenus} className={mobileLink}>
                  Administration
                </NavLink>
              )}
              <NavLink to="/account" onClick={closeMenus} className={mobileLink}>
                Mon compte
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenus} className={mobileLink}>
                Connexion
              </NavLink>
              <NavLink to="/register" onClick={closeMenus} className={mobileLink}>
                Inscription
              </NavLink>
            </>
          )}

          <div className="mt-2 border-t border-border pt-2">
            <button
              onClick={onToggleTheme}
              className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-surface"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark" ? "Thème clair" : "Thème sombre"}
            </button>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-surface"
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

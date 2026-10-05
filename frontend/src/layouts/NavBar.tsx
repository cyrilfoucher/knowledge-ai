import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <nav>
      <NavLink to="/">Accueil</NavLink>
      {isAuthenticated ? (
        <>
          <span>Bonjour {user?.name}</span>
          <button onClick={logout}>Déconnexion</button>
        </>
      ) : (
        <>
          <NavLink to="/login">Connexion</NavLink>
          <NavLink to="/register">Inscription</NavLink>
        </>
      )}
    </nav>
  );
}

export default NavBar;

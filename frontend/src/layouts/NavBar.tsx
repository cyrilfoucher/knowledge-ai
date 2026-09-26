import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <NavLink to="/">Accueil</NavLink>
      <NavLink to="/login">Connexion</NavLink>
      <NavLink to="/register">Inscription</NavLink>
    </nav>
  );
}

export default NavBar;

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <Link to="/a-propos">A propos</Link>
      <a href="mailto:macylcyril@hotmail.fr">M'nevoyer un email</a>
      <a href="tel:+33681058680">Me téléphoner</a>
      <a
        href="https://www.linkedin.com/in/cyril-foucher-a06a19236/"
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
      <a href="https://github.com/cyrilfoucher" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
      <p>© 2026 Knowledge AI</p>
    </footer>
  );
}
export default Footer;

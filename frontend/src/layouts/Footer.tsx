import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="font-semibold">DevKnowledge</p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
          <Link to="/a-propos" className="hover:text-text">
            À propos
          </Link>
          <a href="mailto:macylcyril@hotmail.fr" className="hover:text-text">
            M'envoyer un email
          </a>
          <a
            href="https://www.linkedin.com/in/cyril-foucher-a06a19236/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/cyrilfoucher"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text"
          >
            GitHub
          </a>
        </div>

        <p className="mt-3 text-xs text-muted">
          Conçu et développé par Cyril Foucher · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
export default Footer;

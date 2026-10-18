import PageHeader from "../layouts/PageHeader";
import Card from "../components/ui/Card";

const technologies = [
  {
    title: "Frontend",
    items: [
      "React 19",
      "TypeScript",
      "Vite",
      "React Router",
      "Tailwind CSS",
      "React Hook Form et Zod",
    ],
  },
  {
    title: "Backend",
    items: [
      "Node.js",
      "Express 5",
      "TypeScript",
      "Zod",
      "JWT en cookie HttpOnly",
      "Brevo pour les emails",
    ],
  },
  {
    title: "Base de données",
    items: ["PostgreSQL, hébergé sur Aiven", "Prisma 7 et ses migrations"],
  },
  {
    title: "Qualité et déploiement",
    items: ["Docker et Docker Compose", "Vitest et Supertest", "GitHub Actions (CI/CD)", "Render"],
  },
];

const externalLink = "text-link hover:underline";

function AboutPage() {
  return (
    <>
      <PageHeader title="À propos" subtitle="Le projet, ses technologies et son auteur" />

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold text-heading">Le projet</h2>
        <p className="text-muted">
          DevKnowledge est une base de connaissances techniques partagée. Je l'ai créé comme un
          outil permettant de regrouper les astuces et solutions aux problèmes rencontrés lors de
          l'écriture de code.
        </p>
        <p className="mt-3 text-muted">
          C’est mon second projet de portfolio. Par rapport au premier, il passe à TypeScript de
          bout en bout et à une base relationnelle PostgreSQL avec Prisma. Il gère aussi des
          contenus publiés par plusieurs utilisateurs, avec une modération : dépublication ou
          suppression, et un motif envoyé par email à l’auteur. Il intégrera bientôt de
          l’intelligence artificielle.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold text-heading">Technologies</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {technologies.map((category) => (
            <Card key={category.title}>
              <h3 className="font-semibold text-text">{category.title}</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold text-heading">L’auteur</h2>
        <p className="text-muted">
          Je m’appelle Cyril Foucher. Je travaille dans l’aéronautique, sur l’assemblage des moteurs
          Pratt & Whitney PW127 pour ATR, et je me reconvertis dans le développement web.
        </p>
        <p className="mt-3 text-muted">
          Le code ne m’est pas totalement étranger : pendant près de cinq ans, comme
          tourneur-fraiseur, j’ai programmé des machines à commande numérique, en langage ISO et
          avec des logiciels de FAO. C’est là qu’est né mon goût pour la programmation.
        </p>
        <p className="mt-3 text-muted">
          J’apprends le développement depuis mai 2026, le soir après mon travail. Je cherche un
          poste de développeur full stack, et je m’intéresse à l’intégration de l’intelligence
          artificielle dans les applications, que j’explore dans ce projet.
        </p>
        <div className="mt-4 flex gap-4">
          <a
            href="https://github.com/cyrilfoucher"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLink}
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/cyril-foucher-a06a19236/"
            target="_blank"
            rel="noopener noreferrer"
            className={externalLink}
          >
            LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}

export default AboutPage;

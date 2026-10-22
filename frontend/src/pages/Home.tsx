import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import api from "../api/axios";
import type { ExploreResponse, PublicKnowledge } from "../types/knowledge";
import Card from "../components/ui/Card";
import { NotebookPen, Share2, Bot } from "lucide-react";
import Button from "../components/ui/Button";
import { toast } from "sonner";
import KnowledgeTags from "../components/knowledge/KnowledgeTags";

function Home() {
  const { isAuthenticated, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);
  const [latest, setLatest] = useState<PublicKnowledge[]>([]);

  useEffect(() => {
    async function loadLatest() {
      try {
        const response = await api.get<ExploreResponse>("/explore", { params: { limit: 3 } });
        setLatest(response.data.knowledges);
      } catch {}
    }
    loadLatest();
  }, []);

  async function handleDemo() {
    try {
      setDemoLoading(true);
      await loginDemo();
      navigate("/knowledge");
    } catch {
      toast.error("Le compte de démonstration est indisponible pour le moment.");
    } finally {
      setDemoLoading(false);
    }
  }
  return (
    <>
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold text-heading">DevKnowledge</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Ta base de connaissances techniques : note ce que tu apprends, retrouve-le en un instant.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/explore"
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-on-primary hover:bg-primary-hover"
          >
            Découvrir les fiches
          </Link>
          {isAuthenticated ? (
            <Link
              to="/knowledge"
              className="rounded-lg border border-border px-5 py-2.5 font-medium hover:bg-surface"
            >
              Mes connaissances
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="rounded-lg border border-border px-5 py-2.5 font-medium hover:bg-surface"
              >
                Créer un compte
              </Link>
              <Button
                variant="secondary"
                onClick={handleDemo}
                disabled={demoLoading}
                className="px-5 py-2.5 text-base! rounded-lg"
              >
                {demoLoading ? "Connexion…" : "Essayer la démo"}
              </Button>
            </>
          )}
        </div>
      </section>
      {latest.length > 0 && (
        <section className="py-12">
          <h2 className="mb-6 text-2xl font-semibold text-heading">Dernières fiches publiques</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {latest.map((knowledge) => (
              <Link
                to={`/explore/${knowledge.id}`}
                key={knowledge.id}
                className="block h-full hover:opacity-80"
              >
                <Card className="h-full flex flex-col">
                  <h3 className="font-semibold text-text line-clamp-2">{knowledge.title}</h3>
                  <div className="mt-2">
                    <KnowledgeTags category={knowledge.category} tags={knowledge.tags} max={3} />
                  </div>
                  <p className="mt-2 text-sm text-muted line-clamp-3">{knowledge.content}</p>
                  <p className="mt-auto pt-3 text-xs text-muted">Par {knowledge.author.name}</p>
                </Card>
              </Link>
            ))}
          </div>
          <Link to="/explore" className="mt-6 inline-block text-sm text-link hover:underline">
            Voir toutes les fiches →
          </Link>
        </section>
      )}
      <section className="py-12">
        <h2 className="mb-6 text-2xl font-semibold text-heading">Pourquoi DevKnowledge ?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <NotebookPen size={24} className="text-primary" />
            <h3 className="font-semibold text-text mt-3">Organise</h3>
            <p className="mt-2 text-sm text-muted">
              Note tes solutions, tes commandes et tes découvertes, en privé ou en public.
            </p>
          </Card>
          <Card>
            <Share2 size={24} className="text-primary" />
            <h3 className="font-semibold text-text mt-3">Partage</h3>
            <p className="mt-2 text-sm text-muted">
              Publie tes fiches pour aider d’autres développeurs, et découvre les leurs.
            </p>
          </Card>
          <Card>
            <Bot size={24} className="text-primary" />
            <h3 className="font-semibold text-text mt-3">Assistée par l’IA</h3>
            <p className="mt-2 text-sm text-muted">
              Résumés automatiques et suggestions de tags. Bientôt : la recherche par le sens dans
              tes connaissances.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}

export default Home;

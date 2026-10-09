import PageHeader from "../layouts/PageHeader";
import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Knowledge } from "../types/knowledge";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import { Link } from "react-router-dom";

function KnowledgePage() {
  const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchKnowledges() {
      try {
        const response = await api.get<{ knowledges: Knowledge[] }>("/knowledges");
        setKnowledges(response.data.knowledges);
      } catch {
        setError("Impossible de charger tes connaissances");
      } finally {
        setLoading(false);
      }
    }
    fetchKnowledges();
  }, []);
  function renderContent() {
    if (loading) {
      return <p className="text-muted">Chargement en cours...</p>;
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (knowledges.length === 0) {
      return <p className="text-muted">Tu n’as encore aucune connaissance saisie.</p>;
    }
    return (
      <ul className="space-y-4">
        {knowledges.map((knowledge) => (
          <li key={knowledge.id}>
            <Link to={`/knowledge/${knowledge.id}`} className="block hover:opacity-80">
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{knowledge.title}</h2>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                    {knowledge.visibility === "PUBLIC" ? "Publique" : "Privée"}
                  </span>
                </div>
                <p className="mt-2 text-muted line-clamp-2">{knowledge.content}</p>
                <p className="mt-3 text-muted text-xs">
                  Modifiée le {new Date(knowledge.updatedAt).toLocaleDateString("fr-FR")}
                </p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <PageHeader title="Mes connaissances" />
      {renderContent()}
    </>
  );
}

export default KnowledgePage;

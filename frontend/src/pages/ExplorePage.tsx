import PageHeader from "../layouts/PageHeader";
import { useState, useEffect } from "react";
import api from "../api/axios";
import type { ExploreResponse } from "../types/knowledge";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

function ExplorePage() {
  const [data, setData] = useState<ExploreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  useEffect(() => {
    async function loadingKnowledge() {
      try {
        const response = await api.get<ExploreResponse>("/explore", { params: { page } });
        setData(response.data);
      } catch {
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    }
    loadingKnowledge();
  }, [page]);
  function renderContent() {
    if (loading) {
      return <p className="text-muted">Chargement...</p>;
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (!data || data.knowledges.length === 0) {
      return <p>Aucune fiche publique pour le moment</p>;
    }
    return (
      <>
        <ul className="space-y-4">
          {data.knowledges.map((knowledge) => (
            <li key={knowledge.id}>
              <Link to={`/explore/${knowledge.id}`} className="block hover:opacity-80">
                <Card>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-heading">{knowledge.title}</h2>
                  </div>
                  <p className="mt-2 text-muted line-clamp-2">{knowledge.content}</p>
                  <p className="mt-3 text-muted text-xs">
                    Par {knowledge.author.name} · Modifiée le{" "}
                    {new Date(knowledge.updatedAt).toLocaleDateString("fr-FR")}
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Découvrir" subtitle="Les connaissances partagées par la communauté" />
      {renderContent()}
    </>
  );
}
export default ExplorePage;

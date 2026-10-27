import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import type { ExploreResponse } from "../types/knowledge";
import { useAuth } from "../hooks/useAuth";
import PageHeader from "../layouts/PageHeader";
import Alert from "../components/ui/Alert";
import Pagination from "../components/ui/Pagination";
import PageSizeSelect from "../components/ui/PageSizeSelect";
import KnowledgeCard from "../components/knowledge/KnowledgeCard";

function FavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<ExploreResponse | null>(null);
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function getMyFavorites() {
      try {
        setError(null);
        const response = await api.get<ExploreResponse>("/favorites", {
          params: Object.fromEntries(searchParams),
        });
        setFavorites(response.data);
      } catch {
        setError("Une erreur est survenue, impossible de charger les favoris");
      } finally {
        setLoading(false);
      }
    }
    getMyFavorites();
  }, [searchParams]);

  function updateParams(values: Record<string, string>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(values)) {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    }
    setSearchParams(next);
  }

  function renderContent() {
    if (loading) {
      return <p className="text-muted">Chargement en cours...</p>;
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (!favorites || favorites.knowledges.length === 0) {
      return <p className="text-muted">Tu n'as encore enregistré aucun favori</p>;
    }

    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            <span className="font-semibold text-heading">{favorites.total}</span>{" "}
            {favorites.total > 1 ? "favoris" : "favori"}
          </p>
          <PageSizeSelect
            value={limit}
            onChange={(value) => updateParams({ limit: String(value), page: "" })}
          />
        </div>

        <ul className="space-y-4">
          {favorites.knowledges.map((knowledge) => (
            <li key={knowledge.id}>
              <KnowledgeCard
                knowledge={knowledge}
                to={
                  knowledge.authorId === user?.id
                    ? `/knowledge/${knowledge.id}`
                    : `/explore/${knowledge.id}`
                }
                showAuthor
              />
            </li>
          ))}
        </ul>

        <Pagination
          page={page}
          totalPages={favorites.totalPages}
          onPageChange={(newPage) => updateParams({ page: String(newPage) })}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Mes favoris" subtitle="Les fiches que tu as gardées" />
      {renderContent()}
    </>
  );
}

export default FavoritesPage;

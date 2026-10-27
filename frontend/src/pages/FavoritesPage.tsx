import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { ExploreResponse } from "../types/knowledge";
import { useAuth } from "../hooks/useAuth";
import PageHeader from "../layouts/PageHeader";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import Pagination from "../components/ui/Pagination";
import PageSizeSelect from "../components/ui/PageSizeSelect";
import KnowledgeTags from "../components/knowledge/KnowledgeTags";
import FavoriteButton from "../components/knowledge/FavoriteButton";
import LikeButton from "../components/knowledge/LikeButton";

function FavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<ExploreResponse | null>(null);
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const navigate = useNavigate();

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
              <Link
                to={
                  knowledge.authorId === user?.id
                    ? `/knowledge/${knowledge.id}`
                    : `/explore/${knowledge.id}`
                }
                className="block hover:opacity-80"
              >
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold text-heading min-w-0 wrap-break-word">
                      {knowledge.title}
                    </h2>
                    <FavoriteButton knowledgeId={knowledge.id} compact />
                  </div>
                  <div className="mt-2">
                    <KnowledgeTags category={knowledge.category} tags={knowledge.tags} max={3} />
                  </div>
                  <p className="mt-2 text-muted line-clamp-2">{knowledge.content}</p>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <p className="text-muted text-xs">
                      Par{" "}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          navigate(`/users/${knowledge.authorId}`);
                        }}
                        className="cursor-pointer font-medium text-link hover:underline"
                      >
                        {knowledge.author.name}
                      </button>{" "}
                      · Modifiée le {new Date(knowledge.updatedAt).toLocaleDateString("fr-FR")}
                    </p>
                    {knowledge.visibility === "PUBLIC" && (
                      <LikeButton
                        knowledgeId={knowledge.id}
                        initialCount={knowledge._count.likes}
                        canLike={knowledge.authorId !== user?.id}
                      />
                    )}
                  </div>
                </Card>
              </Link>
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

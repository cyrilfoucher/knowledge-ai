import PageHeader from "../layouts/PageHeader";
import { useState, useEffect } from "react";
import api from "../api/axios";
import type { ExploreResponse } from "../types/knowledge";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Pagination from "../components/ui/Pagination";
import PageSizeSelect from "../components/ui/PageSizeSelect";
import KnowledgeTags from "../components/knowledge/KnowledgeTags";
import KnowledgeFilter from "../components/knowledge/KnowledgeFilters";
import FavoriteButton from "../components/knowledge/FavoriteButton";
import { useAuth } from "../hooks/useAuth";
import LikeButton from "../components/knowledge/LikeButton";

function ExplorePage() {
  const [data, setData] = useState<ExploreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "recent";
  const category = searchParams.get("category") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const navigate = useNavigate();

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

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadingKnowledge() {
      try {
        setError(null);
        const response = await api.get<ExploreResponse>("/explore", {
          params: Object.fromEntries(searchParams),
        });
        setData(response.data);
      } catch {
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    }
    loadingKnowledge();
  }, [searchParams]);
  function renderContent() {
    if (loading) {
      return <p className="text-muted">Chargement...</p>;
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (!data || data.knowledges.length === 0) {
      if (q || category || tag) {
        return <p className="text-muted">Aucune fiche ne correspond à ta recherche</p>;
      }
      return <p className="text-muted">Aucune fiche publique pour le moment</p>;
    }

    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            <span className="font-semibold text-heading">{data.total}</span>{" "}
            {data.total > 1 ? "fiches" : "fiche"}
          </p>
          <PageSizeSelect
            value={limit}
            onChange={(value) => updateParams({ limit: String(value), page: "" })}
          />
        </div>
        <ul className="space-y-4">
          {data.knowledges.map((knowledge) => (
            <li key={knowledge.id}>
              <Link to={`/explore/${knowledge.id}`} className="block hover:opacity-80">
                <Card>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-heading min-w-0 wrap-break-word">
                      {knowledge.title}
                    </h2>
                    {isAuthenticated && <FavoriteButton knowledgeId={knowledge.id} compact />}
                  </div>
                  <div className="mt-2">
                    <KnowledgeTags
                      category={knowledge.category}
                      tags={knowledge.tags}
                      max={3}
                      onTagClick={(name) => updateParams({ tag: name, page: "" })}
                    />
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
                    <LikeButton
                      knowledgeId={knowledge.id}
                      initialCount={knowledge._count.likes}
                      canLike={isAuthenticated && knowledge.authorId !== user?.id}
                    />
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onPageChange={(newPage) => updateParams({ page: String(newPage) })}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Découvrir" subtitle="Les connaissances partagées par la communauté" />
      <div className="mb-6">
        <KnowledgeFilter q={q} sort={sort} category={category} onChange={updateParams} tag={tag} />
      </div>
      {renderContent()}
    </>
  );
}
export default ExplorePage;

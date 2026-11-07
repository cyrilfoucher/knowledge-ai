import PageHeader from "../layouts/PageHeader";
import { useState, useEffect } from "react";
import api from "../api/axios";
import type { ExploreResponse } from "../types/knowledge";
import Alert from "../components/ui/Alert";
import { useSearchParams } from "react-router-dom";
import Pagination from "../components/ui/Pagination";
import PageSizeSelect from "../components/ui/PageSizeSelect";
import KnowledgeFilter from "../components/knowledge/KnowledgeFilters";
import KnowledgeCard from "../components/knowledge/KnowledgeCard";

function ExplorePage() {
  const [data, setData] = useState<ExploreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "recent";
  const category = searchParams.get("category") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const isSemantic = searchParams.get("mode") === "semantic";

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
  function changeMode(semantic: boolean) {
    updateParams({ mode: semantic ? "semantic" : "", page: "", category: "", tag: "", sort: "" });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadingKnowledge() {
      try {
        setError(null);
        if (isSemantic) {
          if (q.length < 2) {
            setData(null);
            return;
          }
          const response = await api.get<{ knowledges: ExploreResponse["knowledges"] }>(
            "/explore/search",
            { params: { q } }
          );
          setData({
            knowledges: response.data.knowledges,
            total: response.data.knowledges.length,
            totalPages: 1,
            page: 1,
            limit,
          });
          return;
        }
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
      if (isSemantic && q.length < 2) {
        return <p className="text-muted">Décris ce que tu cherches, puis lance la recherche.</p>;
      }
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
          {!isSemantic && (
            <PageSizeSelect
              value={limit}
              onChange={(value) => updateParams({ limit: String(value), page: "" })}
            />
          )}
        </div>
        <ul className="space-y-4">
          {data.knowledges.map((knowledge) => (
            <li key={knowledge.id}>
              <KnowledgeCard
                knowledge={knowledge}
                to={`/explore/${knowledge.id}`}
                showAuthor
                onTagClick={(name) => updateParams({ tag: name, page: "", mode: "" })}
              />
            </li>
          ))}
        </ul>
        {!isSemantic && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={(newPage) => updateParams({ page: String(newPage) })}
          />
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader title="Découvrir" subtitle="Les connaissances partagées par la communauté" />
      <div className="mb-3 inline-flex gap-1 rounded-lg border border-border p-1">
        <button
          type="button"
          onClick={() => changeMode(false)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            isSemantic ? "text-muted hover:text-heading" : "bg-primary/15 text-primary"
          }`}
        >
          Par mots-clés
        </button>
        <button
          type="button"
          onClick={() => changeMode(true)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            isSemantic ? "bg-primary/15 text-primary" : "text-muted hover:text-heading"
          }`}
        >
          Intelligente
        </button>
      </div>
      <div className="mb-6">
        <KnowledgeFilter
          q={q}
          sort={sort}
          category={category}
          onChange={updateParams}
          tag={tag}
          searchOnly={isSemantic}
        />
      </div>
      {renderContent()}
    </>
  );
}
export default ExplorePage;

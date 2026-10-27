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
              <KnowledgeCard
                knowledge={knowledge}
                to={`/explore/${knowledge.id}`}
                showAuthor
                onTagClick={(name) => updateParams({ tag: name, page: "" })}
              />
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

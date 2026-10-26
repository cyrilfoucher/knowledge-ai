import PageHeader from "../layouts/PageHeader";
import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Knowledge, MyKnowledgesResponse } from "../types/knowledge";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import { Link, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import Pagination from "../components/ui/Pagination";
import PageSizeSelect from "../components/ui/PageSizeSelect";
import KnowledgeTags from "../components/knowledge/KnowledgeTags";
import KnowledgeFilters from "../components/knowledge/KnowledgeFilters";
import FavoriteButton from "../components/knowledge/FavoriteButton";
import LikeButton from "../components/knowledge/LikeButton";

function KnowledgePage() {
  const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
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
    async function fetchKnowledges() {
      window.scrollTo(0, 0);
      try {
        const response = await api.get<MyKnowledgesResponse>("/knowledges", {
          params: Object.fromEntries(searchParams),
        });

        setKnowledges(response.data.knowledges);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
      } catch {
        setError("Impossible de charger tes connaissances");
      } finally {
        setLoading(false);
      }
    }
    fetchKnowledges();
  }, [searchParams]);
  function renderContent() {
    if (loading) {
      return <p className="text-muted">Chargement en cours...</p>;
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (knowledges.length === 0) {
      if (q || category || tag) {
        return <p className="text-muted">Aucune fiche ne correspond à ta recherche</p>;
      }
      return <p className="text-muted">Tu n’as encore aucune connaissance saisie.</p>;
    }

    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            <span className="font-semibold text-heading">{total}</span>{" "}
            {total > 1 ? "fiches" : "fiche"}
          </p>
          <PageSizeSelect
            value={limit}
            onChange={(value) => updateParams({ limit: String(value), page: "" })}
          />
        </div>
        <ul className="space-y-4">
          {knowledges.map((knowledge) => (
            <li key={knowledge.id}>
              <Link to={`/knowledge/${knowledge.id}`} className="block hover:opacity-80">
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold text-heading min-w-0 wrap-break-word">
                      {knowledge.title}
                    </h2>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                        {knowledge.visibility === "PUBLIC" ? "Publique" : "Privée"}
                      </span>
                      <FavoriteButton knowledgeId={knowledge.id} compact />
                    </div>
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
                      Modifiée le {new Date(knowledge.updatedAt).toLocaleDateString("fr-FR")}
                    </p>
                    {knowledge.visibility === "PUBLIC" && (
                      <LikeButton
                        knowledgeId={knowledge.id}
                        initialCount={knowledge._count.likes}
                        canLike={false}
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
          totalPages={totalPages}
          onPageChange={(newPage) => updateParams({ page: String(newPage) })}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Mes connaissances" />
      <div className="mb-6">
        <KnowledgeFilters q={q} sort={sort} category={category} onChange={updateParams} tag={tag} />
      </div>
      <Link
        to="/knowledge/new"
        className="mb-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-on-primary hover:bg-primary-hover"
      >
        <Plus size={16} /> Nouvelle fiche
      </Link>
      {renderContent()}
    </>
  );
}
export default KnowledgePage;

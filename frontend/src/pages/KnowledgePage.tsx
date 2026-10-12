import PageHeader from "../layouts/PageHeader";
import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Knowledge, MyKnowledgesResponse } from "../types/knowledge";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import Pagination from "../components/ui/Pagination";
import PageSizeSelect from "../components/ui/PageSizeSelect";

function KnowledgePage() {
  const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchKnowledges() {
      window.scrollTo(0, 0);
      try {
        const response = await api.get<MyKnowledgesResponse>("/knowledges", {
          params: { page, limit },
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
  }, [page, limit]);
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
      <>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            <span className="font-semibold text-heading">{total}</span>{" "}
            {total > 1 ? "fiches" : "fiche"}
          </p>
          <PageSizeSelect
            value={limit}
            onChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
          />
        </div>
        <ul className="space-y-4">
          {knowledges.map((knowledge) => (
            <li key={knowledge.id}>
              <Link to={`/knowledge/${knowledge.id}`} className="block hover:opacity-80">
                <Card>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-heading">{knowledge.title}</h2>
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
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Mes connaissances" />
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

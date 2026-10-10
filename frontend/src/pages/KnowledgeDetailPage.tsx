import PageHeader from "../layouts/PageHeader";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import type { Knowledge } from "../types/knowledge";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

function KnowledgeDetailPage() {
  const { id } = useParams();
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function callKnowledge() {
      try {
        const response = await api.get<{ knowledge: Knowledge }>(`/knowledges/${id}`);
        setKnowledge(response.data.knowledge);
      } catch {
        setError("Impossible de charger la connaissance");
      } finally {
        setLoading(false);
      }
    }
    callKnowledge();
  }, [id]);
  async function handleDelete() {
    const confirmed = window.confirm(
      "Supprimer définitivement cette fiche ? Cette action est irréversible."
    );
    if (!confirmed) {
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/knowledges/${id}`);
      toast.success("Fiche supprimée");
      navigate("/knowledge");
    } catch {
      setDeleteError("Impossible de supprimer la fiche.");
      setDeleting(false);
    }
  }
  function renderContent() {
    if (loading) {
      return <p className="text-muted">Chargement en cours...</p>;
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (!knowledge) {
      return <p className="text-muted">Connaissance introuvable</p>;
    }
    return (
      <Card>
        <h2 className="text-xl font-semibold">{knowledge.title}</h2>
        <p className="mt-4 whitespace-pre-line">{knowledge.content}</p>
        {deleteError && (
          <Alert variant="danger" className="mt-4">
            {deleteError}
          </Alert>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Link
            to={`/knowledge/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface"
          >
            <Pencil size={16} /> Modifier
          </Link>
          <Button
            disabled={deleting}
            onClick={handleDelete}
            variant="danger"
            className="inline-flex items-center gap-2"
          >
            <Trash2 size={16} /> {deleting ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </Card>
    );
  }
  return (
    <>
      <Link
        to="/knowledge"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-text"
      >
        <ArrowLeft size={16} />
        Mes connaissances
      </Link>
      <PageHeader title="Détails" />
      {renderContent()}
    </>
  );
}
export default KnowledgeDetailPage;

import PageHeader from "../layouts/PageHeader";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import type { Knowledge } from "../types/knowledge";
import { ArrowLeft, Trash2, Pencil, Sparkles } from "lucide-react";
import { toast } from "sonner";
import KnowledgeTags from "../components/knowledge/KnowledgeTags";
import { isAxiosError } from "axios";
import FavoriteButton from "../components/knowledge/FavoriteButton";
import LikeButton from "../components/knowledge/LikeButton";

function KnowledgeDetailPage() {
  const { id } = useParams();
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
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
  async function handleGenerateSummary() {
    try {
      setGenerating(true);
      const response = await api.post<{ knowledge: Knowledge }>(`/knowledges/${id}/summary`);
      setKnowledge(response.data.knowledge);
      toast.success("Résumé généré");
    } catch (error) {
      toast.error(
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "La génération du résumé a échoué."
      );
    } finally {
      setGenerating(false);
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h2 className="text-xl font-semibold text-heading min-w-0 wrap-break-word">
            {knowledge.title}
          </h2>
          <div className="flex items-center gap-2">
            {knowledge.visibility === "PUBLIC" && (
              <LikeButton
                knowledgeId={knowledge.id}
                initialCount={knowledge._count.likes}
                canLike={false}
              />
            )}
            <FavoriteButton knowledgeId={knowledge.id} />
          </div>
        </div>
        <div className="mt-2">
          <KnowledgeTags category={knowledge.category} tags={knowledge.tags} />
        </div>
        {knowledge.summary && (
          <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-primary">
              <Sparkles size={14} /> Résumé IA
            </p>
            <p className="whitespace-pre-line text-sm">{knowledge.summary}</p>
          </div>
        )}
        <p className="mt-4 whitespace-pre-line">{knowledge.content}</p>
        {deleteError && (
          <Alert variant="danger" className="mt-4">
            {deleteError}
          </Alert>
        )}
        <div className="mt-6 flex justify-end gap-3 flex-wrap">
          <Button
            variant="secondary"
            onClick={handleGenerateSummary}
            disabled={generating}
            className="inline-flex items-center gap-2"
          >
            <Sparkles size={16} />{" "}
            {generating
              ? "Géneration..."
              : knowledge.summary
                ? "Régénérer le résumé"
                : "Générer un résumé"}{" "}
          </Button>
          <Link
            to={`/knowledge/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface text-heading"
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

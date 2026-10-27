import PageHeader from "../layouts/PageHeader";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import type { PublicKnowledge } from "../types/knowledge";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import { ArrowLeft, EyeOff, Trash2, Sparkles } from "lucide-react";
import Textarea from "../components/ui/Textarea";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import KnowledgeTags from "../components/knowledge/KnowledgeTags";
import FavoriteButton from "../components/knowledge/FavoriteButton";
import LikeButton from "../components/knowledge/LikeButton";

function ExploreKnowledgeDetailPage() {
  const { id } = useParams();
  const [knowledge, setKnowledge] = useState<PublicKnowledge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [action, setAction] = useState<"unpublish" | "delete" | null>(null);
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  useEffect(() => {
    async function callKnowledge() {
      try {
        const response = await api.get<{ knowledge: PublicKnowledge }>(`/explore/${id}`);
        setKnowledge(response.data.knowledge);
      } catch {
        setError("Impossible de charger la connaissance");
      } finally {
        setLoading(false);
      }
    }
    callKnowledge();
  }, [id]);
  async function handleModeration() {
    if (reason.trim().length < 10) {
      setModerationError("Le motif doit contenir au moins 10 caractères.");
      return;
    }
    setSubmitting(true);
    setModerationError(null);
    try {
      if (action === "unpublish") {
        await api.patch(`/admin/knowledges/${id}/unpublish`, { reason });
        toast.success("Fiche dépubliée");
      } else {
        await api.delete(`/admin/knowledges/${id}`, { data: { reason } });
        toast.success("Fiche supprimée");
      }
      navigate("/explore");
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "L'action a échoué. Réessaie plus tard.";
      setModerationError(message);
      setSubmitting(false);
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
    const canLike = isAuthenticated && knowledge.authorId !== user?.id;
    return (
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h2 className="text-xl font-semibold text-heading min-w-0 wrap-break-word">
            {knowledge.title}
          </h2>
          <div className="flex items-center gap-2">
            <LikeButton
              knowledgeId={knowledge.id}
              initialCount={knowledge._count.likes}
              canLike={canLike}
            />
            {isAuthenticated && <FavoriteButton knowledgeId={knowledge.id} />}
          </div>
        </div>
        <div className="mt-2">
          <KnowledgeTags category={knowledge.category} tags={knowledge.tags} />
        </div>
        <p className="mt-1 text-xs text-muted">
          Par{" "}
          <Link
            to={`/users/${knowledge.authorId}`}
            className="font-medium text-link hover:underline"
          >
            {knowledge.author.name}
          </Link>{" "}
          · Modifiée le {new Date(knowledge.updatedAt).toLocaleDateString("fr-FR")}
        </p>
        {knowledge.summary && (
          <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-primary">
              <Sparkles size={14} /> Résumé IA
            </p>
            <p className="whitespace-pre-line text-sm">{knowledge.summary}</p>
          </div>
        )}
        <p className="mt-4 whitespace-pre-line">{knowledge.content}</p>
        {isAdmin && (
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setAction("unpublish")}
              className="inline-flex items-center gap-2"
            >
              <EyeOff size={16} /> Dépublier
            </Button>
            <Button
              variant="danger"
              onClick={() => setAction("delete")}
              className="inline-flex items-center gap-2"
            >
              <Trash2 size={16} /> Supprimer
            </Button>
          </div>
        )}
        {action && (
          <div className="mt-4 space-y-3">
            <Textarea
              id="reason"
              label={
                action === "unpublish" ? "Motif de la dépublication" : "Motif de la suppression"
              }
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ce motif sera envoyé à l'auteur par email."
            />
            {moderationError && <Alert variant="danger">{moderationError}</Alert>}
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setAction(null);
                  setReason("");
                  setModerationError(null);
                }}
              >
                Annuler
              </Button>
              <Button variant="danger" onClick={handleModeration} disabled={submitting}>
                {submitting ? "Envoi…" : "Confirmer"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  }
  return (
    <>
      <Link
        to="/explore"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-text"
      >
        <ArrowLeft size={16} />
        Retour à la liste
      </Link>
      <PageHeader title="Détails" />
      {renderContent()}
    </>
  );
}
export default ExploreKnowledgeDetailPage;

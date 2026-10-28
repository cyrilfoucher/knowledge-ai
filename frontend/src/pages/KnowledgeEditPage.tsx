import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../layouts/PageHeader";
import { useState, useEffect } from "react";
import api from "../api/axios";
import Alert from "../components/ui/Alert";
import type { Knowledge } from "../types/knowledge";
import Card from "../components/ui/Card";
import type { KnowledgePayload } from "../types/knowledge";
import KnowledgeForm from "../components/knowledge/KnowledgeForm";
import { toast } from "sonner";
import BackButton from "../components/ui/BackButton";

function KnowledgeEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null);
  useEffect(() => {
    async function callKnowledge() {
      try {
        const response = await api.get<{ knowledge: Knowledge }>(`/knowledges/${id}`);
        setKnowledge(response.data.knowledge);
      } catch {
        setError("Impossible de charger cette fiche");
      } finally {
        setLoading(false);
      }
    }
    callKnowledge();
  }, [id]);
  async function handleUpdate(data: KnowledgePayload) {
    await api.patch(`/knowledges/${id}`, data);
    toast.success("Fiche modifiée");
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(`/knowledge/${id}`, { replace: true });
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
        <KnowledgeForm
          defaultValues={{
            title: knowledge.title,
            content: knowledge.content,
            visibility: knowledge.visibility,
            categoryId: knowledge.category?.id ?? "",
            tags: knowledge.tags.map((tag) => tag.name).join(", "),
          }}
          submitLabel="Enregistrer"
          onSubmit={handleUpdate}
        />
      </Card>
    );
  }
  return (
    <>
      <BackButton fallback={`/knowledge/${id}`} />
      <PageHeader title="Modifier la fiche" />
      {renderContent()}
    </>
  );
}
export default KnowledgeEdit;

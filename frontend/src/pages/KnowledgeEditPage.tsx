import { useParams, Link, useNavigate } from "react-router-dom";
import PageHeader from "../layouts/PageHeader";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api/axios";
import Alert from "../components/ui/Alert";
import type { Knowledge } from "../types/knowledge";
import type { KnowledgeFormData } from "../schemas/knowledgeSchema";
import Card from "../components/ui/Card";
import KnowledgeForm from "../components/knowledge/KnowledgeForm";
import { toast } from "sonner";

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
  async function handleUpdate(data: KnowledgeFormData) {
    await api.patch(`/knowledges/${id}`, data);
    toast.success("Fiche modifiée");
    navigate(`/knowledge/${id}`);
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
          }}
          submitLabel="Enregistrer"
          onSubmit={handleUpdate}
        />
      </Card>
    );
  }
  return (
    <>
      <Link
        to={`/knowledge/${id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-text"
      >
        <ArrowLeft size={16} />
        Retour à la fiche de connaissance
      </Link>
      <PageHeader title="Modifier la fiche" />
      {renderContent()}
    </>
  );
}
export default KnowledgeEdit;

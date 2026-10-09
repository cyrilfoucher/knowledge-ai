import PageHeader from "../layouts/PageHeader";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import type { Knowledge } from "../types/knowledge";
import { ArrowLeft } from "lucide-react";

function KnowledgeDetailPage() {
  const { id } = useParams();
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

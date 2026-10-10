import PageHeader from "../layouts/PageHeader";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { KnowledgeFormData } from "../schemas/knowledgeSchema";
import Card from "../components/ui/Card";
import api from "../api/axios";
import KnowledgeForm from "../components/knowledge/KnowledgeForm";

function CreateKnowledge() {
  const navigate = useNavigate();
  async function handleCreate(data: KnowledgeFormData) {
    await api.post("/knowledges", data);
    navigate("/knowledge");
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
      <PageHeader
        title="Nouvelle fiche de connaissance"
        subtitle="Enrichis ta base de connaissances"
      />
      <Card>
        <KnowledgeForm
          defaultValues={{ title: "", content: "", visibility: "PRIVATE" }}
          submitLabel="Créer la fiche"
          onSubmit={handleCreate}
        />
      </Card>
    </>
  );
}
export default CreateKnowledge;

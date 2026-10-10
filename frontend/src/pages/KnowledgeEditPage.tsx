import { useParams, Link } from "react-router-dom";
import PageHeader from "../layouts/PageHeader";
import { ArrowLeft } from "lucide-react";

function KnowledgeEdit() {
  const { id } = useParams();
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
    </>
  );
}
export default KnowledgeEdit;

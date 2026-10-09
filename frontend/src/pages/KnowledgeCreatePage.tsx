import PageHeader from "../layouts/PageHeader";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function CreateKnowledge() {
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
    </>
  );
}
export default CreateKnowledge;

import PageHeader from "../layouts/PageHeader";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KnowledgeFormSchema, type KnowledgeFormData } from "../schemas/knowledgeSchema";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Textarea from "../components/ui/Textarea";
import api from "../api/axios";
import Alert from "../components/ui/Alert";
import { isAxiosError } from "axios";

function CreateKnowledge() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<KnowledgeFormData>({
    resolver: zodResolver(KnowledgeFormSchema),
    defaultValues: { title: "", content: "", visibility: "PRIVATE" },
  });
  const navigate = useNavigate();
  async function onSubmit(data: KnowledgeFormData) {
    try {
      await api.post("/knowledges", data);
      navigate("/knowledge");
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de créer la fiche. Réessaie plus tard.";
      setError("root", { message });
    }
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Titre"
            id="title"
            placeholder="Ex : Git, annuler le dernier commit"
            error={errors.title?.message}
            {...register("title")}
          />
          <Textarea
            label="Contenu"
            id="content"
            placeholder="Saisis ton texte"
            error={errors.content?.message}
            {...register("content")}
            rows={10}
          />
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">Visibilité</legend>
            <label className="flex items-center gap-2 m-2">
              <input
                type="radio"
                value="PRIVATE"
                {...register("visibility")}
                className="accent-primary"
              />
              <span>
                Privée <span className="text-muted">(Visible par toi seulement)</span>
              </span>
            </label>
            <label className="flex items-center gap-2 m-2">
              <input
                type="radio"
                value="PUBLIC"
                {...register("visibility")}
                className="accent-primary"
              />
              <span>
                Publique <span className="text-muted">(Visible par tous)</span>
              </span>
            </label>
          </fieldset>
          {errors.root && <Alert variant="danger">{errors.root.message} </Alert>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : "Créer la fiche"}
          </Button>
        </form>
      </Card>
    </>
  );
}
export default CreateKnowledge;

import { KnowledgeFormSchema, type KnowledgeFormData } from "../../schemas/knowledgeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Alert from "../ui/Alert";
import { isAxiosError } from "axios";

interface KnowledgeFormProps {
  defaultValues: KnowledgeFormData;
  submitLabel: string;
  onSubmit: (data: KnowledgeFormData) => Promise<void>;
}

function KnowledgeForm({ defaultValues, submitLabel, onSubmit }: KnowledgeFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<KnowledgeFormData>({
    resolver: zodResolver(KnowledgeFormSchema),
    defaultValues: defaultValues,
  });
  async function submit(data: KnowledgeFormData) {
    try {
      await onSubmit(data);
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "L'enregistrement a échoué. Réessaie plus tard.";
      setError("root", { message });
    }
  }
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
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
      {errors.root && <Alert variant="danger">{errors.root.message}</Alert>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours..." : submitLabel}
      </Button>
    </form>
  );
}

export default KnowledgeForm;

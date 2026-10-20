import { useEffect, useState } from "react";
import { KnowledgeFormSchema, type KnowledgeFormData } from "../../schemas/knowledgeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import api from "../../api/axios";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Alert from "../ui/Alert";
import type { Category, KnowledgePayload } from "../../types/knowledge";

interface KnowledgeFormProps {
  defaultValues: KnowledgeFormData;
  submitLabel: string;
  onSubmit: (data: KnowledgePayload) => Promise<void>;
}

function KnowledgeForm({ defaultValues, submitLabel, onSubmit }: KnowledgeFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<KnowledgeFormData>({
    resolver: zodResolver(KnowledgeFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get<{ categories: Category[] }>("/categories");
        setCategories(response.data.categories);
      } catch {
        setCategories([]);
      }
    }
    loadCategories();
  }, []);
  useEffect(() => {
    if (categories.length > 0) {
      setValue("categoryId", defaultValues.categoryId);
    }
  }, [categories, defaultValues.categoryId, setValue]);

  async function submit(data: KnowledgeFormData) {
    const payload: KnowledgePayload = {
      ...data,
      categoryId: data.categoryId || null,
      tags: data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    };
    try {
      await onSubmit(payload);
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
      <div>
        <label htmlFor="categoryId" className="mb-1.5 block text-sm font-medium">
          Catégorie
        </label>
        <select
          id="categoryId"
          {...register("categoryId")}
          className="w-full rounded-lg border border-current/20 bg-transparent px-3 py-2"
        >
          <option value="">Aucune catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Tags"
        id="tags"
        placeholder="Ex : docker, prisma, jwt (séparés par des virgules)"
        error={errors.tags?.message}
        {...register("tags")}
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

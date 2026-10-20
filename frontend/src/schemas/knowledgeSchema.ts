import { z } from "zod";

// Règles à garder identiques à backend/src/schemas/knowledgeSchema.ts sauf categoryId et tags, convertis avant l'envoi.

export const KnowledgeFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Le titre doit comporter au minimum 3 caractères")
    .max(150, "Le titre ne doit pas dépasser 150 caractères"),
  content: z.string().trim().min(10, "Le contenu doit avoir au moins 10 caractères"),
  visibility: z.enum(["PRIVATE", "PUBLIC"]),
  categoryId: z.string(),
  tags: z.string().max(400, "La limite de caractères de tags est atteinte"),
});
export type KnowledgeFormData = z.infer<typeof KnowledgeFormSchema>;

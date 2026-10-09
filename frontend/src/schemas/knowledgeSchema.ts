import { z } from "zod";

// Règles à garder identiques à backend/src/schemas/knowledgeSchema.ts

export const KnowledgeFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Le titre doit comporter au minimum 3 caractères")
    .max(150, "Le titre ne doit pas dépasser 150 caractères"),
  content: z.string().trim().min(10, "Le contenu doit avoir au moins 10 caractères"),
  visibility: z.enum(["PRIVATE", "PUBLIC"]),
});
export type KnowledgeFormData = z.infer<typeof KnowledgeFormSchema>;

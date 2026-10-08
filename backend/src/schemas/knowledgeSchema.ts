import { z } from "zod";

export const CreateKnowledgeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Le titre doit comporter au minimum 3 caractères")
    .max(150, "Le titre ne doit pas dépasser 150 caractères"),
  content: z
    .string()
    .trim()
    .min(10, "Le contenu doit avoir au moins 10 caractères"),
  visibility: z.enum(["PRIVATE", "PUBLIC"]).optional(),
});
export type CreateKnowledgeInput = z.infer<typeof CreateKnowledgeSchema>;

export const UpdateKnowledgeSchema = CreateKnowledgeSchema.partial();
export type UpdateKnowledgeInput = z.infer<typeof UpdateKnowledgeSchema>;

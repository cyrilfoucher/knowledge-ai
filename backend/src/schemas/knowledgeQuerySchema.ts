import { z } from "zod";
import { PaginationQuerySchema } from "./paginationSchema.js";

export const KnowledgeQuerySchema = PaginationQuerySchema.extend({
  q: z
    .string()
    .trim()
    .max(100, "Un maximum de 100 caractères est autorisé")
    .optional(),
  category: z.uuid().optional(),
  tag: z
    .string()
    .trim()
    .toLowerCase()
    .max(20, "Maximum 20 caractères")
    .optional(),
  sort: z.enum(["recent", "oldest", "title", "popular"]).default("recent"),
});
export type KnowledgeQueryInput = z.infer<typeof KnowledgeQuerySchema>;

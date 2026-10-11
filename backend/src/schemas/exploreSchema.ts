import { z } from "zod";

export const ExploreQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
export type ExploreQueryInput = z.infer<typeof ExploreQuerySchema>;

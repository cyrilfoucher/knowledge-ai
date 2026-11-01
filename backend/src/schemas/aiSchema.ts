import { z } from "zod";

export const aiTagsSchema = z.object({
  tags: z.array(z.string().trim().toLowerCase().min(1).max(20)),
});

import { z } from "zod";

export const aiTagsSchema = z.object({
  tags: z.array(z.string().trim().toLowerCase().min(1).max(20)),
});

export const aiAnswerSchema = z.object({
  answer: z.string().min(1),
  sources: z.array(z.number().int().positive()),
});

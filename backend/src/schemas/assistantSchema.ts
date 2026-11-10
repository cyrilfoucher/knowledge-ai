import { z } from "zod";

export const AskAssistantSchema = z.object({
  question: z.string().trim().min(5).max(500),
});

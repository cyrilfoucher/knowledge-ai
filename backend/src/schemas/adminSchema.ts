import { z } from "zod";

export const ModerationSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, "Un minimum de 10 caractères est requis.")
    .max(500, "Un maximum de 500 caractères est autorisé."),
});
export type ModerationInput = z.infer<typeof ModerationSchema>;

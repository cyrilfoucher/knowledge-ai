import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().trim().pipe(z.email("Adresse email invalide")),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

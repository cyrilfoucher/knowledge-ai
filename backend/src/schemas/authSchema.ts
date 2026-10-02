import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().pipe(z.email("Adresse email invalide")),
  password: z
    .string()
    .min(10, "Le mot de passe doit contenir un minimum de 10 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
    .regex(/[-+$%=]/, "Le mot de passe doit contenir un symbole (-+$%=)")
    .regex(/^\S+$/, "Le mot de passe ne doit pas contenir d'espace")
    .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre"),
  name: z
    .string("Le nom est obligatoire")
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .toUpperCase(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

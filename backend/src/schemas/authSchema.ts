import { z } from "zod";

export const RegisterSchema = z.object({
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

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().trim().pipe(z.email("Adresse email invalide")),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const UpdateProfileSchema = RegisterSchema.pick({
  email: true,
  name: true,
}).partial();

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Le mot de passe est obligatoire"),
  newPassword: RegisterSchema.shape.password,
});
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;

export const ForgotPasswordSchema = z.object({
  email: RegisterSchema.shape.email,
});
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Le token est obligatoire"),
  newPassword: RegisterSchema.shape.password,
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

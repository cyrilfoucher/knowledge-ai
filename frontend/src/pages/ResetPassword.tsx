import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema, type ResetPasswordInput } from "../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api/axios";
import { isAxiosError } from "axios";
import AuthCard from "../components/auth/AuthCard";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isReset, setIsReset] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(ResetPasswordSchema) });
  async function onSubmit(data: ResetPasswordInput) {
    try {
      await api.post("/auth/reset-password", { token, newPassword: data.newPassword });
      setIsReset(true);
    } catch (error) {
      const resultat = isAxiosError(error)
        ? error.response?.data?.message
        : "Une erreur est survenue";
      setError("root", { message: resultat });
    }
  }
  if (!token) {
    return (
      <AuthCard title="Lien invalide">
        <Alert variant="danger">Ce lien est invalide ou incomplet</Alert>
        <p className="mt-6 text-center text-sm">
          <Link to="/forgot-password" className="text-link hover:underline">
            Réinitialise ton mot de passe
          </Link>
        </p>
      </AuthCard>
    );
  }
  return (
    <AuthCard title={isReset ? "Mot de passe modifié" : "Nouveau mot de passe"}>
      {isReset ? (
        <>
          <Alert variant="success">Ton mot de passe a bien été réinitialisé !</Alert>
          <p className="mt-5 text-center text-sm">
            <Link to="/login" className="text-link hover:underline">
              Se connecter
            </Link>
          </p>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="newPassword"
            label="Nouveau mot de passe"
            type="password"
            placeholder="Rentre ton nouveau mot de passe"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Input
            id="confirmPassword"
            label="Confirme le mot de passe"
            type="password"
            placeholder="Confirme ton nouveau mot de passe"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          {errors.root && <Alert>{errors.root.message}</Alert>}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            Envoyer
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
export default ResetPassword;

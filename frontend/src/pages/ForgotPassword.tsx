import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ForgotPasswordSchema, type ForgotPasswordInput } from "../schemas/authSchema";
import api from "../api/axios";
import AuthCard from "../components/auth/AuthCard";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function ForgotPassword() {
  const [isSent, setIsSent] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(ForgotPasswordSchema) });
  async function onSubmit(data: ForgotPasswordInput) {
    try {
      await api.post("/auth/forgot-password", data);
      setIsSent(true);
    } catch {
      const message = "Envoi impossible pour le moment,veuillez réessayer plus tard";
      setError("root", { message });
    }
  }
  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Indique ton Email pour réinitialiser ton mot de passe"
    >
      {isSent ? (
        <Alert variant="success">
          Si cet email est associé à un compte, un lien vient d'être envoyé. Pense à vérifier tes
          spams.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="ton@email.fr"
            error={errors.email?.message}
            {...register("email")}
          />
          {errors.root && <Alert>{errors.root.message}</Alert>}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            Envoyer le lien
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="text-link hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </AuthCard>
  );
}
export default ForgotPassword;

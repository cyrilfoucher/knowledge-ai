import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { RegisterSchema, type RegisterInput } from "../schemas/authSchema";
import { useAuth } from "../hooks/useAuth";
import AuthCard from "../components/auth/AuthCard";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const user = await signUp(data.name, data.email, data.password);
      navigate(user.role === "ADMIN" ? "/admin" : "/knowledge");
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Inscription impossible pour le moment. Réessaie plus tard.";
      setError("root", { message });
    }
  };

  return (
    <AuthCard title="Créer un compte" subtitle="Commence à construire ta base de connaissances.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Nom"
          type="text"
          placeholder="Ton prénom"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="ton@email.fr"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="password"
          label="Mot de passe"
          type="password"
          placeholder="10 caractères minimum"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          id="confirmPassword"
          label="Confirmer le mot de passe"
          type="password"
          placeholder="Retape ton mot de passe"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {errors.root && <Alert>{errors.root.message}</Alert>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          Créer mon compte
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Déjà un compte ?{" "}
        <Link to="/login" className="text-link hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthCard>
  );
}

export default Register;

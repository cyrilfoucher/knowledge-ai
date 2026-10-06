import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { LoginSchema, type LoginInput } from "../schemas/authSchema";
import { useAuth } from "../hooks/useAuth";
import AuthCard from "../components/auth/AuthCard";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Connexion impossible pour le moment. Réessaie plus tard.";
      setError("root", { message });
    }
  };

  return (
    <AuthCard title="Connexion" subtitle="Retrouve tes connaissances techniques.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          placeholder="Ton mot de passe"
          error={errors.password?.message}
          {...register("password")}
        />

        <Link to="/forgot-password" className="-mt-2 self-end text-sm text-link hover:underline">
          Mot de passe oublié ?
        </Link>

        {errors.root && <Alert>{errors.root.message}</Alert>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          Se connecter
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link to="/register" className="text-link hover:underline">
          Créer un compte
        </Link>
      </p>
    </AuthCard>
  );
}

export default Login;

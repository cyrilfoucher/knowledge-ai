import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { LoginSchema, type LoginInput } from "../schemas/authSchema";
import { useAuth } from "../hooks/useAuth";
import PageHeader from "../layouts/PageHeader";
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
    <>
      <PageHeader title="Connexion" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <Input
            id="email"
            label="email"
            type="email"
            placeholder="ton@email.fr"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div>
          <Input
            id="password"
            label="Mot de passe"
            type="password"
            placeholder="mot de passe"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        {errors.root && <p>{errors.root.message}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          Se connecter
        </Button>
      </form>
    </>
  );
}

export default Login;

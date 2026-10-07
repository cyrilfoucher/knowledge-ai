import { useState } from "react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import api from "../../api/axios";
import { UpdatePasswordSchema, type UpdatePasswordInput } from "../../schemas/authSchema";

function PasswordForm() {
  const [isSaved, setIsSaved] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdatePasswordInput>({ resolver: zodResolver(UpdatePasswordSchema) });
  async function onSubmit(data: UpdatePasswordInput) {
    try {
      await api.patch("/auth/me/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setIsSaved(true);
      reset();
    } catch (error) {
      const resultat = isAxiosError(error)
        ? error.response?.data?.message
        : "Une erreur est survenue";
      setError("root", { message: resultat });
    }
  }
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold">Mot de passe </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="currentPassword"
          type="password"
          label="Mot de passe actuel"
          placeholder="******"
          error={errors?.currentPassword?.message}
          {...register("currentPassword")}
        />
        <Input
          id="newPassword"
          type="password"
          label="Nouveau mot de passe"
          placeholder="******"
          error={errors?.newPassword?.message}
          {...register("newPassword")}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirmer le nouveau mot de passe"
          placeholder="******"
          error={errors?.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        {isSaved && <Alert variant="success">Mot de passe modifié</Alert>}
        {errors.root && <Alert variant="danger">{errors.root.message}</Alert>}
        <Button type="submit" disabled={isSubmitting} className="self-start">
          Changer le mot de passe
        </Button>
      </form>
    </Card>
  );
}

export default PasswordForm;

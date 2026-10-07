import { useState } from "react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useAuth } from "../../hooks/useAuth";
import { UpdateProfileSchema, type UpdateProfileInput } from "../../schemas/authSchema";

function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: { name: user?.name, email: user?.email },
  });
  async function onSubmit(data: UpdateProfileInput) {
    try {
      await updateProfile(data.name, data.email);
      setIsSaved(true);
    } catch (error) {
      const resultat = isAxiosError(error)
        ? error.response?.data?.message
        : "Une erreur est survenue";
      setError("root", { message: resultat });
    }
  }
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold">Mon profil</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Nom"
          type="text"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        {isSaved && <Alert variant="success">Profil mis à jour !</Alert>}
        {errors.root && <Alert variant="danger">{errors.root.message}</Alert>}
        <Button type="submit" disabled={isSubmitting} className="self-start">
          Enregistrer
        </Button>
      </form>
    </Card>
  );
}

export default ProfileForm;

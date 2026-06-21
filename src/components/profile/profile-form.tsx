import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User } from "lucide-react";
import { useUpdateProfile, UserProfile } from "@/hooks/hooks";
import { useQueryClient } from "@tanstack/react-query";

const profileSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),
  email: z.string().email("Digite um e-mail válido."),
  course: z
    .string()
    .max(100, "O curso deve ter no máximo 100 caracteres.")
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user?: UserProfile;
  onCancel: () => void;
}

export function ProfileForm({ user, onCancel }: ProfileFormProps) {
  const queryClient = useQueryClient();
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        course: user.course || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Perfil atualizado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        onCancel();
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ error: string }>;
        setError("root", {
          message: axiosError.response?.data?.error || "Ocorreu um erro ao atualizar o perfil."
        });
      }
    });
  };

  return (
    <>
      <div className="flex justify-between items-end mb-8 -mt-12 sm:-mt-16">
        <div className="h-24 w-24 sm:h-32 sm:w-32 bg-white rounded-full p-1.5 shadow-lg relative z-10">
          <div className="h-full w-full bg-[#0F172A] rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-10 w-10" />}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            placeholder="Ex: João da Silva"
            className={`rounded-lg h-12 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            disabled={updateProfileMutation.isPending}
            maxLength={100}
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-xs">{errors.name.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ex: joao@exemplo.com"
            className={`rounded-lg h-12 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            disabled={updateProfileMutation.isPending}
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="course">Curso (Opcional)</Label>
          <Input
            id="course"
            placeholder="Ex: Engenharia de Software"
            className={`rounded-lg h-12 ${errors.course ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            disabled={updateProfileMutation.isPending}
            maxLength={100}
            {...register("course")}
          />
          {errors.course && (
            <span className="text-red-500 text-xs">{errors.course.message}</span>
          )}
        </div>

        {errors.root && (
          <div className="text-red-500 text-sm font-medium p-3 bg-red-50 rounded-md">
            {errors.root.message}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-12 px-6 rounded-lg cursor-pointer"
            disabled={updateProfileMutation.isPending}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            className="h-12 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
            disabled={updateProfileMutation.isPending || !isDirty}
          >
            {updateProfileMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
              </span>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}

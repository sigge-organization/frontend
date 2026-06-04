"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useUserProfile, useUpdateProfile } from "@/hooks/hooks";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  username: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Digite um e-mail válido."),
  course: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: user, isLoading: isFetching } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Preencher os dados do formulário quando o perfil for carregado
  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
      setValue("course", user.course || "");
    }
  }, [user, setValue]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Perfil atualizado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ error: string }>;
        setError("root", {
          message: axiosError.response?.data?.error || "Ocorreu um erro ao atualizar o perfil."
        });
      }
    });
  };

  if (isFetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Seu Perfil</h1>
        <p className="text-gray-500">
          Atualize suas informações pessoais e dados da conta.
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Nome Completo</Label>
            <Input
              id="username"
              placeholder="Ex: João da Silva"
              className={`rounded-lg h-12 ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              disabled={updateProfileMutation.isPending}
              {...register("username")}
            />
            {errors.username && (
              <span className="text-red-500 text-xs">{errors.username.message}</span>
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

          <div className="flex justify-end pt-4">
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
      </Card>
    </div>
  );
}

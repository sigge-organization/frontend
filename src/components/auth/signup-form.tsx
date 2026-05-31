"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SignupFormProps {
  onToggleMode: () => void;
}

const signupSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().min(1, "O e-mail é obrigatório.").email("Digite um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  passwordRepeat: z.string().min(1, "A confirmação de senha é obrigatória."),
}).refine((data) => data.password === data.passwordRepeat, {
  message: "As senhas não coincidem.",
  path: ["passwordRepeat"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm({ onToggleMode }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const registerMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await api.post("/api/auth/register", {
        username: data.name,
        email: data.email,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: () => {
      reset();
      onToggleMode();
    }
  });

  const onSubmit = (data: SignupFormData) => {
    toast.promise(registerMutation.mutateAsync(data), {
      loading: "Cadastrando...",
      success: "Conta criada com sucesso! Você já pode fazer login.",
      error: (error: AxiosError<{ error: string }>) => 
        error.response?.data?.error || "Ocorreu um erro inesperado."
    });
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Cadastro</h1>
        <p className="text-gray-500 text-sm flex items-center gap-2">
          Seja Bem Vindo!
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <Label htmlFor="name-signup">Digite seu Nome</Label>
          <Input
            id="name-signup"
            type="text"
            className={`rounded-lg h-11 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            disabled={registerMutation.isPending}
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-xs">{errors.name.message}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email-signup">Digite seu E-mail</Label>
          <Input
            id="email-signup"
            type="email"
            className={`rounded-lg h-11 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            disabled={registerMutation.isPending}
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password-signup">Digite sua Senha</Label>
          <Input
            id="password-signup"
            type="password"
            className={`rounded-lg h-11 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            disabled={registerMutation.isPending}
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password.message}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password-repeat">Repita sua Senha</Label>
          <Input
            id="password-repeat"
            type="password"
            className={`rounded-lg h-11 ${errors.passwordRepeat ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            disabled={registerMutation.isPending}
            {...register("passwordRepeat")}
          />
          {errors.passwordRepeat && (
            <span className="text-red-500 text-xs">{errors.passwordRepeat.message}</span>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg rounded-lg bg-[#0F172A] hover:bg-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed mt-4"
          disabled={registerMutation.isPending}
        >
          Cadastrar
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Já possui conta?{" "}
        <button 
          onClick={onToggleMode}
          type="button"
          className="font-bold text-black hover:text-slate-600 hover:underline transition-colors cursor-pointer"
        >
          Fazer Login
        </button>
      </div>
    </>
  );
}

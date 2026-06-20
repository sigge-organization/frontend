"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface LoginFormProps {
  onToggleMode: () => void;
}

const loginSchema = z.object({
  email: z.string().min(1, "O e-mail é obrigatório.").email("Digite um e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post("/users/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      Cookies.set("sigee.token", data.token, { expires: 1 });
      toast.success("Login efetuado com sucesso!");
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      setError("root", {
        message: error.response?.data?.error || "Ocorreu um erro ao fazer login."
      });
    }
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Login</h1>
        <p className="text-gray-500 text-sm flex items-center gap-2">
          Bem vindo de volta 👋
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email-login">Digite seu E-mail</Label>
          <Input
            id="email-login"
            type="email"
            className={`rounded-lg h-12 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            disabled={loginMutation.isPending}
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-login">Digite sua Senha</Label>
          <PasswordInput
            id="password-login"
            className={`rounded-lg h-12 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            disabled={loginMutation.isPending}
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password.message}</span>
          )}
        </div>

        {errors.root && (
          <div className="text-red-500 text-sm font-medium text-center">
            {errors.root.message}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 text-lg rounded-lg bg-[#0F172A] hover:bg-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed mt-4"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Não possui conta?{" "}
        <button 
          onClick={onToggleMode}
          type="button"
          className="font-bold text-black hover:text-slate-600 hover:underline transition-colors cursor-pointer"
        >
          Criar Conta
        </button>
      </div>
    </>
  );
}

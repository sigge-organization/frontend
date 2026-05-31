"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/api/auth/login", {
        email,
        password,
      });
      return data;
    },
    onSuccess: (data) => {
      Cookies.set("sigee.token", data.token, { expires: 1 });
      toast.success("Login efetuado com sucesso!");
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error("Falha no login", {
        description: error.response?.data?.error || "Ocorreu um erro ao fazer login."
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Login</h1>
        <p className="text-gray-500 text-sm flex items-center gap-2">
          Bem vindo de volta 👋
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email-login">Digite seu E-mail</Label>
          <Input
            id="email-login"
            type="email"
            className="rounded-lg h-12"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loginMutation.isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-login">Digite sua Senha</Label>
          <Input
            id="password-login"
            type="password"
            className="rounded-lg h-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loginMutation.isPending}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg rounded-lg bg-[#0F172A] hover:bg-slate-800 mt-4"
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
          className="font-bold text-black hover:underline"
        >
          Criar Conta
        </button>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SignupFormProps {
  onToggleMode: () => void;
}

export function SignupForm({ onToggleMode }: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const registerMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/api/auth/register", {
        username: name,
        email,
        password,
      });
      return data;
    },
    onSuccess: () => {
      // Limpa os campos
      setName("");
      setEmail("");
      setPassword("");
      setPasswordRepeat("");
      onToggleMode(); // Automatically toggle to login mode
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordRepeat) {
      toast.error("Erro de validação", {
        description: "As senhas não coincidem."
      });
      return;
    }
    
    toast.promise(registerMutation.mutateAsync(), {
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

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="name-signup">Digite seu Nome</Label>
          <Input
            id="name-signup"
            type="text"
            className="rounded-lg h-11"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={registerMutation.isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email-signup">Digite seu E-mail</Label>
          <Input
            id="email-signup"
            type="email"
            className="rounded-lg h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={registerMutation.isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password-signup">Digite sua Senha</Label>
          <Input
            id="password-signup"
            type="password"
            className="rounded-lg h-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={registerMutation.isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password-repeat">Repita sua Senha</Label>
          <Input
            id="password-repeat"
            type="password"
            className="rounded-lg h-11"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            required
            disabled={registerMutation.isPending}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg rounded-lg bg-[#0F172A] hover:bg-slate-800 mt-4"
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
          className="font-bold text-black hover:underline"
        >
          Fazer Login
        </button>
      </div>
    </>
  );
}

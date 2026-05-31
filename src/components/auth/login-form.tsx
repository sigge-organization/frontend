import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Login</h1>
        <p className="text-gray-500 text-sm flex items-center gap-2">
          Bem vindo de volta 👋
        </p>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email-login">Digite seu E-mail</Label>
          <Input
            id="email-login"
            type="email"
            className="rounded-lg h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password-login">Digite sua Senha</Label>
          <Input
            id="password-login"
            type="password"
            className="rounded-lg h-12"
            required
          />
        </div>

        <Button type="submit" className="w-full h-12 text-lg rounded-lg bg-[#0F172A] hover:bg-slate-800 mt-4">
          Entrar
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

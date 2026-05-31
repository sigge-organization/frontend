import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupFormProps {
  onToggleMode: () => void;
}

export function SignupForm({ onToggleMode }: SignupFormProps) {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Cadastro</h1>
        <p className="text-gray-500 text-sm flex items-center gap-2">
          Seja Bem Vindo!
        </p>
      </div>

      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name-signup">Digite seu Nome</Label>
          <Input
            id="name-signup"
            type="text"
            className="rounded-lg h-11"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email-signup">Digite seu E-mail</Label>
          <Input
            id="email-signup"
            type="email"
            className="rounded-lg h-11"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password-signup">Digite sua Senha</Label>
          <Input
            id="password-signup"
            type="password"
            className="rounded-lg h-11"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password-repeat">Repita sua Senha</Label>
          <Input
            id="password-repeat"
            type="password"
            className="rounded-lg h-11"
            required
          />
        </div>

        <Button type="submit" className="w-full h-12 text-lg rounded-lg bg-[#0F172A] hover:bg-slate-800 mt-4">
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

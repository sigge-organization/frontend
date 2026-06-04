import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrength } from "@/components/ui/password-strength";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useVerifyPassword, useChangePassword } from "@/hooks/hooks";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordModal({ isOpen, onClose }: PasswordModalProps) {
  const verifyPasswordMutation = useVerifyPassword();
  const changePasswordMutation = useChangePassword();

  const [step, setStep] = useState<1 | 2>(1);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleClose = () => {
    setStep(1);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Alterar Senha</h2>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Por segurança, precisamos confirmar sua senha atual antes de prosseguir.
              </p>
              <div className="space-y-2">
                <Label>Senha Atual</Label>
                <PasswordInput 
                  value={currentPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCurrentPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Sua senha atual"
                  className="rounded-lg h-12"
                />
              </div>
              {passwordError && <p className="text-destructive text-sm">{passwordError}</p>}
              
              <Button 
                className="w-full mt-4 h-12 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white transition-colors cursor-pointer" 
                disabled={!currentPassword || verifyPasswordMutation.isPending}
                onClick={() => {
                  verifyPasswordMutation.mutate(currentPassword, {
                    onSuccess: (res) => {
                      if (res.valid) {
                        setStep(2);
                        setPasswordError("");
                      } else {
                        setPasswordError("Senha atual incorreta.");
                      }
                    },
                    onError: () => setPasswordError("Erro ao verificar senha.")
                  });
                }}
              >
                {verifyPasswordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verificar e Continuar"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nova Senha</Label>
                <PasswordInput 
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Mínimo 6 caracteres"
                  className="rounded-lg h-12"
                />
                <PasswordStrength password={newPassword} />
              </div>
              <div className="space-y-2">
                <Label>Confirmar Nova Senha</Label>
                <PasswordInput 
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Repita a nova senha"
                  className="rounded-lg h-12"
                />
              </div>
              {passwordError && <p className="text-destructive text-sm">{passwordError}</p>}
              
              <Button 
                className="w-full mt-4 h-12 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white transition-colors cursor-pointer" 
                disabled={!newPassword || !confirmPassword || changePasswordMutation.isPending}
                onClick={() => {
                  if (newPassword.length < 6) {
                    setPasswordError("A nova senha deve ter pelo menos 6 caracteres.");
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    setPasswordError("As senhas não coincidem.");
                    return;
                  }
                  
                  changePasswordMutation.mutate({ currentPassword, newPassword }, {
                    onSuccess: () => {
                      toast.success("Senha alterada com sucesso!");
                      handleClose();
                    },
                    onError: () => setPasswordError("Erro ao alterar senha.")
                  });
                }}
              >
                {changePasswordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Nova Senha"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useJoinStudyGroup } from "@/hooks/useStudyGroups";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface JoinGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinGroupDialog({ open, onOpenChange }: JoinGroupDialogProps) {
  const joinMutation = useJoinStudyGroup();
  const [formData, setFormData] = useState({
    joinCode: "",
    password: "",
  });

  const resetForm = () => {
    setFormData({ joinCode: "", password: "" });
  };

  const handleJoin = async () => {
    if (!formData.joinCode.trim()) {
      toast.error("O código do grupo é obrigatório.");
      return;
    }
    
    if (formData.joinCode.length !== 6) {
      toast.error("O código do grupo deve ter 6 caracteres.");
      return;
    }

    try {
      const dataToSubmit = {
        joinCode: formData.joinCode,
        ...(formData.password.trim() ? { password: formData.password } : {})
      };
      
      await joinMutation.mutateAsync(dataToSubmit);
      toast.success("Você entrou no grupo com sucesso!");
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error((error as { response?: { data?: { error?: string } } }).response?.data?.error || "Erro ao entrar no grupo.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Entrar em um Grupo</DialogTitle>
          <DialogDescription>
            Digite o código de 6 caracteres para entrar em um grupo existente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="joinCode">Código do Grupo *</Label>
            <Input
              id="joinCode"
              value={formData.joinCode}
              onChange={(e) => setFormData({ ...formData, joinCode: e.target.value.toUpperCase() })}
              placeholder="Ex: A1B2C3"
              maxLength={6}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="joinPassword">Senha (se houver)</Label>
            <Input
              id="joinPassword"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Senha do grupo"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancelar
          </Button>
          <Button 
            onClick={handleJoin} 
            disabled={joinMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {joinMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

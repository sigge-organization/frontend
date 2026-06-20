import { useState } from "react";
import { useCreateStudyGroup, GroupModality } from "@/hooks/useStudyGroups";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupDialog({ open, onOpenChange }: CreateGroupDialogProps) {
  const createMutation = useCreateStudyGroup();
  const [formData, setFormData] = useState({
    theme: "",
    university_course: "",
    description: "",
    modality: GroupModality.ONLINE,
    password: "",
  });

  const resetForm = () => {
    setFormData({ theme: "", university_course: "", description: "", modality: GroupModality.ONLINE, password: "" });
  };

  const handleCreate = async () => {
    if (!formData.theme.trim()) {
      toast.error("O tema do grupo é obrigatório.");
      return;
    }
    try {
      const dataToSubmit = {
        theme: formData.theme,
        university_course: formData.university_course,
        description: formData.description,
        modality: formData.modality,
        ...(formData.password.trim() ? { password: formData.password } : {})
      };
      
      await createMutation.mutateAsync(dataToSubmit);
      toast.success("Grupo de estudos criado com sucesso!");
      onOpenChange(false);
      resetForm();
    } catch {
      toast.error("Erro ao criar o grupo.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Grupo de Estudos</DialogTitle>
          <DialogDescription>
            Crie um novo espaço para compartilhar conhecimento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="theme">Tema do Grupo *</Label>
            <Input
              id="theme"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              placeholder="Ex: Padrões de Projeto em TS"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course">Curso (Opcional)</Label>
            <Input
              id="course"
              value={formData.university_course}
              onChange={(e) => setFormData({ ...formData, university_course: e.target.value })}
              placeholder="Ex: Engenharia de Software"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="modality">Modalidade</Label>
            <Select 
              value={formData.modality} 
              onValueChange={(val: GroupModality | null) => {
                if (val) setFormData({ ...formData, modality: val });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a modalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONLINE">Online</SelectItem>
                <SelectItem value="PRESENTIAL">Presencial</SelectItem>
                <SelectItem value="HYBRID">Híbrido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Breve descrição dos objetivos..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha para entrar (Opcional)</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Deixe em branco para grupo público"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancelar
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={createMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Grupo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

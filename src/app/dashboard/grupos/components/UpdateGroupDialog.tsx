import { useState } from "react";
import { useUpdateStudyGroup, StudyGroup, GroupModality } from "@/hooks/useStudyGroups";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UpdateGroupDialogProps {
  group: StudyGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateGroupDialog({ group, open, onOpenChange }: UpdateGroupDialogProps) {
  const updateMutation = useUpdateStudyGroup();
  const [formData, setFormData] = useState({
    theme: "",
    university_course: "",
    description: "",
    modality: GroupModality.ONLINE,
  });

  const [prevGroupId, setPrevGroupId] = useState<string | null>(null);

  const currentGroupId = group?.id || null;
  if (currentGroupId !== prevGroupId) {
    setPrevGroupId(currentGroupId);
    if (group) {
      setFormData({
        theme: group.theme,
        university_course: group.university_course || "",
        description: group.description || "",
        modality: group.modality,
      });
    }
  }

  const handleUpdate = async () => {
    if (!group) return;
    if (!formData.theme.trim()) {
      toast.error("O tema do grupo é obrigatório.");
      return;
    }
    try {
      await updateMutation.mutateAsync({ id: group.id, data: formData });
      toast.success("Grupo de estudos atualizado com sucesso!");
      onOpenChange(false);
    } catch {
      toast.error("Erro ao atualizar o grupo.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Grupo de Estudos</DialogTitle>
          <DialogDescription>
            Atualize as informações do grupo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-theme">Tema do Grupo *</Label>
            <Input
              id="edit-theme"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-course">Curso (Opcional)</Label>
            <Input
              id="edit-course"
              value={formData.university_course}
              onChange={(e) => setFormData({ ...formData, university_course: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-modality">Modalidade</Label>
            <Select 
              value={formData.modality} 
              onValueChange={(val: GroupModality | null) => {
                if (val) setFormData({ ...formData, modality: val });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONLINE">Online</SelectItem>
                <SelectItem value="PRESENTIAL">Presencial</SelectItem>
                <SelectItem value="HYBRID">Híbrido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Descrição</Label>
            <Input
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useArchiveStudyGroup, StudyGroup } from "@/hooks/useStudyGroups";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ArchiveGroupDialogProps {
  group: StudyGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchiveGroupDialog({ group, open, onOpenChange }: ArchiveGroupDialogProps) {
  const archiveMutation = useArchiveStudyGroup();

  const handleArchive = async () => {
    if (!group) return;
    try {
      await archiveMutation.mutateAsync(group.id);
      toast.success("Grupo arquivado com sucesso!");
      onOpenChange(false);
    } catch {
      toast.error("Erro ao arquivar o grupo.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Arquivar Grupo</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja arquivar o grupo <strong>{group?.theme}</strong>? Esta ação é irreversível por aqui e ele deixará de aparecer nas listagens.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleArchive} 
            disabled={archiveMutation.isPending}
            className="cursor-pointer"
          >
            {archiveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, arquivar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

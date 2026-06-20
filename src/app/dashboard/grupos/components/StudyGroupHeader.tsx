import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudyGroupHeaderProps {
  onOpenJoin: () => void;
  onOpenCreate: () => void;
}

export function StudyGroupHeader({ onOpenJoin, onOpenCreate }: StudyGroupHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Users className="h-8 w-8 text-blue-600" />
          Grupos de Estudos
        </h1>
        <p className="text-gray-500 mt-1">
          Encontre, participe ou crie grupos para estudar com seus colegas.
        </p>
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button 
          onClick={onOpenJoin}
          variant="outline"
          className="flex-1 sm:flex-none border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer shadow-sm"
        >
          Entrar em um Grupo
        </Button>
        <Button 
          onClick={onOpenCreate}
          className="flex-1 sm:flex-none flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Novo Grupo
        </Button>
      </div>
    </div>
  );
}

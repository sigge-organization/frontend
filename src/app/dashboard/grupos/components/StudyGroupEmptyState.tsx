import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudyGroupEmptyStateProps {
  onOpenJoin: () => void;
  onOpenCreate: () => void;
}

export function StudyGroupEmptyState({ onOpenJoin, onOpenCreate }: StudyGroupEmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-white/50 rounded-xl border border-dashed border-gray-300 backdrop-blur-sm">
      <Users className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-xl font-medium text-gray-900">Nenhum grupo encontrado</h3>
      <p className="text-gray-500 mt-2 max-w-md">Não encontramos nenhum grupo com o tema pesquisado. Que tal criar o seu próprio grupo ou entrar em um existente?</p>
      <div className="flex gap-3 mt-6">
        <Button 
          onClick={onOpenJoin}
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer shadow-sm"
        >
          Entrar em um Grupo
        </Button>
        <Button 
          onClick={onOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm"
        >
          Criar Primeiro Grupo
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useStudyGroups, StudyGroup } from "@/hooks/useStudyGroups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Plus, Loader2, LayoutGrid, List as ListIcon } from "lucide-react";

import { StudyGroupCard } from "./components/StudyGroupCard";
import { CreateGroupDialog } from "./components/CreateGroupDialog";
import { UpdateGroupDialog } from "./components/UpdateGroupDialog";
import { ArchiveGroupDialog } from "./components/ArchiveGroupDialog";

export default function StudyGroupsPage() {
  const { data: groups, isLoading } = useStudyGroups();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);

  const filteredGroups = groups?.filter(group => 
    group.theme.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenUpdate = (group: StudyGroup) => {
    setSelectedGroup(group);
    setIsUpdateOpen(true);
  };

  const handleOpenArchive = (group: StudyGroup) => {
    setSelectedGroup(group);
    setIsArchiveOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Novo Grupo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Buscar grupos por tema..."
            className="pl-10 h-11 bg-white shadow-sm border-gray-200 transition-all focus:ring-2 focus:ring-blue-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-200 p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className={`h-9 w-9 cursor-pointer ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-500"}`}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className={`h-9 w-9 cursor-pointer ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-500"}`}
            onClick={() => setViewMode("list")}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
          {filteredGroups?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-white/50 rounded-xl border border-dashed border-gray-300 backdrop-blur-sm">
              <Users className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900">Nenhum grupo encontrado</h3>
              <p className="text-gray-500 mt-2 max-w-md">Não encontramos nenhum grupo com o tema pesquisado. Que tal criar o seu próprio grupo?</p>
              <Button 
                onClick={() => setIsCreateOpen(true)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm"
              >
                Criar Primeiro Grupo
              </Button>
            </div>
          ) : (
            filteredGroups?.map((group) => (
              <StudyGroupCard 
                key={group.id} 
                group={group} 
                viewMode={viewMode} 
                onUpdate={handleOpenUpdate}
                onArchive={handleOpenArchive}
              />
            ))
          )}
        </div>
      )}

      <CreateGroupDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      
      <UpdateGroupDialog 
        group={selectedGroup} 
        open={isUpdateOpen} 
        onOpenChange={setIsUpdateOpen} 
      />
      
      <ArchiveGroupDialog 
        group={selectedGroup} 
        open={isArchiveOpen} 
        onOpenChange={setIsArchiveOpen} 
      />
    </div>
  );
}

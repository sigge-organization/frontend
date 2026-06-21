"use client";

import { useState } from "react";
import { useGroupMaterials, useCreateMaterial, useUpdateMaterial, useDeleteMaterial } from "@/hooks/useGroupResources";
import { useUserProfile } from "@/hooks/hooks";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, FileText, Link as LinkIcon, Plus, ExternalLink, Pencil, Trash, MoreVertical } from "lucide-react";
import { format } from "date-fns";

export function MaterialsTab({ groupId }: { groupId: string }) {
  const { data: userProfile } = useUserProfile();
  const { data: materialsData, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGroupMaterials(groupId);
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const deleteMaterial = useDeleteMaterial();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

    if (editingId) {
      updateMaterial.mutate(
        { groupId, materialId: editingId, title, external_url: formattedUrl },
        {
          onSuccess: () => {
            setTitle("");
            setUrl("");
            setEditingId(null);
            setIsCreating(false);
          }
        }
      );
    } else {
      createMaterial.mutate(
        { groupId, title, external_url: formattedUrl },
        {
          onSuccess: () => {
            setTitle("");
            setUrl("");
            setIsCreating(false);
          }
        }
      );
    }
  };

  const handleEdit = (material: NonNullable<typeof materialsData>['pages'][0][0]) => {
    setEditingId(material.id);
    setTitle(material.title);
    setUrl(material.external_url);
    setIsCreating(true);
  };

  const handleDelete = (materialId: string) => {
    if (confirm("Tem certeza que deseja excluir este material?")) {
      deleteMaterial.mutate({ groupId, materialId });
    }
  };

  const allMaterials = materialsData?.pages.flatMap(page => page) || [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-end items-center">
        <Dialog open={isCreating} onOpenChange={(open) => {
          setIsCreating(open);
          if (!open) {
            setEditingId(null);
            setTitle("");
            setUrl("");
          }
        }}>
          <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer")}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar Link
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Material" : "Compartilhar Material"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Altere as informações do material." : "Adicione um link útil para ajudar nos estudos do grupo."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Título do Material</label>
                <input 
                  required type="text" 
                  className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Livro de Cálculo PDF (Drive)"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Link de Acesso (Drive, Youtube, etc)</label>
                <input 
                  required type="text" 
                  className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={url} onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <Button type="submit" disabled={createMaterial.isPending || updateMaterial.isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                {createMaterial.isPending || updateMaterial.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingId ? "Salvar Alterações" : "Salvar Material")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
        ) : allMaterials.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full">
            <div className="bg-blue-50/50 p-5 rounded-full mb-4 border border-blue-100/50">
              <FileText className="h-10 w-10 text-blue-300" />
            </div>
            <p className="text-gray-700 font-semibold text-lg">Nenhum material encontrado</p>
            <p className="text-sm mt-2 text-gray-500 max-w-sm">Este grupo ainda não possui nenhum material compartilhado.</p>
          </div>
        ) : (
          <>
            {allMaterials.map((material) => (
              <div key={material.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0">
                    <LinkIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{material.title}</h4>
                    <p className="text-xs text-gray-500 truncate">
                      Adicionado por {material.uploadedBy?.name || material.uploadedBy?.email} em {format(new Date(material.created_at), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a 
                    href={material.external_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Acessar material"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                  {userProfile?.id === material.uploadedBy?.id && (
                    <Popover>
                      <PopoverTrigger className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="h-5 w-5" />
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-40 p-2">
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => handleEdit(material)} 
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                          >
                            <Pencil className="h-4 w-4" /> Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(material.id)} 
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash className="h-4 w-4" /> Excluir
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            ))}
            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  {isFetchingNextPage ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Carregar mais
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

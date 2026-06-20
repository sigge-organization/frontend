"use client";

import { useState } from "react";
import { useGroupMaterials, useCreateMaterial } from "@/hooks/useGroupResources";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Loader2, FileText, Link as LinkIcon, Plus, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export function MaterialsTab({ groupId }: { groupId: string }) {
  const { data: materials, isLoading } = useGroupMaterials(groupId);
  const createMaterial = useCreateMaterial();
  
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

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
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-end items-center">
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer")}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar Link
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Compartilhar Material</DialogTitle>
              <DialogDescription>
                Adicione um link útil para ajudar nos estudos do grupo.
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
              <Button type="submit" disabled={createMaterial.isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                {createMaterial.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Material"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
        ) : materials?.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center">
            <FileText className="h-10 w-10 text-gray-300 mb-3" />
            <p>Nenhum material compartilhado.</p>
          </div>
        ) : (
          materials?.map((material) => (
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
              <a 
                href={material.external_url} 
                target="_blank" 
                rel="noreferrer"
                className="shrink-0 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Acessar material"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

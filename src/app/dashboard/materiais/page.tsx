"use client";

import { useMyAllMaterials } from "@/hooks/useGroupResources";
import { Loader2, FileText, Link as LinkIcon, ExternalLink, Users } from "lucide-react";
import { format } from "date-fns";

export default function MateriaisPage() {
  const { data: materials, isLoading } = useMyAllMaterials();

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden m-4">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800">Meus Materiais</h2>
        <p className="text-sm text-gray-500 mt-1">Todos os materiais compartilhados nos seus grupos de estudo.</p>
      </div>

      <div className="flex-1 p-5 overflow-y-auto bg-gray-50/30">
        <div className="max-w-4xl mx-auto space-y-4 h-full">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
          ) : !materials || materials.length === 0 ? (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full">
              <div className="bg-blue-50/50 p-5 rounded-full mb-4 border border-blue-100/50">
                <FileText className="h-10 w-10 text-blue-300" />
              </div>
              <p className="text-gray-700 font-semibold text-lg">Nenhum material encontrado</p>
              <p className="text-sm mt-2 text-gray-500 max-w-sm">Os materiais compartilhados nos seus grupos aparecerão aqui.</p>
            </div>
          ) : (
            materials?.map((material) => (
              <div key={material.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-200 transition-all hover:shadow-md">
                <div className="flex items-start gap-4 overflow-hidden w-full sm:w-auto">
                  <div className="bg-blue-50/80 border border-blue-100 p-3 rounded-xl text-blue-600 shrink-0 mt-1 sm:mt-0">
                    <LinkIcon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        <Users className="h-3 w-3" />
                        {material.group.theme}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-lg truncate mb-1">{material.title}</h4>
                    <p className="text-sm text-gray-500">
                      Adicionado por <span className="font-medium text-gray-700">{material.uploadedBy?.name || material.uploadedBy?.email}</span> em {format(new Date(material.created_at), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
                <a 
                  href={material.external_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-medium hover:bg-blue-600 hover:text-white rounded-lg transition-colors border border-blue-100 hover:border-blue-600"
                >
                  <span>Acessar</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

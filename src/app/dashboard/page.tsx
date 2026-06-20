"use client";

import { useUserProfile } from "@/hooks/hooks";
import { useRecentStudyGroups } from "@/hooks/useStudyGroups";
import { Card } from "@/components/ui/card";
import { Loader2, Users, Plus, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JoinGroupDialog } from "./grupos/components/JoinGroupDialog";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DashboardPage() {
  const { data: user, isLoading } = useUserProfile();
  const { data: recentGroups, isLoading: isLoadingRecent } = useRecentStudyGroups();
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            Seja bem vindo{user?.name ? `, ${user.name}` : ""} 
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : " 👋"}
          </h1>
          <p className="text-gray-500">
            Bem-vindo ao painel principal do SIGGE. Escolha uma das opções no menu acima para começar.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsJoinOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Entrar em Grupo
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2 text-gray-700">Seu Perfil</h3>
          <p className="text-sm text-gray-500">Gerencie suas informações e configurações pessoais.</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2 text-gray-700">Próximos Eventos</h3>
          <p className="text-sm text-gray-500">Confira o calendário para não perder nenhuma reunião.</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2 text-gray-700">Meus Grupos</h3>
          <p className="text-sm text-gray-500">Acompanhe as atividades e discussões das suas equipes.</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-2 text-gray-700">Materiais</h3>
          <p className="text-sm text-gray-500">Acesse apostilas, documentos e treinamentos importantes.</p>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Atividades Recentes</h2>
        </div>
        <p className="text-sm text-gray-500 mb-2">Os grupos com movimentações mais recentes</p>
        
        {isLoadingRecent ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : recentGroups && recentGroups.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {recentGroups.map(group => (
              <Card key={group.id} className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow border-l-4 border-l-blue-600">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{group.theme}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    <Users className="h-3 w-3" />
                    <span>{group._count?.members || 0}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                  {group.description || "Nenhuma descrição disponível."}
                </p>
                
                <div className="flex flex-col mt-auto pt-2 border-t border-gray-100 gap-3">
                  {group.latestActivity && (
                    <span className="text-xs text-gray-400">
                      Última atividade: {formatDistanceToNow(new Date(group.latestActivity as number), { addSuffix: true, locale: ptBR })}
                    </span>
                  )}
                  <Link href={`/dashboard/grupos/${group.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                      Acessar Grupo
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-gray-500">Nenhum grupo encontrado com atividades recentes.</p>
          </div>
        )}
      </div>

      <JoinGroupDialog open={isJoinOpen} onOpenChange={setIsJoinOpen} />
    </div>
  );
}

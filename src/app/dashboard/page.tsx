"use client";

import { useUserProfile } from "@/hooks/hooks";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: user, isLoading } = useUserProfile();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          Seja bem vindo{user?.username ? `, ${user.username}` : ""} 
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : " 👋"}
        </h1>
        <p className="text-gray-500">
          Bem-vindo ao painel principal do SIGGE. Escolha uma das opções no menu acima para começar.
        </p>
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
    </div>
  );
}

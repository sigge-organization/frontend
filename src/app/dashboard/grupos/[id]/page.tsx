"use client";

import { useStudyGroup, GroupModality } from "@/hooks/useStudyGroups";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Laptop, Users, GraduationCap, Calendar, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


export default function GroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const { data: group, isLoading, isError } = useStudyGroup(id);

  const getModalityIcon = (modality: GroupModality) => {
    switch (modality) {
      case GroupModality.PRESENTIAL: return <MapPin className="h-5 w-5" />;
      case GroupModality.ONLINE: return <Laptop className="h-5 w-5" />;
      case GroupModality.HYBRID: return <Users className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getModalityLabel = (modality: GroupModality) => {
    switch (modality) {
      case GroupModality.PRESENTIAL: return 'Presencial';
      case GroupModality.ONLINE: return 'Online';
      case GroupModality.HYBRID: return 'Híbrido';
      default: return modality;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !group) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center justify-between">
          <p>Erro ao carregar detalhes do grupo de estudos.</p>
          <Button onClick={() => router.back()} variant="outline">Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header / Nav */}
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" className="gap-2 text-gray-500 hover:text-gray-900" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200/60 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {group.theme}
            </h1>
            
            <div className="space-y-2">
              <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                {group.description && group.description.length > 200 && !isDescriptionExpanded 
                  ? `${group.description.substring(0, 200)}...` 
                  : (group.description || "Nenhuma descrição detalhada foi fornecida para este grupo de estudos ainda.")}
              </p>
              {group.description && group.description.length > 200 && (
                <button 
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-blue-600 font-medium hover:text-blue-800 transition-colors text-sm cursor-pointer"
                >
                  {isDescriptionExpanded ? "Ver menos" : "Ver mais"}
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 shrink-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-medium">
              {getModalityIcon(group.modality)}
              <span>{getModalityLabel(group.modality)}</span>
            </div>
            
            {group.university_course && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-medium">
                <GraduationCap className="h-5 w-5" />
                <span>{group.university_course}</span>
              </div>
            )}
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-700 font-medium border border-gray-100">
              <Calendar className="h-5 w-5" />
              <span>Criado em {new Date(group.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Participants Sidebar */}
        <Card className="md:col-span-1 shadow-sm border-gray-200/60 h-fit">
          <CardHeader className="border-b border-gray-100 pb-4 bg-gray-50/50 rounded-t-xl">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
              <Users className="h-5 w-5 text-blue-500" />
              Participantes ({group.members?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {group.members && group.members.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {group.members.map((member) => (
                  <li key={member.user.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col gap-1">
                    <span className="font-medium text-gray-900 truncate">{member.user.name || "Usuário sem nome"}</span>
                    <span className="text-sm text-gray-500 truncate">{member.user.email}</span>
                    {member.user.course && (
                      <span className="text-xs text-indigo-600 font-medium mt-1 inline-flex w-fit px-2 py-0.5 rounded-full bg-indigo-50">
                        {member.user.course}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>Nenhum participante ainda.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-gray-200/60 h-full min-h-[300px] flex flex-col items-center justify-center bg-gray-50/30">
            <div className="text-center space-y-3 p-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Mural do Grupo</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Em breve você poderá postar mensagens, agendar eventos e compartilhar materiais de estudo aqui.
              </p>
            </div>
          </Card>
        </div>
        
      </div>
    </div>
  );
}

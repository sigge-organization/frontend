"use client";

import { useStudyGroup, GroupModality } from "@/hooks/useStudyGroups";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Laptop, Users, GraduationCap, Calendar, BookOpen, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PostsTab } from "./components/PostsTab";
import { EventsTab } from "./components/EventsTab";
import { MaterialsTab } from "./components/MaterialsTab";

export default function GroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "events" | "materials">("posts");

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

            <Dialog>
              <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 h-10 px-4 py-2 w-full shadow-sm mt-2">
                <Users className="h-4 w-4 text-blue-600" />
                Ver Participantes ({group.members?.length || 0})
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg flex items-center gap-2 text-gray-800">
                    <Users className="h-5 w-5 text-blue-500" />
                    Participantes do Grupo
                  </DialogTitle>
                </DialogHeader>
                {group.members && group.members.length > 0 ? (
                  <ul className="divide-y divide-gray-100 mt-2">
                    {group.members.map((member) => {
                      const initials = (member.user.name || "UN").substring(0, 2).toUpperCase();
                      return (
                      <li key={member.user.id} className="py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-md px-2">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {initials}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-medium text-gray-900 truncate">{member.user.name || "Usuário sem nome"}</span>
                          <span className="text-sm text-gray-500 truncate">{member.user.email}</span>
                          {member.user.course && (
                            <span className="text-[10px] text-indigo-600 font-medium mt-1 inline-flex w-fit px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100">
                              {member.user.course}
                            </span>
                          )}
                        </div>
                      </li>
                    )})}
                  </ul>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>Nenhum participante ainda.</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4 h-[700px] flex flex-col">
        {/* Tabs Header */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200/60 p-1 shrink-0">
          <button 
            onClick={() => setActiveTab("posts")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === "posts" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Mural de Mensagens</span>
          </button>
          <button 
            onClick={() => setActiveTab("events")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === "events" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Eventos</span>
          </button>
          <button 
            onClick={() => setActiveTab("materials")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === "materials" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Materiais</span>
          </button>
        </div>

        {/* Tab Content */}
        <Card className="shadow-sm border-gray-200/60 flex-1 overflow-hidden bg-white flex flex-col">
          {activeTab === "posts" && <PostsTab groupId={id} />}
          {activeTab === "events" && <EventsTab groupId={id} />}
          {activeTab === "materials" && <MaterialsTab groupId={id} />}
        </Card>
      </div>
    </div>
  );
}

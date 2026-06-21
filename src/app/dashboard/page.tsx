"use client";

import { useUserProfile } from "@/hooks/hooks";
import { useRecentStudyGroups, useMyWeeklyEvents, useMyRecentMaterials } from "@/hooks/useStudyGroups";
import { Card } from "@/components/ui/card";
import { Loader2, Users, Plus, Activity, Calendar, Link as LinkIcon, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JoinGroupDialog } from "./grupos/components/JoinGroupDialog";
import Link from "next/link";
import { formatDistanceToNow, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { data: user, isLoading } = useUserProfile();
  const { data: recentGroups, isLoading: isLoadingRecent } = useRecentStudyGroups();
  const { data: weeklyEvents, isLoading: isLoadingEvents } = useMyWeeklyEvents();
  const { data: recentMaterials, isLoading: isLoadingMaterials } = useMyRecentMaterials();
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const startDate = startOfWeek(new Date());
  const endDate = endOfWeek(new Date());
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

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
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-gray-200">
            {recentGroups.map(group => (
              <Card key={group.id} className="min-w-[300px] snap-start p-5 flex flex-col gap-3 hover:shadow-md transition-shadow border-l-4 border-l-blue-600">
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Calendar */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Calendário da Semana</h2>
          </div>
          <p className="text-sm text-gray-500 mb-2">Seus eventos agendados para esta semana em todos os grupos</p>

          <Card className="p-0 overflow-hidden border-gray-200">
            <div className="grid grid-cols-7 border-b border-gray-100 bg-white">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] bg-gray-100 gap-[1px]">
              {calendarDays.map((day, idx) => {
                const dayEvents = weeklyEvents?.filter(e => isSameDay(new Date(e.date_time_event), day)) || [];
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div key={idx} className={cn("bg-white p-2 flex flex-col gap-1.5", isToday && "bg-blue-50/20")}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={cn("text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full", isToday ? "bg-blue-600 text-white" : "text-gray-700")}>
                        {format(day, "d")}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[120px] scrollbar-thin scrollbar-thumb-gray-200">
                      {isLoadingEvents ? (
                         <div className="flex justify-center p-2"><Loader2 className="h-4 w-4 animate-spin text-blue-500" /></div>
                      ) : dayEvents.map(evt => {
                        const isLink = evt.local_or_link_event.startsWith('http');
                        return (
                          <div key={evt.id} className={cn("text-[10px] px-1.5 py-1.5 rounded-[4px] flex flex-col gap-0.5", isLink ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-blue-50 text-blue-700 border border-blue-100")} title={evt.title}>
                            <span className="font-semibold opacity-80">{format(new Date(evt.date_time_event), "HH:mm")} • {evt.group.theme}</span>
                            <span className="truncate font-medium">{evt.title}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Recent Materials */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Conteúdos Recentes</h2>
          </div>
          <p className="text-sm text-gray-500 mb-2">Últimos materiais adicionados nos seus grupos</p>

          {isLoadingMaterials ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : recentMaterials && recentMaterials.length > 0 ? (
            <div className="flex flex-col gap-3">
              {recentMaterials.map(material => (
                <Card key={material.id} className="p-4 flex flex-col gap-2 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{material.title}</h3>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                      {formatDistanceToNow(new Date(material.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md w-fit">
                    Grupo: {material.group.theme}
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Por {material.uploadedBy.name || "Usuário"}</span>
                    <a href={material.external_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                      <LinkIcon className="h-3 w-3" /> Acessar
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500">Nenhum conteúdo recente encontrado.</p>
            </div>
          )}
        </div>
      </div>

      <JoinGroupDialog open={isJoinOpen} onOpenChange={setIsJoinOpen} />
    </div>
  );
}

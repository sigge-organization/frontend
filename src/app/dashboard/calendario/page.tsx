"use client";

import { useState } from "react";
import { useMyAllEvents } from "@/hooks/useGroupResources";
import { Loader2, Calendar, MapPin, Link as LinkIcon, List, CalendarDays, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { format, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function CalendarioPage() {
  const { data: events, isLoading } = useMyAllEvents();
  
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState<{date: Date, events: NonNullable<typeof events>} | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden m-4">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Meu Calendário</h2>
          <p className="text-sm text-gray-500">Acompanhe todos os eventos dos seus grupos de estudo.</p>
        </div>
        {events && events.length > 0 && (
          <div className="flex bg-gray-200/60 p-1 rounded-md">
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-1.5 rounded-sm transition-colors", viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-800")}
              title="Ver em Lista"
            >
              <List className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode("calendar")}
              className={cn("p-1.5 rounded-sm transition-colors", viewMode === "calendar" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-800")}
              title="Ver no Calendário"
            >
              <CalendarDays className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50/30">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
        ) : !events || events.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full">
            <div className="bg-blue-50/50 p-5 rounded-full mb-4 border border-blue-100/50">
              <Calendar className="h-10 w-10 text-blue-300" />
            </div>
            <p className="text-gray-700 font-semibold text-lg">Nenhum evento agendado</p>
            <p className="text-sm mt-2 text-gray-500 max-w-sm">Você não possui compromissos futuros cadastrados em nenhum dos seus grupos de estudo.</p>
          </div>
        ) : (
          <>
            {/* VIEW: CALENDAR */}
            <div className={cn("bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex-col", viewMode === "calendar" ? "flex" : "hidden")}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <h4 className="font-semibold text-gray-800 capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
              </h4>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 hover:bg-gray-200 rounded-md text-gray-600 transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-md transition-colors mx-1">
                  Hoje
                </button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 hover:bg-gray-200 rounded-md text-gray-600 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto pb-2">
              <div className="w-full min-w-[300px] md:min-w-[800px] flex flex-col">
                <div className="grid grid-cols-7 border-b border-gray-100 bg-white">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 auto-rows-[minmax(60px,auto)] md:auto-rows-[minmax(120px,auto)] bg-gray-100 gap-[1px]">
              {calendarDays.map((day, idx) => {
                const dayEvents = events?.filter(e => isSameDay(new Date(e.date_time_event), day)) || [];
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div 
                    key={idx} 
                    onClick={() => {
                      if (dayEvents.length > 0) setSelectedDayEvents({ date: day, events: dayEvents });
                    }}
                    className={cn("bg-white p-1 md:p-2 flex flex-col transition-colors", !isCurrentMonth && "bg-gray-50/50", dayEvents.length > 0 && "cursor-pointer hover:bg-blue-50/30")}
                  >
                    <div className="flex justify-center md:justify-between items-start">
                      <span className={cn("text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full shrink-0", isToday ? "bg-blue-600 text-white" : (isCurrentMonth ? "text-gray-700" : "text-gray-400"))}>
                        {format(day, "d")}
                      </span>
                    </div>

                    {/* MOBILE DOTS */}
                    {dayEvents.length > 0 && (
                      <div className="flex md:hidden flex-wrap justify-center gap-1 mt-1">
                        {dayEvents.slice(0, 3).map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        ))}
                        {dayEvents.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-50" />}
                      </div>
                    )}

                    {/* DESKTOP TEXT */}
                    <div className="hidden md:flex flex-col gap-1 overflow-y-auto max-h-[100px] scrollbar-thin scrollbar-thumb-gray-200 mt-1">
                      {dayEvents.map(evt => {
                        const isLink = evt.local_or_link_event.startsWith('http');
                        return (
                          <div key={evt.id} className={cn("text-[10px] px-1.5 py-1 rounded-[4px] flex flex-col gap-0.5", isLink ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-blue-50 text-blue-700 border border-blue-100")} title={evt.title}>
                            <div className="flex items-center gap-1 truncate font-medium">
                              <span className="opacity-70 shrink-0">{format(new Date(evt.date_time_event), "HH:mm")}</span>
                              <span className="truncate">{evt.title}</span>
                            </div>
                            <span className="text-[8px] uppercase tracking-wider font-bold opacity-70 truncate">{evt.group.theme}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        </div>

        {/* VIEW: LIST */}
        <div className={cn("space-y-4 max-w-4xl mx-auto", viewMode === "list" ? "block" : "hidden")}>
              {events?.map((event) => {
                const isLink = event.local_or_link_event.startsWith('http');
                return (
                  <div key={event.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-start gap-4 hover:border-blue-100 transition-colors">
                    <div className="bg-blue-50 text-blue-700 rounded-xl p-3 text-center min-w-[75px] shrink-0 border border-blue-100">
                      <div className="text-xs font-bold uppercase">{format(new Date(event.date_time_event), "MMM", { locale: ptBR })}</div>
                      <div className="text-2xl font-black">{format(new Date(event.date_time_event), "dd")}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          <Users className="h-3 w-3" />
                          {event.group.theme}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg truncate">{event.title}</h4>
                      <div className="text-sm text-gray-500 mt-1 mb-3">
                        {format(new Date(event.date_time_event), "EEEE, 'às' HH:mm", { locale: ptBR })}
                      </div>
                      {isLink ? (
                        <a href={event.local_or_link_event} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                          <LinkIcon className="h-3 w-3" /> Acessar Link do Encontro
                        </a>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
                          <MapPin className="h-3 w-3" /> {event.local_or_link_event}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Dialog open={!!selectedDayEvents} onOpenChange={(open) => !open && setSelectedDayEvents(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Eventos de {selectedDayEvents?.date && format(selectedDayEvents.date, "dd 'de' MMMM", { locale: ptBR })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2 max-h-[60vh] overflow-y-auto pr-1">
            {selectedDayEvents?.events.map(event => {
              const isLink = event.local_or_link_event.startsWith('http');
              return (
                <div key={event.id} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Users className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{event.group.theme}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  <div className="text-sm text-gray-500 mt-1 mb-3">
                    {format(new Date(event.date_time_event), "HH:mm")}
                  </div>
                  {isLink ? (
                    <a href={event.local_or_link_event} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                      <LinkIcon className="h-3 w-3" /> Acessar Link
                    </a>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
                      <MapPin className="h-3 w-3" /> {event.local_or_link_event}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

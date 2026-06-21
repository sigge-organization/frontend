"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay, isSameMonth, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { GroupEvent } from "@/hooks/useGroupResources";

interface EventCalendarViewProps {
  events: GroupEvent[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDaySelect: (date: Date, events: GroupEvent[]) => void;
}

export function EventCalendarView({ events, currentMonth, onMonthChange, onDaySelect }: EventCalendarViewProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <h4 className="font-semibold text-gray-800 capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h4>
        <div className="flex items-center gap-1">
          <button onClick={() => onMonthChange(subMonths(currentMonth, 1))} className="p-1.5 hover:bg-gray-200 rounded-md text-gray-600 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => onMonthChange(new Date())} className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-md transition-colors mx-1">
            Hoje
          </button>
          <button onClick={() => onMonthChange(addMonths(currentMonth, 1))} className="p-1.5 hover:bg-gray-200 rounded-md text-gray-600 transition-colors">
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
              const dayEvents = events.filter(e => isSameDay(new Date(e.date_time_event), day));
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div 
                  key={idx} 
                  onClick={() => {
                    if (dayEvents.length > 0) onDaySelect(day, dayEvents);
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
                  <div className="hidden md:flex flex-col gap-1 overflow-y-auto max-h-[80px] scrollbar-thin scrollbar-thumb-gray-200 mt-1">
                    {dayEvents.map(evt => {
                      const isLink = evt.local_or_link_event.startsWith('http');
                      return (
                        <div key={evt.id} className={cn("text-[10px] px-1.5 py-1 rounded-[4px] truncate flex items-center gap-1", isLink ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "bg-blue-50 text-blue-700 border border-blue-100")} title={evt.title}>
                          <span className="font-semibold opacity-70 shrink-0">{format(new Date(evt.date_time_event), "HH:mm")}</span>
                          <span className="truncate font-medium">{evt.title}</span>
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
  );
}

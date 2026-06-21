"use client";

import { useState } from "react";
import { useGroupEvents, useDeleteEvent, GroupEvent } from "@/hooks/useGroupResources";
import { useUserProfile } from "@/hooks/hooks";
import { Loader2, Calendar, List, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

import { EventFormDialog } from "./events/EventFormDialog";
import { EventCalendarView } from "./events/EventCalendarView";
import { EventListView } from "./events/EventListView";
import { EventDayModal } from "./events/EventDayModal";

export function EventsTab({ groupId }: { groupId: string }) {
  const { data: userProfile } = useUserProfile();
  const { data: events, isLoading } = useGroupEvents(groupId);
  const deleteEvent = useDeleteEvent();
  
  const [editingEvent, setEditingEvent] = useState<GroupEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState<{date: Date, events: NonNullable<typeof events>} | null>(null);

  const handleEdit = (event: GroupEvent) => {
    setEditingEvent(event);
    setIsCreating(true);
  };

  const handleDelete = (eventId: string) => {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
      deleteEvent.mutate({ groupId, eventId });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-end items-start sm:items-center gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
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
          <EventFormDialog 
            groupId={groupId}
            isOpen={isCreating}
            onOpenChange={(open) => {
              setIsCreating(open);
              if (!open) setEditingEvent(null);
            }}
            editingEvent={editingEvent}
          />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
        ) : !events || events.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full">
            <div className="bg-blue-50/50 p-5 rounded-full mb-4 border border-blue-100/50">
              <Calendar className="h-10 w-10 text-blue-300" />
            </div>
            <p className="text-gray-700 font-semibold text-lg">Nenhum evento agendado</p>
            <p className="text-sm mt-2 text-gray-500 max-w-sm">Este grupo ainda não possui nenhum compromisso agendado.</p>
          </div>
        ) : (
          <>
            <div className={cn(viewMode === "calendar" ? "block" : "hidden")}>
              <EventCalendarView 
                events={events}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
                onDaySelect={(date, evts) => setSelectedDayEvents({ date, events: evts })}
              />
            </div>

            <div className={cn(viewMode === "list" ? "block" : "hidden")}>
              <EventListView 
                events={events}
                userProfile={userProfile}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </>
        )}
      </div>

      <EventDayModal 
        selectedDayEvents={selectedDayEvents}
        onClose={() => setSelectedDayEvents(null)}
        userProfile={userProfile}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

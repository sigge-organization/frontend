"use client";

import { GroupEvent } from "@/hooks/useGroupResources";
import { UserProfile } from "@/hooks/hooks";
import { Pencil, Trash, MoreVertical, Link as LinkIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EventListViewProps {
  events: GroupEvent[];
  userProfile?: UserProfile;
  onEdit: (event: GroupEvent) => void;
  onDelete: (eventId: string) => void;
}

export function EventListView({ events, userProfile, onEdit, onDelete }: EventListViewProps) {
  return (
    <div className="space-y-3">
      {events.map((event) => {
        const isLink = event.local_or_link_event.startsWith('http');
        return (
          <div key={event.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-4">
            <div className="bg-blue-50 text-blue-700 rounded-lg p-3 text-center min-w-[70px]">
              <div className="text-xs font-bold uppercase">{format(new Date(event.date_time_event), "MMM", { locale: ptBR })}</div>
              <div className="text-xl font-black">{format(new Date(event.date_time_event), "dd")}</div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-900">{event.title}</h4>
                {(userProfile?.id === event.createdBy?.id || !event.createdBy?.id) && (
                  <div className="flex items-center gap-1">
                    <Popover>
                      <PopoverTrigger className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-40 p-2">
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => onEdit(event)} 
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                          >
                            <Pencil className="h-4 w-4" /> Editar
                          </button>
                          <button 
                            onClick={() => onDelete(event.id)} 
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash className="h-4 w-4" /> Excluir
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1 mb-2">
                {format(new Date(event.date_time_event), "EEEE, 'às' HH:mm", { locale: ptBR })}
              </div>
              {isLink ? (
                <a href={event.local_or_link_event} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md hover:bg-blue-100 transition-colors">
                  <LinkIcon className="h-3 w-3" /> Acessar Link do Encontro
                </a>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                  <MapPin className="h-3 w-3" /> {event.local_or_link_event}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

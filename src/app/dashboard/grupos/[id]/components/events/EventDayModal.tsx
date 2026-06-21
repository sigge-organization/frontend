"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Pencil, Trash, MoreVertical, Link as LinkIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GroupEvent } from "@/hooks/useGroupResources";
import { UserProfile } from "@/hooks/hooks";

interface EventDayModalProps {
  selectedDayEvents: { date: Date; events: GroupEvent[] } | null;
  onClose: () => void;
  userProfile?: UserProfile;
  onEdit: (event: GroupEvent) => void;
  onDelete: (eventId: string) => void;
}

export function EventDayModal({ selectedDayEvents, onClose, userProfile, onEdit, onDelete }: EventDayModalProps) {
  return (
    <Dialog open={!!selectedDayEvents} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
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
              <div key={event.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3 relative group">
                {(userProfile?.id === event.createdBy?.id || !event.createdBy?.id) && (
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <Popover>
                      <PopoverTrigger className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-40 p-2">
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => { onEdit(event); onClose(); }} 
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                          >
                            <Pencil className="h-4 w-4" /> Editar
                          </button>
                          <button 
                            onClick={() => { onDelete(event.id); onClose(); }} 
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash className="h-4 w-4" /> Excluir
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
                <h4 className="font-semibold text-gray-900 pr-14">{event.title}</h4>
                <div className="text-sm text-gray-500 mt-1 mb-2">
                  {format(new Date(event.date_time_event), "HH:mm")}
                </div>
                {isLink ? (
                  <a href={event.local_or_link_event} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md hover:bg-blue-200 transition-colors">
                    <LinkIcon className="h-3 w-3" /> Acessar Link
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-sm">
                    <MapPin className="h-3 w-3" /> {event.local_or_link_event}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

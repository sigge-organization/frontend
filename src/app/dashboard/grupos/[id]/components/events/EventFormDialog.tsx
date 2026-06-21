"use client";

import { useState, useEffect } from "react";
import { useCreateEvent, useUpdateEvent } from "@/hooks/useGroupResources";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar, Loader2, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { GroupEvent } from "@/hooks/useGroupResources";

interface EventFormDialogProps {
  groupId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingEvent: GroupEvent | null;
}

export function EventFormDialog({ groupId, isOpen, onOpenChange, editingEvent }: EventFormDialogProps) {
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      if (editingEvent) {
        setTitle(editingEvent.title);
        const eventDate = new Date(editingEvent.date_time_event);
        setDate(eventDate);
        setTime(format(eventDate, "HH:mm"));
        setLocation(editingEvent.local_or_link_event);
      } else {
        setTitle("");
        setDate(undefined);
        setTime("");
        setLocation("");
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !location) return;
    
    const [hours, minutes] = time.split(':');
    const finalDate = new Date(date);
    finalDate.setHours(parseInt(hours), parseInt(minutes));

    if (editingEvent) {
      updateEvent.mutate(
        { 
          groupId, 
          eventId: editingEvent.id,
          data: {
            title,
            date_time_event: finalDate.toISOString(),
            local_or_link_event: location
          } 
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          }
        }
      );
    } else {
      createEvent.mutate(
        { 
          groupId, 
          data: {
            title,
            date_time_event: finalDate.toISOString(),
            local_or_link_event: location
          } 
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          }
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer ml-auto sm:ml-0")}>
        <Plus className="h-4 w-4 mr-1" /> Novo Evento
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingEvent ? "Editar Evento" : "Agendar Novo Evento"}</DialogTitle>
          <DialogDescription>
            {editingEvent ? "Atualize as informações do evento." : "Preencha os detalhes do próximo encontro para avisar o grupo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Título do Evento</label>
            <input 
              required type="text" 
              className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Grupo de Estudos de Cálculo"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Data</label>
              <Popover>
                <PopoverTrigger 
                  className={cn(
                    "flex items-center w-full justify-start text-left font-normal border border-gray-200 rounded-md h-9 px-3 hover:bg-gray-50 transition-colors text-sm",
                    !date && "text-gray-500"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : <span>Selecione...</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ptBR}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="[&_[data-selected-single=true]]:!bg-blue-600 [&_[data-selected-single=true]]:!text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Horário</label>
              <input 
                required type="time" 
                className="w-full rounded-md border border-gray-200 px-3 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={time} onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Local ou Link</label>
            <input 
              required type="text" 
              className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Sala 204 ou Link do Meet"
            />
          </div>
          <Button type="submit" disabled={createEvent.isPending || updateEvent.isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
            {createEvent.isPending || updateEvent.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingEvent ? "Salvar Alterações" : "Agendar Evento")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

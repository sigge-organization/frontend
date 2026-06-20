import { StudyGroup, GroupModality } from "@/hooks/useStudyGroups";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, MapPin, Laptop, GraduationCap, Edit2, Archive } from "lucide-react";

interface StudyGroupCardProps {
  group: StudyGroup;
  viewMode: "grid" | "list";
  onUpdate: (group: StudyGroup) => void;
  onArchive: (group: StudyGroup) => void;
}

export function StudyGroupCard({ group, viewMode, onUpdate, onArchive }: StudyGroupCardProps) {
  const getModalityIcon = (modality: GroupModality) => {
    switch (modality) {
      case GroupModality.PRESENTIAL: return <MapPin className="h-4 w-4" />;
      case GroupModality.ONLINE: return <Laptop className="h-4 w-4" />;
      case GroupModality.HYBRID: return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
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

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-gray-200/80 bg-white/80 backdrop-blur-sm overflow-hidden flex p-0 ${viewMode === "grid" ? "flex-col hover:-translate-y-1" : "flex-col md:flex-row items-stretch"}`}>
      <div className={`flex flex-1 min-w-0 ${viewMode === "list" ? "flex-col p-5 justify-center gap-2" : "flex-col"}`}>
        <CardHeader className={`${viewMode === "grid" ? "bg-blue-50/80 border-b border-blue-100/50 p-5 rounded-t-xl" : "p-0 bg-transparent border-none"}`}>
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight break-words">
              {group.theme}
            </CardTitle>
            {viewMode === "grid" && (
              <span className="inline-flex shrink-0 items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/80 text-blue-700 shadow-sm border border-blue-100">
                {getModalityIcon(group.modality)}
                <span className="ml-1.5">{getModalityLabel(group.modality)}</span>
              </span>
            )}
          </div>
          {group.university_course && (
            <CardDescription className="flex items-center gap-1.5 mt-2.5 text-indigo-600/90 font-medium">
              <GraduationCap className="h-4 w-4" />
              {group.university_course}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className={`${viewMode === "grid" ? "pt-5 flex-grow" : "p-0 flex-grow flex flex-col justify-center"}`}>
          <p className={`text-gray-600 text-sm leading-relaxed break-words ${viewMode === "grid" ? "line-clamp-3" : "line-clamp-2"}`}>
            {group.description || "Nenhuma descrição detalhada foi fornecida para este grupo de estudos ainda."}
          </p>
          
          <div className={`inline-flex flex-wrap items-center gap-4 ${viewMode === "grid" ? "mt-5" : "mt-3"}`}>
            {viewMode === "list" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {getModalityIcon(group.modality)}
                <span className="ml-1.5">{getModalityLabel(group.modality)}</span>
              </span>
            )}
            <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50/80 px-2.5 py-1 rounded-md border border-gray-200">
              <Users className="h-4 w-4 text-blue-500" />
              <span><strong className="text-gray-900">{group._count?.members || 0}</strong> estudantes</span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className={`${viewMode === "grid" ? "bg-transparent border-t-0 p-5 pt-0 gap-3 flex flex-col" : "p-5 border-t md:border-t-0 md:border-l border-gray-100/50 flex flex-col justify-center gap-3 w-full md:w-[180px] shrink-0 bg-gray-50/50"}`}>
        <Link href={`/dashboard/grupos/${group.id}`} passHref className="w-full">
          <Button variant="outline" className={`w-full text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 cursor-pointer shadow-sm bg-white font-medium`}>
            Acessar Detalhes
          </Button>
        </Link>
        <div className={`flex gap-2 w-full`}>
          <Button 
            variant="outline" 
            onClick={() => onUpdate(group)}
            className="flex-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-gray-200 cursor-pointer bg-white"
            title="Editar Grupo"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onArchive(group)}
            className="flex-1 text-gray-600 hover:text-red-600 hover:bg-red-50 border-gray-200 cursor-pointer bg-white"
            title="Arquivar Grupo"
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

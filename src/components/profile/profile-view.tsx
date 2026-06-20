import { Button } from "@/components/ui/button";
import { KeyRound, Pencil, Mail, BookOpen, User } from "lucide-react";
import { UserProfile } from "@/hooks/hooks";

interface ProfileViewProps {
  user?: UserProfile;
  onEdit: () => void;
  onOpenPasswordModal: () => void;
}

export function ProfileView({ user, onEdit, onOpenPasswordModal }: ProfileViewProps) {
  return (
    <>
      {/* Avatar Section */}
      <div className="flex justify-between items-end mb-8 -mt-12 sm:-mt-16">
        <div className="h-24 w-24 sm:h-32 sm:w-32 bg-white rounded-full p-1.5 shadow-lg relative z-10">
          <div className="h-full w-full bg-[#0F172A] rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-10 w-10" />}
          </div>
        </div>
        
        <Button 
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 px-4 cursor-pointer flex items-center gap-2 relative z-10"
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline">Editar Perfil</span>
        </Button>
      </div>

      <div className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
        <p className="text-gray-500 flex items-center gap-2">
          <Mail className="h-4 w-4" /> {user?.email}
        </p>
      </div>

      {user?.course && (
        <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Curso</p>
            <p className="font-semibold">{user.course}</p>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-gray-100">
        <Button
          type="button"
          onClick={onOpenPasswordModal}
          className="flex items-center gap-2 h-10 px-4 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white transition-colors cursor-pointer"
        >
          <KeyRound className="h-4 w-4" />
          Alterar Senha
        </Button>
      </div>
      </div>
    </>
  );
}

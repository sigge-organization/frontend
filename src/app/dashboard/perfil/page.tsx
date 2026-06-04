"use client";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useUserProfile } from "@/hooks/hooks";
import { ProfileView } from "@/components/profile/profile-view";
import { ProfileForm } from "@/components/profile/profile-form";
import { PasswordModal } from "@/components/profile/password-modal";

export default function ProfilePage() {
  const { data: user, isLoading: isFetching } = useUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isFetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Seu Perfil</h1>
        <p className="text-gray-500">
          Gerencie suas informações pessoais e dados da conta.
        </p>
      </div>

      <Card className="overflow-hidden p-0 gap-0">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-24 sm:h-32 w-full rounded-t-xl"></div>
        <div className="px-6 md:px-8 pb-8 relative">
          {!isEditing ? (
            <ProfileView 
              user={user} 
              onEdit={() => setIsEditing(true)} 
              onOpenPasswordModal={() => setIsModalOpen(true)} 
            />
          ) : (
            <ProfileForm 
              user={user} 
              onCancel={() => setIsEditing(false)} 
            />
          )}
        </div>
      </Card>

      <PasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

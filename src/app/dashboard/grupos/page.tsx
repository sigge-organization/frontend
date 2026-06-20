"use client";

import { useState } from "react";
import { useStudyGroups, StudyGroup } from "@/hooks/useStudyGroups";
import { Loader2 } from "lucide-react";

import { StudyGroupCard } from "./components/StudyGroupCard";
import { CreateGroupDialog } from "./components/CreateGroupDialog";
import { UpdateGroupDialog } from "./components/UpdateGroupDialog";
import { ArchiveGroupDialog } from "./components/ArchiveGroupDialog";
import { JoinGroupDialog } from "./components/JoinGroupDialog";
import { StudyGroupHeader } from "./components/StudyGroupHeader";
import { StudyGroupFilters } from "./components/StudyGroupFilters";
import { StudyGroupEmptyState } from "./components/StudyGroupEmptyState";

export default function StudyGroupsPage() {
  const { data: groups, isLoading } = useStudyGroups();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modal states
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);

  const filteredGroups = groups?.filter(group => 
    group.theme.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenUpdate = (group: StudyGroup) => {
    setSelectedGroup(group);
    setIsUpdateOpen(true);
  };

  const handleOpenArchive = (group: StudyGroup) => {
    setSelectedGroup(group);
    setIsArchiveOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StudyGroupHeader 
        onOpenJoin={() => setIsJoinOpen(true)} 
        onOpenCreate={() => setIsCreateOpen(true)} 
      />

      <StudyGroupFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
          {filteredGroups?.length === 0 ? (
            <StudyGroupEmptyState 
              onOpenJoin={() => setIsJoinOpen(true)} 
              onOpenCreate={() => setIsCreateOpen(true)} 
            />
          ) : (
            filteredGroups?.map((group) => (
              <StudyGroupCard 
                key={group.id} 
                group={group} 
                viewMode={viewMode} 
                onUpdate={handleOpenUpdate}
                onArchive={handleOpenArchive}
              />
            ))
          )}
        </div>
      )}

      <JoinGroupDialog open={isJoinOpen} onOpenChange={setIsJoinOpen} />
      <CreateGroupDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      
      <UpdateGroupDialog 
        group={selectedGroup} 
        open={isUpdateOpen} 
        onOpenChange={setIsUpdateOpen} 
      />
      
      <ArchiveGroupDialog 
        group={selectedGroup} 
        open={isArchiveOpen} 
        onOpenChange={setIsArchiveOpen} 
      />
    </div>
  );
}

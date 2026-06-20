import { Search, LayoutGrid, List as ListIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StudyGroupFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function StudyGroupFilters({ 
  searchTerm, 
  onSearchChange, 
  viewMode, 
  onViewModeChange 
}: StudyGroupFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Buscar grupos por tema..."
          className="pl-10 h-11 bg-white shadow-sm border-gray-200 transition-all focus:ring-2 focus:ring-blue-100"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-200 p-1">
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="icon"
          className={`h-9 w-9 cursor-pointer ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-500"}`}
          onClick={() => onViewModeChange("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="icon"
          className={`h-9 w-9 cursor-pointer ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-500"}`}
          onClick={() => onViewModeChange("list")}
        >
          <ListIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

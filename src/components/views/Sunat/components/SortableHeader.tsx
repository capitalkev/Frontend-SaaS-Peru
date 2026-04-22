import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableHeaderProps {
  label: string;
  value: string;
  onSort: (value: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  className?: string;
}

export function SortableHeader({ label, value, onSort, sortBy, sortOrder, className }: SortableHeaderProps) {
  const isSorting = sortBy === value;
  return (
    <th
      className={cn("px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider cursor-pointer", className)}
      onClick={() => onSort(value)}
    >
      <div className="flex items-center justify-end">
        <span>{label}</span>
        {isSorting ? (
          sortOrder === "asc" ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />
        ) : (
          <ChevronsUpDown className="h-3 w-3 ml-1 text-slate-300" />
        )}
      </div>
    </th>
  );
}

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Toggle({ checked, onCheckedChange, label, className }: ToggleProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          checked ? "bg-indigo-600" : "bg-slate-200"
        )}
      >
        <span className="sr-only">{label}</span>
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "pointer-events-none block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-slate-700 select-none cursor-pointer" onClick={() => onCheckedChange(!checked)}>
          {label}
        </span>
      )}
    </div>
  );
}

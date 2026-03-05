import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all duration-200",
            "placeholder:text-slate-400 text-slate-700",
            "focus-visible:outline-none",
            "focus-visible:border-brand-500 focus-visible:ring-4 focus-visible:ring-brand-500/10",
            "disabled:cursor-not-allowed disabled:opacity-50",
            icon ? "pl-10" : "",
            className
          )}
        ref={ref}
        {...props}
      />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
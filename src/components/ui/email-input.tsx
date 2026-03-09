import * as React from "react";
import { X, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailInputProps {
  value: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function EmailInput({
  value = [],
  onChange,
  placeholder = "Escribe un correo y presiona Enter...",
  className,
  disabled,
}: EmailInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", " ", ","].includes(e.key)) {
      e.preventDefault();
      addEmail();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      const newEmails = [...value];
      newEmails.pop();
      onChange(newEmails);
    }
  };

  const addEmail = () => {
    const email = inputValue.trim().replace(/,/g, "");
    if (!email) return;

    if (isValidEmail(email)) {
      if (!value.includes(email)) {
        onChange([...value, email]);
      }
      setInputValue("");
      setError(false);
    } else {
      setError(true);
    }
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(value.filter((email) => email !== emailToRemove));
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-col w-full rounded-xl border bg-white overflow-hidden transition-all duration-200",
          error 
            ? "border-red-500 ring-2 ring-red-100" 
            : "border-slate-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* ZONA SUPERIOR: Correos ya agregados */}
        {value.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-3 border-b border-slate-100 bg-slate-50/80">
            {value.map((email) => (
              <span
                key={email}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
              >
                {email}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    className="ml-0.5 rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 p-0.5 transition-colors focus:outline-none"
                    title="Quitar correo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center px-3 py-2.5 bg-white">
          <Mail className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError(false);
            }}
            onKeyDown={handleKeyDown}
            onBlur={addEmail}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-700 min-w-[200px]"
            disabled={disabled}
          />
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
          <X className="h-3 w-3" /> Por favor ingresa un formato de correo válido.
        </p>
      )}
    </div>
  );
}
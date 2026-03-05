import * as React from "react";
import { X } from "lucide-react";
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
  placeholder = "Ingresa correos...",
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
    <div className="w-full">
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 min-h-[44px] w-full rounded-xl border bg-white px-3 py-2 text-sm ring-offset-background focus-within:ring-indigo-500 focus-within:ring-offset-2 transition-all duration-200",
          error ? "border-red-500 ring-red-200" : "border-slate-200",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {value.map((email) => (
          <span
            key={email}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-100"
          >
            {email}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeEmail(email)}
                className="ml-1 rounded-full hover:bg-indigo-200 p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError(false);
          }}
          onKeyDown={handleKeyDown}
          onBlur={addEmail}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent outline-none placeholder:text-slate-400 min-w-[120px]"
          disabled={disabled}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">
          Por favor ingresa un correo válido.
        </p>
      )}
    </div>
  );
}

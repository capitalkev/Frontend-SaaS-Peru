import React, { useState, useRef, useEffect, useMemo } from "react";
import { Building2, CircleDollarSign, Users, Calendar, ChevronDown } from "lucide-react";
import { CURRENCIES } from "../constants";
import { ClientOption, UserOption } from "../types";
import { cn } from "@/lib/utils";

function useClickOutside(ref: React.RefObject<any>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

function BaseSelector({ icon: Icon, label, isOpen, onToggle, children }: any) {
  const ref = useRef(null);
  useClickOutside(ref, () => isOpen && onToggle(false));

  return (
    <div className="relative min-w-[180px] max-w-[280px]" ref={ref}>
      <button
        onClick={() => onToggle(!isOpen)}
        title={label}
        className="w-full flex items-center justify-between bg-white border border-slate-200 hover:border-brand-300 hover:ring-2 hover:ring-brand-500/10 px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Icon className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700 truncate">{label}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 w-full min-w-[200px] bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  );
}

export function ClientFilter({ clients, selected, onChange }: { clients: ClientOption[]; selected: string[]; onChange: (v: string[]) => void; }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return clients;
    return clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.ruc.includes(search));
  }, [clients, search]);

  const label = selected.length === 0 || selected.length === clients.length
    ? "Todos los clientes"
    : selected.length === 1 ? clients.find((c) => c.id === selected[0])?.name : `${selected.length} seleccionados`;

  return (
    <BaseSelector icon={Building2} label={label} isOpen={open} onToggle={setOpen}>
      <div className="p-2 border-b border-slate-100">
        <input
          type="text"
          placeholder="Buscar RUC o Nombre..."
          className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border-none rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="max-h-60 overflow-y-auto p-1">
        {filtered.map((c) => (
          <label key={c.id} className="flex items-start gap-2.5 p-1.5 px-2 hover:bg-slate-50 rounded-md cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={() => onChange(selected.includes(c.id) ? selected.filter((id) => id !== c.id) : [...selected, c.id])}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 mt-0.5 h-3.5 w-3.5"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-medium text-slate-800">{c.name}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{c.ruc}</span>
            </div>
          </label>
        ))}
      </div>
    </BaseSelector>
  );
}

export function CurrencyFilter({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void; }) {
  const [open, setOpen] = useState(false);
  const label = selected.length === 0 || selected.length === CURRENCIES.length
    ? "Todas las monedas"
    : CURRENCIES.find((c) => c.code === selected[0])?.name;

  return (
    <BaseSelector icon={CircleDollarSign} label={label} isOpen={open} onToggle={setOpen}>
      <div className="p-1">
        {CURRENCIES.map((c) => (
          <label key={c.code} className="flex items-center gap-2.5 p-2 px-2.5 hover:bg-slate-50 rounded-md cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(c.code)}
              onChange={() => onChange(selected.includes(c.code) ? selected.filter((id) => id !== c.code) : [...selected, c.code])}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
            />
            <span className="text-xs font-medium text-slate-700">{c.name}</span>
          </label>
        ))}
      </div>
    </BaseSelector>
  );
}

export function UserFilter({ users, selected, onChange }: { users: UserOption[]; selected: string[]; onChange: (v: string[]) => void; }) {
  const [open, setOpen] = useState(false);
  const allUsers = [{ email: "UNASSIGNED", nombre: "Sin asignar" }, ...users];

  const label = selected.length === 0 || selected.length === allUsers.length
    ? "Todos los usuarios"
    : selected.length === 1 ? allUsers.find((u) => u.email === selected[0])?.nombre : `${selected.length} seleccionados`;

  return (
    <BaseSelector icon={Users} label={label} isOpen={open} onToggle={setOpen}>
      <div className="max-h-60 overflow-y-auto p-1">
        {allUsers.map((u) => (
          <label key={u.email} className="flex items-start gap-2.5 p-1.5 px-2 hover:bg-slate-50 rounded-md cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(u.email)}
              onChange={() => onChange(selected.includes(u.email) ? selected.filter((e) => e !== u.email) : [...selected, u.email])}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 mt-0.5 h-3.5 w-3.5"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-medium text-slate-700">{u.nombre}</span>
              {u.email !== "UNASSIGNED" && <span className="text-[10px] text-slate-400 mt-0.5">{u.email}</span>}
            </div>
          </label>
        ))}
      </div>
    </BaseSelector>
  );
}

export function PeriodFilter({ filter, onChange }: any) {
  const [open, setOpen] = useState(false);
  const PRESETS = [
    { key: "thisMonth", label: "Mes en curso" },
    { key: "30days", label: "Últimos 30 días" },
    { key: "15days", label: "Últimos 15 días" },
    { key: "5days", label: "Últimos 5 días" },
  ];

  const label = PRESETS.find((p) => p.key === filter.type)?.label || "Personalizado";

  return (
    <BaseSelector icon={Calendar} label={label} isOpen={open} onToggle={setOpen}>
      <div className="p-1">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => { onChange({ type: p.key }); setOpen(false); }}
            className="w-full text-left text-xs font-medium text-slate-700 p-2 px-2.5 hover:bg-slate-50 rounded-md"
          >
            {p.label}
          </button>
        ))}
      </div>
    </BaseSelector>
  );
}
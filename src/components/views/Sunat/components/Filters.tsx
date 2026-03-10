import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Building2, CircleDollarSign, Users, Calendar, ChevronDown } from 'lucide-react';
import { CURRENCIES } from '../constants';
import { ClientOption, UserOption } from '../types';
import { cn } from '@/lib/utils';

// --- Helper Hook for click outside ---
function useClickOutside(ref: React.RefObject<any>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

// --- Componente Base del Selector ---
function BaseSelector({ icon: Icon, label, isOpen, onToggle, children }: any) {
  const ref = useRef(null);
  useClickOutside(ref, () => isOpen && onToggle(false));

  return (
    <div className="relative min-w-[220px]" ref={ref}>
      <button
        onClick={() => onToggle(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-slate-200 hover:border-brand-300 hover:ring-2 hover:ring-brand-500/10 px-3 py-2.5 rounded-xl text-sm transition-all shadow-sm"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Icon className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700 truncate">{label}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-2 w-full min-w-[260px] bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  );
}

// --- 1. Selector de Clientes ---
export function ClientFilter({ clients, selected, onChange }: { clients: ClientOption[], selected: string[], onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return clients;
    return clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.ruc.includes(search));
  }, [clients, search]);

  const label = selected.length === 0 || selected.length === clients.length 
    ? "Todos los clientes" 
    : selected.length === 1 ? clients.find(c => c.id === selected[0])?.name : `${selected.length} seleccionados`;

  return (
    <BaseSelector icon={Building2} label={label} isOpen={open} onToggle={setOpen}>
      <div className="p-2 border-b border-slate-100">
        <input 
          type="text" placeholder="Buscar RUC o Nombre..." 
          className="w-full text-sm px-3 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="max-h-60 overflow-y-auto p-1">
        {filtered.map(c => (
          <label key={c.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
            <input 
              type="checkbox" checked={selected.includes(c.id)} 
              onChange={() => onChange(selected.includes(c.id) ? selected.filter(id => id !== c.id) : [...selected, c.id])}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-800">{c.name}</span>
              <span className="text-xs text-slate-400">{c.ruc}</span>
            </div>
          </label>
        ))}
      </div>
    </BaseSelector>
  );
}

// --- 2. Selector de Monedas ---
export function CurrencyFilter({ selected, onChange }: { selected: string[], onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const label = selected.length === 0 || selected.length === CURRENCIES.length ? "Todas las monedas" : CURRENCIES.find(c => c.code === selected[0])?.name;

  return (
    <BaseSelector icon={CircleDollarSign} label={label} isOpen={open} onToggle={setOpen}>
      <div className="p-1">
        {CURRENCIES.map(c => (
          <label key={c.code} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer">
            <input 
              type="checkbox" checked={selected.includes(c.code)} 
              onChange={() => onChange(selected.includes(c.code) ? selected.filter(id => id !== c.code) : [...selected, c.code])}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm font-medium text-slate-700">{c.name}</span>
          </label>
        ))}
      </div>
    </BaseSelector>
  );
}

// --- 3. Selector de Usuarios ---
export function UserFilter({ users, selected, onChange }: { users: UserOption[], selected: string[], onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const allUsers = [{ email: 'UNASSIGNED', nombre: 'Sin asignar' }, ...users];
  
  const label = selected.length === 0 || selected.length === allUsers.length 
    ? "Todos los usuarios" 
    : selected.length === 1 ? allUsers.find(u => u.email === selected[0])?.nombre : `${selected.length} seleccionados`;

  return (
    <BaseSelector icon={Users} label={label} isOpen={open} onToggle={setOpen}>
      <div className="max-h-60 overflow-y-auto p-1">
        {allUsers.map(u => (
          <label key={u.email} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer">
            <input 
              type="checkbox" checked={selected.includes(u.email)} 
              onChange={() => onChange(selected.includes(u.email) ? selected.filter(e => e !== u.email) : [...selected, u.email])}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">{u.nombre}</span>
              {u.email !== 'UNASSIGNED' && <span className="text-xs text-slate-400">{u.email}</span>}
            </div>
          </label>
        ))}
      </div>
    </BaseSelector>
  );
}

// --- 4. Selector de Periodo ---
export function PeriodFilter({ filter, onChange }: any) {
  const [open, setOpen] = useState(false);
  const PRESETS = [
    { key: 'thisMonth', label: 'Mes en curso' },
    { key: '30days', label: 'Últimos 30 días' },
    { key: '15days', label: 'Últimos 15 días' },
    { key: '5days', label: 'Últimos 5 días' },
  ];
  
  const label = PRESETS.find(p => p.key === filter.type)?.label || "Personalizado";

  return (
    <BaseSelector icon={Calendar} label={label} isOpen={open} onToggle={setOpen}>
      <div className="p-1">
        {PRESETS.map(p => (
          <button 
            key={p.key} onClick={() => { onChange({ type: p.key }); setOpen(false); }}
            className="w-full text-left text-sm font-medium text-slate-700 p-2.5 hover:bg-slate-50 rounded-lg"
          >
            {p.label}
          </button>
        ))}
      </div>
    </BaseSelector>
  );
}
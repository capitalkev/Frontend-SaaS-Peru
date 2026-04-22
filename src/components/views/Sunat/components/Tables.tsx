import React, { useState } from "react";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import { Invoice } from "../types";
import { INVOICE_STATUSES } from "../constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SortableHeader } from "./SortableHeader";

const formatCurrency = (value: number, currency: "PEN" | "USD") => {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(value);
};

export function DetailedTable({ invoices, selectedKeys, onToggle, onSelectAll, onStatusChange, sortBy, sortOrder, onSort }: any) {
  return (
    <table className="w-full text-left border-collapse min-w-[800px]">
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50/80">
          <th className="px-3 py-2 w-10 text-center">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          </th>
          <th className="px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider">Factura</th>
          <th className="px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider">Cliente / Deudor</th>
          <SortableHeader
            label="Monto"
            value="amount"
            onSort={onSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            className="text-right"
          />
          <th className="px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider">Emisión</th>
          <th className="px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider">Estatus</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {invoices.map((inv: Invoice) => {
          const isZeroAmount = inv.montoNeto === 0;
          return (
            <tr key={inv.key} className={cn("hover:bg-slate-50/50 transition-colors", isZeroAmount && "opacity-50 bg-slate-50")}>
              <td className="px-3 py-1.5 text-center">
                <input
                  type="checkbox"
                  disabled={isZeroAmount}
                  checked={selectedKeys.includes(inv.key)}
                  onChange={() => onToggle(inv.key)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50 h-3.5 w-3.5"
                />
              </td>
              
              <td className="px-3 py-1.5 whitespace-nowrap">
                <span className="text-xs font-medium text-slate-700">{inv.id}</span>
              </td>
              <td className="px-3 py-1.5">
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-medium text-slate-700">{inv.clientName}</span>
                  <span className="text-[10px] text-slate-500 truncate max-w-[250px]">{inv.debtor}</span>
                </div>
              </td>
              <td className="px-3 py-1.5 whitespace-nowrap text-right">
                <span className="text-xs font-mono font-medium text-slate-700">
                  {formatCurrency(inv.amount, inv.currency)}
                </span>
                {isZeroAmount && (
                  <span className="ml-1.5 text-[9px] text-slate-500 uppercase bg-slate-200 px-1 rounded">Anulada</span>
                )}
              </td>
              <td className="px-3 py-1.5 whitespace-nowrap text-xs text-slate-500">
                {inv.emissionDate}
              </td>
              <td className="px-3 py-1.5 whitespace-nowrap">
                <select
                  disabled={isZeroAmount}
                  value={inv.status}
                  onChange={(e) => onStatusChange(inv.ventaId, inv.clientId, inv.id, e.target.value)}
                  className="text-[11px] font-medium bg-white border border-slate-200 text-slate-600 rounded px-1.5 py-1 focus:ring-1 focus:ring-brand-500 outline-none disabled:cursor-not-allowed"
                >
                  {INVOICE_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// --- TABLA AGRUPADA ---
export function GroupedTable({ groups, expandedKey, onExpand, selectedKeys, onGroupSelect, onInvoiceSelect, onStatusChange, sortBy, sortOrder, onSort }: any) {
  return (
    <table className="w-full text-left border-collapse min-w-[800px]">
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50/80">
          <th className="px-3 py-2 w-10 text-center"></th>
          <th className="px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
          <th className="px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider">Deudor</th>
          <th className="px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wider text-center">Facturas</th>
          <SortableHeader
            label="Monto Total"
            value="totalAmount"
            onSort={onSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            className="text-right"
          />
        </tr>
      </thead>
      <tbody>
        {groups.map((group: any) => {
          const isExpanded = expandedKey === group.key;
          const groupInvKeys = group.invoices.filter((i: any) => i.montoNeto !== 0).map((i: any) => i.key);
          const allSelected = groupInvKeys.length > 0 && groupInvKeys.every((k: string) => selectedKeys.includes(k));
          return (
            <React.Fragment key={group.key}>
              <tr className={cn("border-b border-slate-100 hover:bg-slate-50 transition-colors", isExpanded && "bg-brand-50/30")}>
                <td className="px-3 py-1.5 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => onGroupSelect(group.key, groupInvKeys, allSelected)}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
                  />
                </td>
                <td className="px-3 py-1.5 font-medium text-xs text-slate-700 cursor-pointer" onClick={() => onExpand(group.key)}>
                  {group.clientName}
                </td>
                <td className="px-3 py-1.5 text-slate-500 cursor-pointer text-xs" onClick={() => onExpand(group.key)}>
                  {group.debtor}
                </td>
                <td className="px-3 py-1.5 text-center cursor-pointer" onClick={() => onExpand(group.key)}>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-medium px-2 py-0.5 rounded-full border border-blue-100">
                    {group.invoiceCount}
                  </span>
                </td>
                <td className="px-3 py-1.5 text-right font-mono font-medium text-xs text-slate-700 cursor-pointer" onClick={() => onExpand(group.key)}>
                  <div className="flex items-center justify-end gap-2">
                    {formatCurrency(group.totalAmount, group.currency)}
                    {isExpanded ? <ChevronUp className="h-3 w-3 text-slate-400" /> : <ChevronDown className="h-3 w-3 text-slate-400" />}
                  </div>
                </td>
              </tr>
              {isExpanded && (
                <tr>
                  <td colSpan={5} className="p-0 border-b border-slate-200">
                    <div className="bg-slate-50/80 px-4 py-2 pl-12 shadow-inner">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="pb-1 w-8"></th>
                            <th className="pb-1 text-[10px] font-medium text-slate-400">Factura</th>
                            <th className="pb-1 text-[10px] font-medium text-slate-400">Monto</th>
                            <th className="pb-1 text-[10px] font-medium text-slate-400">Emisión</th>
                            <th className="pb-1 text-[10px] font-medium text-slate-400">Estatus</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50">
                          {group.invoices.map((inv: Invoice) => (
                            <tr key={inv.key} className={cn("hover:bg-white transition-colors", inv.montoNeto === 0 && "opacity-50")}>
                              <td className="py-1">
                                <input
                                  type="checkbox"
                                  disabled={inv.montoNeto === 0}
                                  checked={selectedKeys.includes(inv.key)}
                                  onChange={() => onInvoiceSelect(inv.key)}
                                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50 h-3 w-3"
                                />
                              </td>
                              <td className="py-1 text-[11px] font-medium text-slate-600">{inv.id}</td>
                              <td className="py-1 text-[11px] font-mono text-slate-500">{formatCurrency(inv.amount, inv.currency)}</td>
                              <td className="py-1 text-[11px] text-slate-400">{inv.emissionDate}</td>
                              <td className="py-1">
                                <select
                                  disabled={inv.montoNeto === 0}
                                  value={inv.status}
                                  onChange={(e) => onStatusChange(inv.ventaId, inv.clientId, inv.id, e.target.value)}
                                  className="text-[10px] bg-white border border-slate-200 rounded px-1 py-0.5 outline-none font-medium text-slate-600"
                                >
                                  {INVOICE_STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

// --- BARRA DE ACCIÓN MASIVA ---
export function BulkActionToolbar({ count, onClear, onApply }: { count: number; onClear: () => void; onApply: (s: string) => void; }) {
  const [status, setStatus] = useState(INVOICE_STATUSES[0]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-2 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-4">
      <span className="text-xs font-medium bg-slate-800 px-2.5 py-1 rounded-md">
        {count} seleccionadas
      </span>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
        className="text-xs font-medium bg-slate-800 border-none text-white rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-brand-500"
      >
        {INVOICE_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <Button size="sm" className="bg-brand-600 hover:bg-brand-500 text-white rounded-md h-7 text-xs px-3 font-medium" onClick={() => onApply(status)}>
        <Send className="w-3 h-3 mr-1.5" /> Aplicar
      </Button>
      <button onClick={onClear} className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
        Cancelar
      </button>
    </div>
  );
}
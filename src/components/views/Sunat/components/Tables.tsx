import React, { useRef, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, FileText, Send } from "lucide-react";
import { Invoice } from "../types";
import { INVOICE_STATUSES } from "../constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const formatCurrency = (value: number, currency: "PEN" | "USD") => {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(
    value,
  );
};

// --- TABLA DETALLADA ---
export function DetailedTable({
  invoices,
  selectedKeys,
  onToggle,
  onSelectAll,
  onStatusChange,
}: any) {
  return (
    <table className="w-full text-left border-collapse min-w-[800px]">
      <thead>
        <tr className="border-b border-slate-100 bg-slate-50/50">
          <th className="px-4 py-3 w-12 text-center">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          </th>
          <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase">
            Factura
          </th>
          <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase">
            Cliente / Deudor
          </th>
          <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase">
            Monto
          </th>
          <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase">
            Fecha Emisión
          </th>
          <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase">
            Estatus
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {invoices.map((inv: Invoice) => {
          const isZeroAmount = inv.montoNeto === 0;
          return (
            <tr
              key={inv.key}
              className={cn(
                "hover:bg-slate-50/50 transition-colors",
                isZeroAmount && "opacity-50 bg-slate-50",
              )}
            >
              <td className="px-4 py-4 text-center">
                <input
                  type="checkbox"
                  disabled={isZeroAmount}
                  checked={selectedKeys.includes(inv.key)}
                  onChange={() => onToggle(inv.key)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
                />
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-500" />
                  <span className="font-medium text-slate-900">{inv.id}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">
                    {inv.clientName}
                  </span>
                  <span className="text-xs text-slate-500 truncate max-w-[200px]">
                    {inv.debtor}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="font-mono font-medium text-slate-900">
                  {formatCurrency(inv.amount, inv.currency)}
                </span>
                {isZeroAmount && (
                  <span className="ml-2 text-[10px] text-slate-500 uppercase bg-slate-200 px-1.5 py-0.5 rounded">
                    Anulada
                  </span>
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">
                {inv.emissionDate}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <select
                  disabled={isZeroAmount}
                  value={inv.status}
                  onChange={(e) =>
                    onStatusChange(
                      inv.ventaId,
                      inv.clientId,
                      inv.id,
                      e.target.value,
                    )
                  }
                  className="text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-brand-500 outline-none disabled:cursor-not-allowed"
                >
                  {INVOICE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
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
export function GroupedTable({
  groups,
  expandedKey,
  onExpand,
  selectedKeys,
  onGroupSelect,
  onInvoiceSelect,
  onStatusChange,
}: any) {
  return (
    <table className="w-full text-left border-collapse min-w-[800px]">
      <thead>
        <tr className="border-b border-slate-100 bg-slate-50/50">
          <th className="px-4 py-3 w-12"></th>
          <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
            Cliente
          </th>
          <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
            Deudor
          </th>
          <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-center">
            Facturas
          </th>
          <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">
            Monto Total
          </th>
        </tr>
      </thead>
      <tbody>
        {groups.map((group: any) => {
          const isExpanded = expandedKey === group.key;
          const groupInvKeys = group.invoices
            .filter((i: any) => i.montoNeto !== 0)
            .map((i: any) => i.key);
          const allSelected =
            groupInvKeys.length > 0 &&
            groupInvKeys.every((k: string) => selectedKeys.includes(k));

          return (
            <React.Fragment key={group.key}>
              <tr
                className={cn(
                  "border-b border-slate-100 hover:bg-slate-50 transition-colors",
                  isExpanded && "bg-brand-50/30",
                )}
              >
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() =>
                      onGroupSelect(group.key, groupInvKeys, allSelected)
                    }
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                </td>
                <td
                  className="px-4 py-2.5 font-medium text-sm text-slate-900 cursor-pointer"
                  onClick={() => onExpand(group.key)}
                >
                  {group.clientName}
                </td>
                <td
                  className="px-4 py-2.5 text-slate-600 cursor-pointer text-sm"
                  onClick={() => onExpand(group.key)}
                >
                  {group.debtor}
                </td>
                <td
                  className="px-4 py-2.5 text-center cursor-pointer"
                  onClick={() => onExpand(group.key)}
                >
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    {group.invoiceCount}
                  </Badge>
                </td>
                <td
                  className="px-4 py-2.5 text-right font-mono font-bold text-slate-900 cursor-pointer"
                  onClick={() => onExpand(group.key)}
                >
                  <div className="flex items-center justify-end gap-3">
                    {formatCurrency(group.totalAmount, group.currency)}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </td>
              </tr>
              {isExpanded && (
                <tr>
                  <td colSpan={5} className="p-0 border-b border-slate-100">
                    <div className="bg-slate-50/50 p-4 pl-12 shadow-inner">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-200">
                            <th className="pb-2 w-8"></th>
                            <th className="pb-2 font-medium">Factura</th>
                            <th className="pb-2 font-medium">Monto</th>
                            <th className="pb-2 font-medium">Emisión</th>
                            <th className="pb-2 font-medium">Estatus</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {group.invoices.map((inv: Invoice) => (
                            <tr
                              key={inv.key}
                              className={cn(
                                "hover:bg-white transition-colors",
                                inv.montoNeto === 0 && "opacity-50",
                              )}
                            >
                              <td className="py-2">
                                <input
                                  type="checkbox"
                                  disabled={inv.montoNeto === 0}
                                  checked={selectedKeys.includes(inv.key)}
                                  onChange={() => onInvoiceSelect(inv.key)}
                                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
                                />
                              </td>
                              <td className="py-2 font-medium text-slate-700">
                                {inv.id}
                              </td>
                              <td className="py-2 font-mono">
                                {formatCurrency(inv.amount, inv.currency)}
                              </td>
                              <td className="py-2 text-slate-500">
                                {inv.emissionDate}
                              </td>
                              <td className="py-2">
                                <select
                                  disabled={inv.montoNeto === 0}
                                  value={inv.status}
                                  onChange={(e) =>
                                    onStatusChange(
                                      inv.ventaId,
                                      inv.clientId,
                                      inv.id,
                                      e.target.value,
                                    )
                                  }
                                  className="text-xs bg-white border border-slate-200 rounded-md px-1.5 py-1"
                                >
                                  {INVOICE_STATUSES.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
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
export function BulkActionToolbar({
  count,
  onClear,
  onApply,
}: {
  count: number;
  onClear: () => void;
  onApply: (s: string) => void;
}) {
  const [status, setStatus] = useState(INVOICE_STATUSES[0]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-4">
      <span className="text-sm font-medium bg-slate-800 px-3 py-1 rounded-full">
        {count} seleccionadas
      </span>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
        className="text-sm bg-slate-800 border-none text-white rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-500"
      >
        {INVOICE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <Button
        size="sm"
        className="bg-brand-600 hover:bg-brand-500 text-white rounded-lg"
        onClick={() => onApply(status)}
      >
        <Send className="w-3.5 h-3.5 mr-2" /> Aplicar
      </Button>
      <button
        onClick={onClear}
        className="text-sm text-slate-400 hover:text-white transition-colors"
      >
        Cancelar
      </button>
    </div>
  );
}

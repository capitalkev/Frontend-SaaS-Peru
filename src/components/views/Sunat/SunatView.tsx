import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, AlertTriangle, Loader2, Clock } from "lucide-react";
import { KPIDashboard } from "./components/KPIDashboard";

// IMPORTS FASE 2
import { useSunatUsers, useSunatClients, useSunatData } from "./hooks";
import { ClientFilter, CurrencyFilter, UserFilter, PeriodFilter } from "./components/Filters";

export function SunatView() {
  const { user: firebaseUser, dbUser, loading: authLoading } = useAuth();
  const isAdmin = dbUser?.rol === "admin";
  
  // Estados de Filtros
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [selectedUserEmails, setSelectedUserEmails] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState({ type: "thisMonth" });
  
  // Estados de UI y Tabla
  const [viewMode, setViewMode] = useState<"grouped" | "detailed">("grouped");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("fecha");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Llamadas a los Hooks (Fase 2)
  const { users } = useSunatUsers(firebaseUser);
  const { clients } = useSunatClients(firebaseUser, selectedUserEmails, users.length);
  const { ventas, metrics, pagination, loading, error, periodLabel } = useSunatData(
    firebaseUser, dateFilter, selectedClientIds, selectedCurrencies, 
    selectedUserEmails, currentPage, sortBy, clients.length, users.length, viewMode, refreshTrigger
  );

  if (authLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-600 h-8 w-8" /></div>;

  if (error && ventas.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="border-rose-200 bg-rose-50 p-8 text-center max-w-md shadow-sm">
          <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-rose-900 mb-2">Error al cargar datos</h2>
          <p className="text-rose-700 mb-6">{error}</p>
          <Button variant="destructive" onClick={() => window.location.reload()}>Reintentar</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Cabecera y Filtros */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Portal de Ventas SUNAT</h1>
        <div className="flex flex-col md:flex-row gap-3">
          <ClientFilter 
            clients={clients} selected={selectedClientIds} 
            onChange={ids => { setSelectedClientIds(ids); setCurrentPage(1); }} 
          />
          <CurrencyFilter 
            selected={selectedCurrencies} 
            onChange={curr => { setSelectedCurrencies(curr); setCurrentPage(1); }} 
          />
          {isAdmin && (
            <UserFilter 
              users={users} selected={selectedUserEmails} 
              onChange={emails => { setSelectedUserEmails(emails); setCurrentPage(1); }} 
            />
          )}
        </div>
      </div>

      {/* Panel de Métricas */}
      <div className="shrink-0">
        <KPIDashboard metrics={metrics} />
      </div>

      {/* Tabla y Controles */}
      <Card className="flex-1 border-slate-200 shadow-sm flex flex-col overflow-hidden bg-white min-h-0">
        {/* Controles de Tabla */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 shrink-0">
          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode("grouped")}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === "grouped" ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:text-slate-900"}`}
            >
              <LayoutGrid className="w-4 h-4" /> Agrupada
            </button>
            <button
              onClick={() => setViewMode("detailed")}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === "detailed" ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:text-slate-900"}`}
            >
              <List className="w-4 h-4" /> Detallada
            </button>
          </div>

          <div className="flex items-center gap-4">
             <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Última act. 12:45 PM
             </span>
             <PeriodFilter filter={dateFilter} onChange={(f: any) => { setDateFilter(f); setCurrentPage(1); }} />
          </div>
        </div>

        {/* Renderizado de la Tabla (Scrolling interior) */}
        <div className="flex-1 overflow-auto bg-slate-50/30">
          {loading && ventas.length === 0 ? (
             <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-600 h-8 w-8" /></div>
          ) : (
            <div className="min-h-full flex items-center justify-center p-8 text-slate-400 italic">
               [Fase 3] Aquí renderizaremos la GroupedInvoiceTable o InvoiceTable modernizadas.<br/>
               Ventas cargadas: {ventas.length}
            </div>
          )}
        </div>

        {/* Paginación */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <span className="text-sm font-medium text-slate-500">
            Página {pagination.page} de {pagination.total_pages} <span className="text-slate-400 font-normal">({pagination.total_items} facturas)</span>
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white" disabled={!pagination.has_previous} onClick={() => setCurrentPage(p => p - 1)}>Anterior</Button>
            <Button variant="outline" size="sm" className="bg-white" disabled={!pagination.has_next} onClick={() => setCurrentPage(p => p + 1)}>Siguiente</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
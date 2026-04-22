import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, AlertTriangle, Loader2 } from "lucide-react";
import { KPIDashboard } from "./components/KPIDashboard";
import { useSunatUsers, useSunatClients, useSunatData } from "./hooks";
import {
  ClientFilter,
  CurrencyFilter,
  UserFilter,
  PeriodFilter,
} from "./components/Filters";
import {
  DetailedTable,
  GroupedTable,
  BulkActionToolbar,
} from "./components/Tables";
import { SUNAT_API_URL } from "./constants";

export function SunatView() {
  const { user: firebaseUser, dbUser, loading: authLoading } = useAuth();
  const isAdmin = dbUser?.rol === "admin";

  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [selectedUserEmails, setSelectedUserEmails] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState({ type: "thisMonth" });

  const [viewMode, setViewMode] = useState<"grouped" | "detailed">("grouped");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("fecha_emision");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedInvoiceKeys, setSelectedInvoiceKeys] = useState<string[]>([]);
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>(null);

  const { users } = useSunatUsers(firebaseUser, isAdmin);
  const { clients } = useSunatClients(
    firebaseUser,
    selectedUserEmails,
    users.length,
  );
  const { ventas, metrics, pagination, loading, error, periodLabel } =
    useSunatData(
      firebaseUser,
      dateFilter,
      selectedClientIds,
      selectedCurrencies,
      selectedUserEmails,
      currentPage,
      sortBy,
      sortOrder,
      clients.length,
      users.length,
      viewMode,
      refreshTrigger,
    );

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const handleStatusChange = async (
    ventaId: string,
    clientId: string,
    invoiceId: string,
    newStatus: string,
  ) => {
    try {
      const token = await firebaseUser?.getIdToken();
      await fetch(`${SUNAT_API_URL}/api/ventas/${ventaId}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado1: newStatus }),
      });
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      alert("Error al actualizar el estado");
    }
  };

  const handleBulkUpdate = async (status: string) => {
    setSelectedInvoiceKeys([]);
    setRefreshTrigger((prev) => prev + 1);
    alert(`Se aplicarían el estado ${status} a las facturas seleccionadas.`);
  };

  const invoicesFormatted = useMemo(
    () =>
      ventas.map((v) => ({
        id: `${v.serie_cdp || ""}-${v.nro_cp_inicial || v.id}`,
        ventaId: v.id,
        clientId: v.ruc,
        clientName: v.razon_social || v.ruc,
        debtor: v.apellidos_nombres_razon_social || "Sin nombre",
        amount: parseFloat(v.total_factura || 0),
        montoNeto: parseFloat(v.monto_neto || 0),
        currency: v.moneda,
        emissionDate: v.fecha_emision,
        status: v.estado1 || "Sin gestión",
        key: `${v.ruc}-${v.serie_cdp || ""}-${v.nro_cp_inicial || v.id}`,
        tieneNotaCredito: v.tiene_nota_credito,
      })),
    [ventas],
  );

  const groupsFormatted = useMemo(() => {
    const groupsMap = invoicesFormatted.reduce((acc: any, inv: any) => {
      const key = `${inv.clientId}-${inv.debtor}-${inv.currency}`;
      if (!acc[key])
        acc[key] = {
          key,
          clientName: inv.clientName,
          debtor: inv.debtor,
          currency: inv.currency,
          invoiceCount: 0,
          totalAmount: 0,
          invoices: [],
        };
      acc[key].invoiceCount++;
      acc[key].totalAmount += inv.montoNeto;
      acc[key].invoices.push(inv);
      return acc;
    }, {});
    return Object.values(groupsMap);
  }, [invoicesFormatted]);

  if (authLoading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-brand-600 h-8 w-8" />
      </div>
    );

  if (error && ventas.length === 0) {
    let mensajeSugerencia = "Hubo un problema al comunicarse con el servidor.";
    
    if (error.includes("Failed to fetch")) {
      mensajeSugerencia = "El servidor no responde. Verifica que la URL del servidor sea correcta y que esté en funcionamiento.";
    } else if (error.includes("401") || error.includes("403")) {
      mensajeSugerencia = "Tu sesión puede haber expirado o no tienes los permisos necesarios. Intenta recargar la página.";
    } else if (error.includes("500")) {
      mensajeSugerencia = "Ocurrió un error interno en el servidor. Por favor, revisa los logs del backend.";
    }

    return (
      <div className="flex items-center justify-center h-full">
        <Card className="border-rose-200 bg-rose-50 p-8 text-center max-w-md shadow-sm">
          <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-rose-900 mb-2">
            Aviso del Sistema
          </h2>
          <p className="text-rose-700 font-medium mb-2">{error}</p>
          <p className="text-sm text-rose-600/80 mb-6">
            {mensajeSugerencia}
          </p>
          <Button
            variant="destructive"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] gap-3">
      
      {/* 1. KPIs arriba, compactos */}
      <div className="shrink-0">
        <KPIDashboard metrics={metrics} />
      </div>

      <Card className="flex-1 border-slate-200 shadow-sm flex flex-col overflow-hidden bg-white min-h-[300px] relative rounded-xl">
        
        {/* 2. Barra de herramientas: Botones de vista + Filtros alineados a los costados */}
        <div className="p-3 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50 shrink-0">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Botones Agrupada/Detallada */}
            <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-sm shrink-0">
              <button
                onClick={() => setViewMode("grouped")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${viewMode === "grouped" ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:text-slate-900"}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Agrupada
              </button>
              <button
                onClick={() => setViewMode("detailed")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${viewMode === "detailed" ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:text-slate-900"}`}
              >
                <List className="w-3.5 h-3.5" /> Detallada
              </button>
            </div>

            {/* Divisor Visual (Opcional, para separar botones de los filtros) */}
            <div className="hidden sm:block h-6 w-px bg-slate-200 mx-1"></div>

            {/* Filtros movidos aquí */}
            <ClientFilter
              clients={clients}
              selected={selectedClientIds}
              onChange={(ids) => {
                setSelectedClientIds(ids);
                setCurrentPage(1);
              }}
            />
            <CurrencyFilter
              selected={selectedCurrencies}
              onChange={(curr) => {
                setSelectedCurrencies(curr);
                setCurrentPage(1);
              }}
            />
            {isAdmin && (
              <UserFilter
                users={users}
                selected={selectedUserEmails}
                onChange={(emails) => {
                  setSelectedUserEmails(emails);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <PeriodFilter
              filter={dateFilter}
              onChange={(f: any) => {
                setDateFilter(f);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* 3. Contenedor de la Tabla */}
        <div className="flex-1 overflow-auto bg-white">
          {loading && ventas.length === 0 ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-brand-600 h-8 w-8" />
            </div>
          ) : viewMode === "grouped" ? (
            <GroupedTable
              groups={groupsFormatted}
              expandedKey={expandedGroupKey}
              onExpand={(key: string) => setExpandedGroupKey(prevKey => prevKey === key ? null : key)}
              selectedKeys={selectedInvoiceKeys}
              onGroupSelect={(
                k: string,
                invKeys: string[],
                allSelected: boolean,
              ) =>
                setSelectedInvoiceKeys(
                  allSelected
                    ? selectedInvoiceKeys.filter((s) => !invKeys.includes(s))
                    : [...new Set([...selectedInvoiceKeys, ...invKeys])],
                )
              }
              onInvoiceSelect={(k: string) =>
                setSelectedInvoiceKeys((prev) =>
                  prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
                )
              }
              onStatusChange={handleStatusChange}
            />
          ) : (
            <DetailedTable
              invoices={invoicesFormatted}
              selectedKeys={selectedInvoiceKeys}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onToggle={(k: string) =>
                setSelectedInvoiceKeys((prev) =>
                  prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
                )
              }
              onSelectAll={(chk: boolean) =>
                setSelectedInvoiceKeys(
                  chk
                    ? invoicesFormatted
                        .filter((i) => i.montoNeto !== 0)
                        .map((i) => i.key)
                    : [],
                )
              }
              onStatusChange={handleStatusChange}
            />
          )}
        </div>

        {/* 4. Paginación */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <span className="text-xs font-medium text-slate-500">
            Página {pagination.page} de {pagination.total_pages}{" "}
            <span className="text-slate-400 font-normal">
              ({pagination.total_items} facturas)
            </span>
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white h-8 text-xs"
              disabled={!pagination.has_previous}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white h-8 text-xs"
              disabled={!pagination.has_next}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>

        {selectedInvoiceKeys.length > 0 && (
          <BulkActionToolbar
            count={selectedInvoiceKeys.length}
            onClear={() => setSelectedInvoiceKeys([])}
            onApply={handleBulkUpdate}
          />
        )}
      </Card>
    </div>
  );
}
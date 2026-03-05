import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@radix-ui/react-dropdown-menu";
import { cn } from '@/lib/utils';

// Configuración visual de los estados con hover suave
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  "Ingresado": { label: "Ingresado", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100", icon: Clock },
  "En Revisión": { label: "En Verificación", color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100", icon: Clock },
  "Pendiente de Firma": { label: "Pendiente Firma", color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100", icon: Clock },
  "Firmado": { label: "Firmado", color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100", icon: CheckCircle2 },
  "Observado": { label: "Observado", color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100", icon: AlertCircle },
  "Aprobado": { label: "Aprobado", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100", icon: CheckCircle2 },
  "Rechazado": { label: "Rechazado", color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100", icon: XCircle },
  "En Desembolso": { label: "En Desembolso", color: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100", icon: Clock },
  "Desembolsado": { label: "Desembolsado", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100", icon: CheckCircle2 },
  "Pagado": { label: "Pagado", color: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200", icon: CheckCircle2 },
  "Vencido": { label: "Vencido", color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100", icon: AlertCircle },
  "Anulado": { label: "Anulado", color: "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100", icon: XCircle },
  "Cerrado": { label: "Cerrado", color: "bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200", icon: CheckCircle2 },
};

// Actualizamos la interfaz de props para mandar tanto el ID (para la BD) como el Código (para el Título visual)
export const OperationsView = ({ onNavigateToDetail }: { onNavigateToDetail?: (id: string | number, codigo: string) => void }) => {
  const [operations, setOperations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getOperations("jose.aguirre@capitalexpress.pe");
        setOperations(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredOps = operations.filter(op => {
    return op.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           op.codigo_operacion?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Operaciones Cargadas</h1>
          <p className="text-slate-500 text-sm mt-1">Visualiza y gestiona el estado de tus operaciones.</p>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar por cliente o código..." 
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-2/5">Cliente / Deudor</th>
                <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6 bg-slate-50/30 h-20"></td>
                  </tr>
                ))
              ) : filteredOps.map((op) => {
                const status = STATUS_CONFIG[op.estado] || { label: op.estado, color: "bg-slate-100 text-slate-700 hover:bg-slate-200", icon: FileText };
                const StatusIcon = status.icon;

                return (
                  <tr key={op.id} className="group hover:bg-slate-50/50 transition-colors">
                    {/* Columna 1: Cliente agrupado */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-slate-800 leading-tight line-clamp-2 pr-4">
                          {op.nombre_cliente}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="text-slate-400">{op.codigo_operacion}</span>
                          {op.cliente_ruc && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span>RUC: {op.cliente_ruc}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Columna 2: Monto */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "text-sm font-medium",
                        op.moneda_sumatoria === 'USD' ? "text-blue-600" : "text-slate-800"
                      )}>
                        {op.moneda_sumatoria} {op.monto_sumatoria_total?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Columna 3: Fecha */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-700 font-medium">
                          {new Date(op.fecha_creacion).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(op.fecha_creacion).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>

                    {/* Columna 4: Estado */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className={cn("flex items-center gap-1.5 px-3 py-1 text-xs font-medium border shadow-none transition-colors", status.color)}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </Badge>
                    </td>

                    {/* Columna 5: Acciones */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 outline-none">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-white rounded-xl shadow-lg border border-slate-100 p-1 z-50">
                          <DropdownMenuItem 
                            // Pasamos el ID y el Código
                            onClick={() => onNavigateToDetail?.(op.id, op.codigo_operacion)} 
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-lg cursor-pointer outline-none transition-colors"
                          >
                            <Eye className="h-4 w-4" /> Ver Detalles
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State */}
          {!loading && filteredOps.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-medium text-lg">No hay operaciones</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                No se encontraron resultados para tu búsqueda actual.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
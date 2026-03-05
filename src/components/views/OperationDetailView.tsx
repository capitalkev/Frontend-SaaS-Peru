import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmailInput } from "@/components/ui/email-input";
import { api } from "@/lib/api";
import { 
  FileText, Mail, Users, Plus, Send, Building2, ArrowLeft, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OperationDetailViewProps {
  operationId: string;
  operationCode: string;
  onBack: () => void;
}

// 1. DEFINIMOS EL TIPO EXACTO PARA ELIMINAR EL ERROR TS(2339)
type DeudorAgrupado = {
  deudor_ruc: string;
  nombre_deudor: string;
  facturas: any[];
};

export function OperationDetailView({ operationId, operationCode, onBack }: OperationDetailViewProps) {
  const [facturas, setFacturas] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDebtorRuc, setSelectedDebtorRuc] = React.useState<string>("");
  const [emails, setEmails] = React.useState<string[]>([]);

  const suggestedContacts = [
    { name: "Juan Pérez", email: "jperez@empresa.com.pe", role: "Tesorería" },
    { name: "Maria Lopez", email: "mlopez@empresa.com.pe", role: "Contabilidad" },
  ];

  React.useEffect(() => {
    const fetchDetalles = async () => {
      try {
        setLoading(true);
        const data = await api.getFacturasByOperation(operationId);
        setFacturas(data || []);
        
        if (data && data.length > 0) {
          setSelectedDebtorRuc(data[0].deudor_ruc);
        }
      } catch (error) {
        console.error("Error al cargar las facturas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (operationId) {
      fetchDetalles();
    }
  }, [operationId]);

  const deudoresAgrupados = React.useMemo(() => {
    // Le decimos al reduce que construya un Record con nuestro tipo DeudorAgrupado
    return facturas.reduce<Record<string, DeudorAgrupado>>((acc, factura) => {
      const ruc = factura.deudor_ruc;
      if (!acc[ruc]) {
        acc[ruc] = {
          deudor_ruc: ruc,
          nombre_deudor: factura.nombre_deudor ? String(factura.nombre_deudor) : `Deudor ${ruc}`,
          facturas: []
        };
      }
      acc[ruc].facturas.push(factura);
      return acc;
    }, {});
  }, [facturas]);

  // 2. FORZAMOS EL TIPO AL EXTRAER LOS VALORES DEL OBJETO
  const listaDeudores = Object.values(deudoresAgrupados) as DeudorAgrupado[];
  const deudorSeleccionado = deudoresAgrupados[selectedDebtorRuc];
  const facturasMostradas = deudorSeleccionado ? deudorSeleccionado.facturas : [];

  const addEmail = (email: string) => {
    if (!emails.includes(email)) {
      setEmails([...emails, email]);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Cabecera Principal */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            {operationCode}
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-600" />
          <p>Cargando detalle de la operación...</p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          
          {/* Columna Izquierda: Lista de Deudores Agrupados */}
          <Card className="lg:col-span-1 h-full overflow-hidden flex flex-col border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Deudores</CardTitle>
            </CardHeader>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 hide-scrollbar">
              {listaDeudores.map((deudor) => {
                const isSelected = selectedDebtorRuc === deudor.deudor_ruc;
                const numFacturas = deudor.facturas.length;
                const iniciales = deudor.nombre_deudor.substring(0, 2).toUpperCase();

                return (
                  <button
                    key={deudor.deudor_ruc}
                    onClick={() => setSelectedDebtorRuc(deudor.deudor_ruc)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 border",
                      isSelected 
                        ? "bg-brand-50 border-brand-100 shadow-sm ring-1 ring-brand-200" 
                        : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold text-xs border",
                      isSelected ? "bg-white border-brand-200 text-brand-600" : "bg-slate-50 border-slate-200 text-slate-500"
                    )}>
                      {iniciales}
                    </div>
                    <div className="overflow-hidden">
                      <p className={cn("text-sm font-bold truncate", isSelected ? "text-brand-900" : "text-slate-900")} title={deudor.nombre_deudor}>
                        {deudor.nombre_deudor}
                      </p>
                      <p className={cn("text-xs", isSelected ? "text-brand-600" : "text-slate-500")}>
                        {numFacturas} {numFacturas === 1 ? 'Factura' : 'Facturas'} • {deudor.deudor_ruc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Columna Derecha: Tabs de Información */}
          <Card className="lg:col-span-3 h-full overflow-hidden flex flex-col border-slate-200 shadow-sm bg-white">
            <Tabs.Root defaultValue="invoices" className="flex-1 flex flex-col">
              <div className="px-6 pt-6 border-b border-slate-100">
                <Tabs.List className="flex gap-6">
                  <Tabs.Trigger 
                    value="invoices"
                    className="pb-3 text-sm font-medium text-slate-500 data-[state=active]:text-brand-600 data-[state=active]:border-b-2 data-[state=active]:border-brand-600 transition-colors outline-none"
                  >
                    Facturas ({facturasMostradas.length})
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="report"
                    className="pb-3 text-sm font-medium text-slate-500 data-[state=active]:text-brand-600 data-[state=active]:border-b-2 data-[state=active]:border-brand-600 transition-colors outline-none"
                  >
                    Reporte de Riesgo
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="manage"
                    className="pb-3 text-sm font-medium text-slate-500 data-[state=active]:text-brand-600 data-[state=active]:border-b-2 data-[state=active]:border-brand-600 transition-colors outline-none"
                  >
                    Notificaciones
                  </Tabs.Trigger>
                </Tabs.List>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-50/30 hide-scrollbar">
                
                {/* Panel de Facturas */}
                <Tabs.Content value="invoices" className="p-6 outline-none">
                  <div className="space-y-3">
                    {facturasMostradas.map((f) => (
                      <div key={f.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-brand-50 rounded-lg text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{f.numero_documento}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                              <span>Emitido: {new Date(f.fecha_emision).toLocaleDateString('es-PE')}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-amber-600 font-medium">Vence: {new Date(f.fecha_vencimiento).toLocaleDateString('es-PE')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "font-bold text-lg",
                            f.moneda === 'PEN' ? "text-slate-800" : "text-blue-600"
                          )}>
                            {f.moneda === 'PEN' ? 'S/' : 'USD'} {f.monto_total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                          </span>
                          <p className="text-xs text-slate-400 mt-1 font-medium">{f.estado}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tabs.Content>

                {/* Panel de Reporte */}
                <Tabs.Content value="report" className="p-6 outline-none">
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                    <Building2 className="h-12 w-12 mb-3 text-slate-300" />
                    <p>El reporte de riesgo está en proceso de generación.</p>
                  </div>
                </Tabs.Content>

                {/* Panel de Notificaciones */}
                <Tabs.Content value="manage" className="p-6 outline-none space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Mail className="h-5 w-5 text-brand-500" />
                      Avisos al Deudor
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">Destinatarios Seleccionados</label>
                        <EmailInput 
                          value={emails} 
                          onChange={setEmails} 
                          placeholder="Añadir destinatarios..."
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-3 block flex items-center gap-2">
                          <Users className="h-4 w-4" /> Contactos Sugeridos
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {suggestedContacts.map((contact) => (
                            <div key={contact.email} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-brand-200 transition-all group">
                              <div>
                                <p className="text-sm font-bold text-slate-900">{contact.name}</p>
                                <p className="text-xs text-slate-500">{contact.role}</p>
                              </div>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 rounded-full bg-white shadow-sm border border-slate-100 text-brand-600 hover:bg-brand-600 hover:text-white"
                                onClick={() => addEmail(contact.email)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <Button disabled={emails.length === 0} className="gap-2 bg-brand-600 hover:bg-brand-700 text-white">
                          <Send className="h-4 w-4" /> Enviar Notificación
                        </Button>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>
              </div>
            </Tabs.Root>
          </Card>
        </div>
      )}
    </div>
  );
}
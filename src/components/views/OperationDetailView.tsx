import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmailInput } from "@/components/ui/email-input";
import { 
  FileText, 
  Mail, 
  Users, 
  Plus, 
  Send, 
  CheckCircle2,
  Building2,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export function OperationDetailView({ onBack }: { onBack: () => void }) {
  const [selectedDebtor, setSelectedDebtor] = React.useState("alicorp");
  const [emails, setEmails] = React.useState<string[]>([]);

  const suggestedContacts = [
    { name: "Juan Pérez", email: "jperez@alicorp.com.pe", role: "Tesorería" },
    { name: "Maria Lopez", email: "mlopez@alicorp.com.pe", role: "Contabilidad" },
  ];

  const addEmail = (email: string) => {
    if (!emails.includes(email)) {
      setEmails([...emails, email]);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-navy-50 text-navy-500">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-3">
            Operación OP-2024-001
            <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100">Verificada</Badge>
          </h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Left Sidebar: Debtors */}
        <Card className="lg:col-span-1 h-full overflow-hidden flex flex-col border-navy-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-navy-100">
            <CardTitle className="text-base text-navy-900">Deudores</CardTitle>
          </CardHeader>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <button
              onClick={() => setSelectedDebtor("alicorp")}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all flex items-center gap-3",
                selectedDebtor === "alicorp" 
                  ? "bg-brand-50 border border-brand-100 shadow-sm" 
                  : "hover:bg-navy-50 border border-transparent"
              )}
            >
              <div className="h-10 w-10 rounded-full bg-white border border-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs">
                AL
              </div>
              <div>
                <p className={cn("text-sm font-semibold", selectedDebtor === "alicorp" ? "text-brand-900" : "text-navy-900")}>Alicorp S.A.A.</p>
                <p className="text-xs text-navy-500">3 Facturas</p>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedDebtor("gloria")}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all flex items-center gap-3",
                selectedDebtor === "gloria" 
                  ? "bg-brand-50 border border-brand-100 shadow-sm" 
                  : "hover:bg-navy-50 border border-transparent"
              )}
            >
              <div className="h-10 w-10 rounded-full bg-white border border-navy-100 flex items-center justify-center text-navy-600 font-bold text-xs">
                GL
              </div>
              <div>
                <p className={cn("text-sm font-semibold", selectedDebtor === "gloria" ? "text-brand-900" : "text-navy-900")}>Gloria S.A.</p>
                <p className="text-xs text-navy-500">1 Factura</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Right Content: Tabs */}
        <Card className="lg:col-span-3 h-full overflow-hidden flex flex-col border-navy-100 shadow-sm">
          <Tabs.Root defaultValue="manage" className="flex-1 flex flex-col">
            <div className="px-6 pt-6 border-b border-navy-100">
              <Tabs.List className="flex gap-6">
                <Tabs.Trigger 
                  value="invoices"
                  className="pb-3 text-sm font-medium text-navy-500 data-[state=active]:text-brand-600 data-[state=active]:border-b-2 data-[state=active]:border-brand-600 transition-colors outline-none"
                >
                  Facturas (3)
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="report"
                  className="pb-3 text-sm font-medium text-navy-500 data-[state=active]:text-brand-600 data-[state=active]:border-b-2 data-[state=active]:border-brand-600 transition-colors outline-none"
                >
                  Reporte Dicom
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="manage"
                  className="pb-3 text-sm font-medium text-navy-500 data-[state=active]:text-brand-600 data-[state=active]:border-b-2 data-[state=active]:border-brand-600 transition-colors outline-none"
                >
                  Gestionar
                </Tabs.Trigger>
              </Tabs.List>
            </div>

            <div className="flex-1 overflow-y-auto bg-navy-50/30">
              <Tabs.Content value="invoices" className="p-6 outline-none">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-navy-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-navy-900">Factura F001-0000432{i}</p>
                          <p className="text-xs text-navy-500">Vence: 15 Mar 2024</p>
                        </div>
                      </div>
                      <span className="font-mono font-medium text-navy-700">S/ 12,500.00</span>
                    </div>
                  ))}
                </div>
              </Tabs.Content>

              <Tabs.Content value="report" className="p-6 outline-none">
                <div className="flex flex-col items-center justify-center h-64 text-navy-400">
                  <Building2 className="h-12 w-12 mb-3 opacity-20" />
                  <p>Vista previa del reporte de riesgo</p>
                </div>
              </Tabs.Content>

              <Tabs.Content value="manage" className="p-6 outline-none space-y-6">
                <div className="bg-white p-6 rounded-xl border border-navy-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-brand-500" />
                    Gestión de Notificaciones
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-navy-700 mb-2 block">Destinatarios Seleccionados</label>
                      <EmailInput 
                        value={emails} 
                        onChange={setEmails} 
                        placeholder="Añadir destinatarios..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-navy-700 mb-3 block flex items-center gap-2">
                        <Users className="h-4 w-4" /> Contactos Sugeridos
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {suggestedContacts.map((contact) => (
                          <div key={contact.email} className="flex items-center justify-between p-3 rounded-xl border border-navy-100 bg-navy-50 hover:bg-white hover:border-brand-200 transition-all group">
                            <div>
                              <p className="text-sm font-medium text-navy-900">{contact.name}</p>
                              <p className="text-xs text-navy-500">{contact.role}</p>
                            </div>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 rounded-full bg-white shadow-sm text-brand-600 hover:bg-brand-600 hover:text-white"
                              onClick={() => addEmail(contact.email)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-navy-100 flex justify-end">
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
    </div>
  );
}

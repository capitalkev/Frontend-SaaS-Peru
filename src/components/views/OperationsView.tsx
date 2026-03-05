import * as React from "react";
import { 
  MoreHorizontal, 
  Eye, 
  Send, 
  Download, 
  XCircle, 
  Search,
  Filter
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@radix-ui/react-dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const operations = [
  { id: "OP-2024-001", date: "24 Feb 2024", debtor: "Alicorp S.A.A.", amount: "S/ 45,200.00", status: "Verificada" },
  { id: "OP-2024-002", date: "23 Feb 2024", debtor: "Gloria S.A.", amount: "S/ 12,800.00", status: "En Verificación" },
  { id: "OP-2024-003", date: "22 Feb 2024", debtor: "San Fernando", amount: "S/ 8,500.00", status: "Rechazada" },
  { id: "OP-2024-004", date: "21 Feb 2024", debtor: "Cementos Pacasmayo", amount: "S/ 156,000.00", status: "Verificada" },
  { id: "OP-2024-005", date: "20 Feb 2024", debtor: "Unacem", amount: "S/ 23,400.00", status: "Verificada" },
  { id: "OP-2024-006", date: "19 Feb 2024", debtor: "Ferreyros", amount: "S/ 67,900.00", status: "En Verificación" },
];

export function OperationsView({ onNavigateToDetail }: { onNavigateToDetail: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Buscar por ID o Deudor..." 
            icon={<Search className="h-4 w-4" />} 
            className="w-full md:w-80 border-navy-100 focus:border-brand-500"
          />
          <Button variant="outline" size="icon" className="border-navy-100 text-navy-600 hover:bg-navy-50">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button className="bg-brand-600 text-white shadow-lg shadow-brand-200 hover:bg-brand-700">
          Exportar Reporte
        </Button>
      </div>

      <Card className="overflow-hidden border border-navy-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-navy-500 uppercase bg-navy-50/50 border-b border-navy-100">
              <tr>
                <th className="px-6 py-4 font-medium">ID Operación</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Deudor</th>
                <th className="px-6 py-4 font-medium">Monto</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {operations.map((op) => (
                <tr key={op.id} className="bg-white hover:bg-navy-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-brand-600">{op.id}</td>
                  <td className="px-6 py-4 text-navy-500">{op.date}</td>
                  <td className="px-6 py-4 font-medium text-navy-900">{op.debtor}</td>
                  <td className="px-6 py-4 font-mono text-navy-700">{op.amount}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={op.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-navy-100 text-navy-400 hover:text-navy-700">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white rounded-xl shadow-xl border border-navy-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <DropdownMenuItem onClick={() => onNavigateToDetail(op.id)} className="flex items-center gap-2 px-3 py-2 text-sm text-navy-700 hover:bg-brand-50 hover:text-brand-700 rounded-lg cursor-pointer outline-none">
                          <Eye className="h-4 w-4" /> Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onNavigateToDetail(op.id)} className="flex items-center gap-2 px-3 py-2 text-sm text-navy-700 hover:bg-brand-50 hover:text-brand-700 rounded-lg cursor-pointer outline-none">
                          <Send className="h-4 w-4" /> Reenviar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-navy-700 hover:bg-brand-50 hover:text-brand-700 rounded-lg cursor-pointer outline-none">
                          <Download className="h-4 w-4" /> Descargar
                        </DropdownMenuItem>
                        <div className="h-px bg-navy-50 my-1" />
                        <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer outline-none">
                          <XCircle className="h-4 w-4" /> Cancelar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Verificada":
      return <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100">Verificada</Badge>;
    case "En Verificación":
      return <Badge variant="warning" className="bg-gold-50 text-gold-700 border-gold-100 hover:bg-gold-100">En Verificación</Badge>;
    case "Rechazada":
      return <Badge variant="destructive" className="bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100">Rechazada</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

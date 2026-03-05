import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const data = [
  { name: 'Score', value: 850 },
  { name: 'Remaining', value: 150 },
];
const COLORS = ['#10b981', '#e2e8f0'];

export function ProfileView() {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900 via-violet-900 to-slate-900">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute bottom-0 left-0 p-8 flex items-end gap-6">
          <div className="h-24 w-24 rounded-xl bg-white p-1 shadow-xl">
            <div className="h-full w-full rounded-xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400">
              LOGO
            </div>
          </div>
          <div className="mb-2 text-white">
            <h1 className="text-3xl font-bold">Grupo Empresarial del Norte S.A.C.</h1>
            <div className="flex items-center gap-3 mt-2 text-indigo-200">
              <span className="flex items-center gap-1 text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Verificado
              </span>
              <span className="text-sm">RUC: 20100129211</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FactorScore */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>FactorScore</CardTitle>
            <p className="text-sm text-slate-500">Salud crediticia de tu empresa</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pb-8">
            <div className="relative h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="100%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center mb-4">
                <span className="text-4xl font-bold text-slate-900">850</span>
                <p className="text-sm font-medium text-emerald-600">Excelente</p>
              </div>
            </div>
            <p className="text-center text-sm text-slate-500 mt-4 px-6">
              Tu puntaje es superior al 92% de empresas en tu sector. Mantienes un historial impecable.
            </p>
          </CardContent>
        </Card>

        {/* Credit Limits & KYC */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Línea de Crédito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Utilizado</span>
                    <span className="font-medium text-slate-900">S/ 145,000 / S/ 500,000</span>
                  </div>
                  <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-indigo-600 w-[29%] rounded-full z-10"></div>
                    {/* Shimmer Effect */}
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer z-20"></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-right">Disponible: S/ 355,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de Verificación (KYC)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KycItem label="Identidad Legal" status="verified" />
                <KycItem label="Estados Financieros" status="verified" />
                <KycItem label="Cuentas Bancarias" status="pending" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KycItem({ label, status }: { label: string, status: 'verified' | 'pending' | 'rejected' }) {
  const isVerified = status === 'verified';
  return (
    <div className={cn(
      "p-4 rounded-xl border flex items-center gap-3 transition-colors",
      isVerified ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
    )}>
      <div className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center",
        isVerified ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
      )}>
        {isVerified ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className={cn("text-xs font-medium", isVerified ? "text-emerald-600" : "text-amber-600")}>
          {isVerified ? "Verificado" : "Pendiente"}
        </p>
      </div>
    </div>
  );
}

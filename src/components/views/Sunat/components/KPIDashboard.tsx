import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SunatMetrics } from "../types";
import { TrendingUp, Wallet } from "lucide-react";

// Función mock para formatear (asegúrate de tener tu utils/formatters listo)
const formatCurrency = (value: number, currency: 'PEN' | 'USD') => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(value);
};

export function KPIDashboard({ metrics }: { metrics: SunatMetrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Performance PEN */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Performance (PEN)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {metrics.PEN.winPercentage.toFixed(1)}%
              </h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${metrics.PEN.winPercentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Ganado: {formatCurrency(metrics.PEN.montoGanado, 'PEN')} / {formatCurrency(metrics.PEN.totalFacturado, 'PEN')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline PEN */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pipeline Activo (PEN)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatCurrency(metrics.PEN.montoDisponible, 'PEN')}
              </h3>
            </div>
            <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Monto disponible para factorizar</p>
        </CardContent>
      </Card>

      {/* Performance USD */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Performance (USD)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {metrics.USD.winPercentage.toFixed(1)}%
              </h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${metrics.USD.winPercentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Ganado: {formatCurrency(metrics.USD.montoGanado, 'USD')} / {formatCurrency(metrics.USD.totalFacturado, 'USD')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline USD */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Pipeline Activo (USD)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatCurrency(metrics.USD.montoDisponible, 'USD')}
              </h3>
            </div>
            <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Monto disponible para factorizar</p>
        </CardContent>
      </Card>
    </div>
  );
}
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SunatMetrics } from "../types";

const formatCurrency = (value: number, currency: "PEN" | "USD") => {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(value);
};

export function KPIDashboard({ metrics }: { metrics: SunatMetrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Performance PEN */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl">
        <CardContent className="p-3">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Perf. PEN
            </p>
            <h3 className="text-lg font-bold text-slate-900 leading-none">
              {metrics.PEN.winPercentage.toFixed(1)}%
            </h3>
          </div>
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${metrics.PEN.winPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-medium">
              <span className="text-slate-600">S/ {metrics.PEN.montoGanado.toLocaleString('es-PE')}</span>
              <span className="text-slate-400">S/ {metrics.PEN.totalFacturado.toLocaleString('es-PE')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline PEN */}
      <Card className="border-slate-200 shadow-sm bg-white rounded-xl">
        <CardContent className="p-3 flex flex-col justify-center h-full">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Pipeline (PEN)
          </p>
          <h3 className="text-lg font-bold text-slate-900 truncate">
            {formatCurrency(metrics.PEN.montoDisponible, "PEN")}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            Disponible para factorizar
          </p>
        </CardContent>
      </Card>

      {/* Performance USD */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl">
        <CardContent className="p-3">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Perf. USD
            </p>
            <h3 className="text-lg font-bold text-slate-900 leading-none">
              {metrics.USD.winPercentage.toFixed(1)}%
            </h3>
          </div>
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${metrics.USD.winPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-medium">
              <span className="text-slate-600">${metrics.USD.montoGanado.toLocaleString('es-PE')}</span>
              <span className="text-slate-400">${metrics.USD.totalFacturado.toLocaleString('es-PE')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline USD */}
      <Card className="border-slate-200 shadow-sm bg-white rounded-xl">
        <CardContent className="p-3 flex flex-col justify-center h-full">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Pipeline (USD)
          </p>
          <h3 className="text-lg font-bold text-slate-900 truncate">
            {formatCurrency(metrics.USD.montoDisponible, "USD")}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            Disponible para factorizar
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
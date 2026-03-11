import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  AlertCircle, 
  Clock,
  ArrowRight,
  MoreHorizontal,
  Calendar,
  Filter
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock data generator for different ranges
const getChartData = (range: string) => {
  if (range === '1y') {
    return [
      { name: 'Feb', desembolsos: 3200, recuperos: 2100, ingresos: 1800, gastos: 1200 },
      { name: 'Mar', desembolsos: 2800, recuperos: 2300, ingresos: 1900, gastos: 1100 },
      { name: 'Abr', desembolsos: 4100, recuperos: 3400, ingresos: 2500, gastos: 1600 },
      { name: 'May', desembolsos: 3500, recuperos: 2900, ingresos: 2200, gastos: 1400 },
      { name: 'Jun', desembolsos: 4800, recuperos: 3800, ingresos: 2800, gastos: 1900 },
      { name: 'Jul', desembolsos: 3900, recuperos: 4100, ingresos: 2600, gastos: 1800 },
      { name: 'Ago', desembolsos: 4200, recuperos: 3600, ingresos: 2700, gastos: 1700 },
      { name: 'Sep', desembolsos: 5100, recuperos: 4500, ingresos: 3100, gastos: 2100 },
      { name: 'Oct', desembolsos: 4600, recuperos: 4200, ingresos: 2900, gastos: 2000 },
      { name: 'Nov', desembolsos: 5300, recuperos: 4800, ingresos: 3300, gastos: 2300 },
      { name: 'Dic', desembolsos: 6100, recuperos: 5500, ingresos: 3800, gastos: 2600 },
      { name: 'Ene', desembolsos: 5800, recuperos: 5200, ingresos: 3600, gastos: 2400 },
    ];
  }
  if (range === 'ytd') {
    return [
      { name: 'Ene', desembolsos: 4000, recuperos: 2400, ingresos: 2100, gastos: 1500 },
      { name: 'Feb', desembolsos: 3000, recuperos: 1398, ingresos: 1800, gastos: 1200 },
      { name: 'Mar', desembolsos: 2000, recuperos: 9800, ingresos: 4500, gastos: 2800 },
      { name: 'Abr', desembolsos: 2780, recuperos: 3908, ingresos: 2300, gastos: 1600 },
      { name: 'May', desembolsos: 1890, recuperos: 4800, ingresos: 2600, gastos: 1700 },
      { name: 'Jun', desembolsos: 2390, recuperos: 3800, ingresos: 2400, gastos: 1500 },
      { name: 'Jul', desembolsos: 3490, recuperos: 4300, ingresos: 2900, gastos: 1900 },
    ];
  }
  // Default 6m
  return [
    { name: 'Ago', desembolsos: 2400, recuperos: 1800, ingresos: 1500, gastos: 900 },
    { name: 'Sep', desembolsos: 1398, recuperos: 2200, ingresos: 1600, gastos: 1000 },
    { name: 'Oct', desembolsos: 9800, recuperos: 5600, ingresos: 3800, gastos: 2200 },
    { name: 'Nov', desembolsos: 3908, recuperos: 2800, ingresos: 2100, gastos: 1300 },
    { name: 'Dic', desembolsos: 4800, recuperos: 3900, ingresos: 2700, gastos: 1600 },
    { name: 'Ene', desembolsos: 3800, recuperos: 4100, ingresos: 2500, gastos: 1500 },
  ];
};

export function DashboardView() {
  const [timeRange, setTimeRange] = useState('6m');
  const [metric, setMetric] = useState('operations'); // 'operations' | 'finance'

  const data = getChartData(timeRange);

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Cartera Activa" 
          value="S/ 450,230" 
          trend="+12.5%" 
          trendUp={true} 
          icon={DollarSign} 
        />
        <KpiCard 
          title="Desembolsos (Mes)" 
          value="S/ 128,400" 
          trend="+8.2%" 
          trendUp={true} 
          icon={TrendingUp} 
        />
        <KpiCard 
          title="DSO Promedio" 
          value="42 días" 
          trend="-2 días" 
          trendUp={true} 
          icon={Clock} 
        />
        <KpiCard 
          title="Índice de Mora" 
          value="3.2%" 
          trend="+0.4%" 
          trendUp={false} 
          icon={AlertCircle} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Chart */}
          <Card className="shadow-sm border border-navy-100 bg-white">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
              <div>
                <CardTitle>Desempeño Financiero</CardTitle>
                <p className="text-sm text-navy-500">
                  {metric === 'operations' ? 'Comparativa Desembolsos vs Recuperos' : 'Comparativa Ingresos vs Gastos'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Metric Selector */}
                <div className="bg-navy-50 p-1 rounded-lg flex items-center">
                  <button 
                    onClick={() => setMetric('operations')}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                      metric === 'operations' 
                        ? "bg-white text-navy-900 shadow-sm" 
                        : "text-navy-500 hover:text-navy-700"
                    )}
                  >
                    Operaciones
                  </button>
                  <button 
                    onClick={() => setMetric('finance')}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                      metric === 'finance' 
                        ? "bg-white text-navy-900 shadow-sm" 
                        : "text-navy-500 hover:text-navy-700"
                    )}
                  >
                    Finanzas
                  </button>
                </div>

                {/* Time Range Selector */}
                <div className="bg-navy-50 p-1 rounded-lg flex items-center">
                  <button 
                    onClick={() => setTimeRange('6m')}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                      timeRange === '6m' 
                        ? "bg-white text-navy-900 shadow-sm" 
                        : "text-navy-500 hover:text-navy-700"
                    )}
                  >
                    6M
                  </button>
                  <button 
                    onClick={() => setTimeRange('ytd')}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                      timeRange === 'ytd' 
                        ? "bg-white text-navy-900 shadow-sm" 
                        : "text-navy-500 hover:text-navy-700"
                    )}
                  >
                    YTD
                  </button>
                  <button 
                    onClick={() => setTimeRange('1y')}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                      timeRange === '1y' 
                        ? "bg-white text-navy-900 shadow-sm" 
                        : "text-navy-500 hover:text-navy-700"
                    )}
                  >
                    1A
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#D32F2F" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        padding: '12px 16px'
                      }}
                      cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={metric === 'operations' ? "desembolsos" : "ingresos"}
                      name={metric === 'operations' ? "Desembolsos" : "Ingresos"}
                      stroke="#D32F2F" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorPrimary)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#D32F2F' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={metric === 'operations' ? "recuperos" : "gastos"}
                      name={metric === 'operations' ? "Recuperos" : "Gastos"}
                      stroke="#D4AF37" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorSecondary)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#D4AF37' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Available Line (Moved here) */}
          <div className="rounded-xl bg-navy-900 p-6 text-white relative overflow-hidden shadow-xl shadow-navy-900/20">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-brand-600 blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-gold-500 blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-navy-200 uppercase tracking-wider">Línea Disponible</p>
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-6 tracking-tight text-white">S/ 145,000</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-navy-200">
                  <span>Utilizado: S/ 355,000</span>
                  <span>Total: S/ 500,000</span>
                </div>
                <div className="h-2 w-full bg-navy-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-gold-500 w-[70%] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Status */}
          <Card className="border border-navy-100 shadow-sm">
            <CardHeader>
              <CardTitle>Estado de Cartera</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <PortfolioProgress label="Vigente" value={75} color="bg-emerald-500" amount="S/ 337,672" />
              <PortfolioProgress label="Atraso Leve (1-15 días)" value={18} color="bg-gold-500" amount="S/ 81,041" />
              <PortfolioProgress label="Mora (>30 días)" value={7} color="bg-brand-500" amount="S/ 31,516" />
              
              <div className="mt-6 pt-6 border-t border-navy-50">
                <h4 className="font-semibold text-navy-900 mb-4 text-sm">Top 3 Deudores (Riesgo)</h4>
                <div className="space-y-3">
                  <DebtorRow name="Alicorp S.A.A." amount="S/ 120,000" risk="Bajo" />
                  <DebtorRow name="Gloria S.A." amount="S/ 85,500" risk="Medio" />
                  <DebtorRow name="San Fernando" amount="S/ 45,200" risk="Alto" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, trendUp, icon: Icon }: any) {
  return (
    <Card className="border border-navy-100 shadow-sm hover:shadow-md transition-all duration-200 bg-white rounded-xl">
      <div className="p-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-navy-500 mb-0.5">{title}</p>
          <h3 className="text-xl font-bold text-navy-900 tracking-tight">{value}</h3>
          <div className="mt-1.5">
            <Badge 
              variant={trendUp ? "success" : "destructive"} 
              className={cn(
                "px-1.5 py-0 text-[10px] font-medium border shadow-none",
                trendUp 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : "bg-rose-50 text-rose-700 border-rose-100"
              )}
            >
              {trend}
            </Badge>
          </div>
        </div>
        <div className="h-8 w-8 rounded-lg bg-gold-50 flex items-center justify-center text-gold-600 border border-gold-100">
           <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}

function PortfolioProgress({ label, value, color, amount }: any) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-navy-700">{label}</span>
        <span className="font-semibold text-navy-900">{amount}</span>
      </div>
      <div className="h-2.5 w-full bg-navy-50 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function DebtorRow({ name, amount, risk }: any) {
  const riskColors = {
    Bajo: "text-emerald-700 bg-emerald-50 border border-emerald-100",
    Medio: "text-gold-700 bg-gold-50 border border-gold-100",
    Alto: "text-rose-700 bg-rose-50 border border-rose-100",
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-navy-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-navy-100 flex items-center justify-center text-xs font-bold text-navy-600">
          {name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-navy-900">{name}</p>
          <p className="text-xs text-navy-500">{amount}</p>
        </div>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${riskColors[risk as keyof typeof riskColors]}`}>
        {risk}
      </span>
    </div>
  );
}

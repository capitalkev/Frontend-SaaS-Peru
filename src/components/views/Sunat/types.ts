export interface SunatMetricsCurrency {
  totalFacturado: number;
  montoGanado: number;
  montoDisponible: number;
  cantidad: number;
  winPercentage: number;
}

export interface SunatMetrics {
  PEN: SunatMetricsCurrency;
  USD: SunatMetricsCurrency;
}

export interface Invoice {
  id: string;
  ventaId: string;
  clientId: string;
  clientName: string;
  debtor: string;
  amount: number;
  montoNeto: number;
  currency: 'PEN' | 'USD';
  emissionDate: string;
  status: string;
  estado2: string | null;
  key: string;
  usuario: string;
  tieneNotaCredito: boolean;
}

export interface ClientOption {
  id: string;
  name: string;
  ruc: string;
}

export interface UserOption {
  email: string;
  nombre: string;
  rol?: string;
}
// src/components/views/EnvioCartas/types.ts

export interface DeudorCesion {
  id: string;
  ruc: string;
  nombre: string;
  correos: string[];
  pdfGenerado: string;
  pdfBase64: string;
  montoTotal: number;
}
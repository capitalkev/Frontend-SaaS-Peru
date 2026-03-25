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
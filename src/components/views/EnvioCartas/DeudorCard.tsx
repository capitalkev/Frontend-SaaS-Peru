// src/components/views/EnvioCartas/DeudorCard.tsx
import * as React from "react";
import { FileText, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmailInput } from "@/components/ui/email-input";
import { DeudorCesion } from "./types";

interface DeudorCardProps {
  key?: React.Key; // <-- Añade esta línea
  deudor: DeudorCesion;
  onUpdateCorreos: (id: string, correos: string[]) => void;
}

export function DeudorCard({ deudor, onUpdateCorreos }: DeudorCardProps) {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row">
        {/* LADO IZQUIERDO: Información del Documento */}
        <div className="lg:w-[50%] p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-center">
          <h4 className="font-bold text-lg text-slate-900 mb-1">{deudor.nombre}</h4>
          {deudor.ruc !== "N/A" && <p className="text-sm text-slate-500">RUC: {deudor.ruc}</p>}
          <p className="text-sm text-slate-500 mt-1 mb-5">
            Monto Total: <span className="font-semibold text-slate-700">S/ {deudor.montoTotal.toLocaleString('es-PE', {minimumFractionDigits: 2})}</span>
          </p>
          
          <div className="flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-50 px-3 py-2 rounded-lg border border-brand-100 mt-auto w-fit max-w-full">
            <FileText className="h-4 w-4 text-brand-600 shrink-0" />
            <span className="truncate">{deudor.pdfGenerado}</span>
          </div>
        </div>

        {/* LADO DERECHO: Asignación de Correos */}
        <div className="lg:w-[50%] p-6 lg:p-8 flex flex-col justify-center bg-slate-50/30">
          <label className="text-sm font-semibold text-slate-800 flex items-center gap-1 mb-1">
            Destinatarios de la Carta <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-3">Ingresa los correos y presiona Enter.</p>
          
          <EmailInput 
            value={deudor.correos} 
            onChange={(correos) => onUpdateCorreos(deudor.id, correos)} 
            placeholder="Ej: tesoreria@empresa.com"
          />
          
          {deudor.correos.length === 0 && (
            <p className="text-xs text-amber-600 flex items-center gap-1.5 mt-3 font-medium bg-amber-50 p-2.5 rounded-md border border-amber-100">
              <AlertCircle className="h-4 w-4 shrink-0" /> Faltan destinatarios para este envío.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
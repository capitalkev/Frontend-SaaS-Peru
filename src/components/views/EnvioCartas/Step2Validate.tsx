// src/components/views/EnvioCartas/Step2Validate.tsx
import * as React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeudorCard } from "./DeudorCard";
import { DeudorCesion } from "./types";

interface Step2Props {
  deudores: DeudorCesion[];
  updateCorreos: (id: string, nuevosCorreos: string[]) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function Step2Validate({ deudores, updateCorreos, onBack, onConfirm }: Step2Props) {
  return (
    <Card className="border-transparent shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl">Validación de Documentos y Correos</CardTitle>
        <p className="text-slate-500 text-sm">
          Se han generado <strong className="text-slate-800">{deudores.length} cartas de cesión</strong> exitosamente. Asigna los correos destinatarios.
        </p>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        {deudores.map((deudor) => (
          <DeudorCard key={deudor.id} deudor={deudor} onUpdateCorreos={updateCorreos} />
        ))}
      </CardContent>
      <CardFooter className="flex justify-between px-0 pt-6">
        <Button variant="outline" onClick={onBack} className="bg-white">
          <ChevronLeft className="mr-2 h-4 w-4" /> Volver atrás
        </Button>
        <Button onClick={onConfirm} className="bg-brand-600 hover:bg-brand-700 shadow-brand-200 min-w-[150px]">
          Confirmar y Continuar <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
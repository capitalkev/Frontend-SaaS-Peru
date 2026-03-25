// src/components/views/EnvioCartas/Step3Send.tsx
import * as React from "react";
import { CheckCircle2, ChevronLeft, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface Step3Props {
  deudoresCount: number;
  carpetaDriveNombre: string;
  isSending: boolean;
  isSuccess: boolean;
  onSend: () => void;
  onBack: () => void;
  onReset: () => void;
}

export function Step3Send({ deudoresCount, carpetaDriveNombre, isSending, isSuccess, onSend, onBack, onReset }: Step3Props) {
  return (
    <Card className="max-w-2xl mx-auto">
      {!isSuccess ? (
        <>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Confirmar Envío Masivo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center py-10">
            <div className="h-24 w-24 bg-brand-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-brand-50/50">
              <Send className="h-10 w-10 text-brand-600 ml-1" />
            </div>
            <p className="text-slate-600 text-lg mb-2">
              Estás a punto de procesar y enviar <strong className="text-slate-900 font-bold">{deudoresCount} cartas de cesión</strong>.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-md w-full text-sm text-slate-600 text-left space-y-2 mt-4">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Los PDFs se enviarán por Gmail a los correos asignados.</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Se guardará un respaldo automático en Google Drive.</p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> 
                Carpeta en Drive: <span className="font-mono text-xs font-semibold bg-white px-1.5 py-0.5 border border-slate-200 rounded">{carpetaDriveNombre}</span>
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
            <Button variant="outline" onClick={onBack} disabled={isSending}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
            <Button onClick={onSend} isLoading={isSending} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[220px] text-base h-12 shadow-emerald-200 shadow-lg">
              {isSending ? "Procesando..." : (
                <><Send className="mr-2 h-5 w-5" /> Enviar y Respaldar</>
              )}
            </Button>
          </CardFooter>
        </>
      ) : (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-16 flex flex-col items-center text-center">
          <div className="h-28 w-28 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-14 w-14" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-3">¡Envío Completado!</h3>
          <p className="text-slate-500 mb-8 max-w-md text-base">
            Las {deudoresCount} cartas de cesión han sido enviadas correctamente y se encuentran respaldadas en la nube.
          </p>
          <Button onClick={onReset} variant="outline" className="border-slate-200 h-11 px-6">
            Realizar un nuevo envío
          </Button>
        </motion.div>
      )}
    </Card>
  );
}
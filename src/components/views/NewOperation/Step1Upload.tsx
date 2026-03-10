import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import { FileText, X, ChevronRight, AlertCircle } from "lucide-react";

interface Step1Props {
  xmlFiles: File[];
  isExtracting: boolean;
  error: string | null;
  onDrop: (files: File[]) => void;
  onRemove: (index: number) => void;
  onNext: () => void;
}

export function Step1Upload({ xmlFiles, isExtracting, error, onDrop, onRemove, onNext }: Step1Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Carga de Documentos</CardTitle>
        <p className="text-slate-500">Sube los archivos XML de tus facturas para comenzar.</p>
      </CardHeader>
      <CardContent>
        <Dropzone 
          accept=".xml"
          onDrop={onDrop}
          label="Arrastra tus archivos XML aquí"
          sublabel="Soporta múltiples archivos. Máximo 10MB por archivo."
        />
        
        {xmlFiles.length > 0 && !isExtracting && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-700">Archivos Cargados ({xmlFiles.length}):</h4>
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {xmlFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 group">
                  <div className="flex items-center gap-3 text-sm text-slate-600 overflow-hidden">
                    <FileText className="h-4 w-4 text-brand-500 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs text-slate-500">{Math.round(file.size / 1024)} KB</span>
                    <button
                      onClick={() => onRemove(index)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                      title="Quitar archivo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {error && !isExtracting && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50/80 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5 px-4 py-3 bg-rose-100/50 border-b border-rose-100">
              <AlertCircle className="h-5 w-5 text-rose-600" />
              <h3 className="text-sm font-bold text-rose-800">
                No se puede continuar. Hay problemas con los siguientes archivos:
              </h3>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {/* Separamos el string por saltos de línea y lo renderizamos como lista */}
                {error.split('\n').map((err, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-rose-700 font-medium">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                    <span className="leading-snug">{err}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <Button onClick={onNext} disabled={xmlFiles.length === 0 || isExtracting}>
            {isExtracting ? "Procesando..." : "Continuar"} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
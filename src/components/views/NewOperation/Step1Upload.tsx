import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import { FileText, X, ChevronRight } from "lucide-react";

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
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm mt-4">
              <strong className="font-bold">Aviso: </strong>
              <span>{error}</span>
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
// src/components/views/EnvioCartas/Step1Upload.tsx
import * as React from "react";
import { FileSpreadsheet, X, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/input";

interface Step1Props {
  excelFile: File | null;
  setExcelFile: (file: File | null) => void;
  fechaIngreso: string;
  setFechaIngreso: (date: string) => void;
  isExtracting: boolean;
  onProcessExcel: () => void;
}

export function Step1Upload({ excelFile, setExcelFile, fechaIngreso, setFechaIngreso, isExtracting, onProcessExcel }: Step1Props) {
  const maxDateToday = new Date().toISOString().split("T")[0];

  const handleDropExcel = (files: File[]) => {
    if (files.length > 0) setExcelFile(files[0]);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Generación de Cartas de Cesión</CardTitle>
        <p className="text-slate-500">Sube el archivo Excel de facturas y define la fecha de ingreso para generar automáticamente los PDFs.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Dropzone 
          accept=".xlsx, .xls"
          onDrop={handleDropExcel}
          label="Arrastra tu archivo Excel aquí"
          sublabel="Soporta formatos .xlsx o .xls"
        />
        
        {excelFile && (
          <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-100">
            <div className="flex items-center gap-3 text-sm text-emerald-800">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">{excelFile.name}</span>
              <span className="text-emerald-600/70 text-xs">({(excelFile.size / 1024).toFixed(1)} KB)</span>
            </div>
            <button onClick={() => setExcelFile(null)} className="text-emerald-600 hover:text-red-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="space-y-2 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <label className="text-sm font-semibold text-slate-800 block">
            Filtrar Fecha Ingreso Desde <span className="text-brand-600">*</span>
          </label>
          <Input 
            type="date"
            max={maxDateToday}
            value={fechaIngreso}
            onChange={(e) => setFechaIngreso(e.target.value)}
            className="max-w-sm bg-white"
          />
          <p className="text-xs text-slate-500 mt-1.5">Solo se procesarán las facturas con fecha de ingreso igual o posterior a la indicada.</p>
        </div>
        
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button 
            onClick={onProcessExcel} 
            disabled={!excelFile || !fechaIngreso || isExtracting} 
            isLoading={isExtracting}
            className="bg-brand-600 hover:bg-brand-700 text-white min-w-[200px]"
          >
            {isExtracting ? "Analizando y Generando..." : "Procesar Archivo"} {!isExtracting && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
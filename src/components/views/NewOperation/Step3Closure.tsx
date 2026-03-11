import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropzone } from "@/components/ui/dropzone";
import { Toggle } from "@/components/ui/toggle";
import { DollarSign, Percent, ChevronLeft, FileText, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step3Props {
  comentario: string;
  setComentario: (val: string) => void;
  additionalDocs: File[];
  setAdditionalDocs: React.Dispatch<React.SetStateAction<File[]>>;
  requestAdvance: boolean;
  setRequestAdvance: (val: boolean) => void;
  advancePercent: string;
  setAdvancePercent: (val: string) => void;
  bank: string;
  setBank: (val: string) => void;
  accountType: string;
  setAccountType: (val: string) => void;
  currency: string;
  setCurrency: (val: string) => void;
  accountNumber: string;
  setAccountNumber: (val: string) => void;
  error: string | null;
  loading: boolean;
  onFinish: () => void;
  onBack: () => void;
}

export function Step3Closure({
  comentario, setComentario, additionalDocs, setAdditionalDocs,
  requestAdvance, setRequestAdvance, advancePercent, setAdvancePercent,
  bank, setBank, accountType, setAccountType, currency, setCurrency,
  accountNumber, setAccountNumber, error, loading, onFinish, onBack
}: Step3Props) {
  
  const removeAdditionalDoc = (indexToRemove: number) => {
    setAdditionalDocs(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  // Clases compartidas para el foco personalizado de los selects
  const selectClasses = "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:border-brand-500 focus-visible:ring-4 focus-visible:ring-brand-500/10";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Cierre y Envío</CardTitle>
          <p className="text-slate-500 text-sm">Completa los últimos detalles para registrar la operación.</p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Área de Comentario Mejorada */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-brand-500" />
              Comentario de la Operación <span className="text-red-500">*</span>
            </label>
            <textarea 
              placeholder="Ingresa los detalles, condiciones especiales o notas importantes sobre esta operación..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className={cn(
                "flex w-full min-h-[100px] resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-700 transition-all duration-200",
                "placeholder:text-slate-400",
                "focus-visible:bg-white focus-visible:outline-none focus-visible:border-brand-500 focus-visible:ring-4 focus-visible:ring-brand-500/10"
              )}
            />
          </div>

          {/* Respaldos Adicionales */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-sm font-medium text-slate-700 mb-2 block">Documentos Adicionales (Opcional)</label>
            <Dropzone 
              onDrop={(acceptedFiles) => setAdditionalDocs(prev => [...prev, ...acceptedFiles])}
              label="Abjuntos de respaldo" 
              className="h-32" 
            />
            {additionalDocs.length > 0 && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                {additionalDocs.map((file, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 group">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-3.5 w-3.5 text-sky-500 flex-shrink-0" />
                      <span className="truncate text-xs font-medium text-slate-600">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeAdditionalDoc(i)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors flex-shrink-0 ml-2"
                      title="Quitar archivo"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Adelanto */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="font-semibold text-slate-900">¿Solicitar Adelanto?</span>
              </div>
              <Toggle checked={requestAdvance} onCheckedChange={setRequestAdvance} />
            </div>
            
            <AnimatePresence>
              {requestAdvance && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Porcentaje Solicitado</label>
                    <Input 
                      value={advancePercent} 
                      onChange={(e) => setAdvancePercent(e.target.value)}
                      icon={<Percent className="h-4 w-4" />}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cuenta Bancaria */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700">Cuenta de Desembolso *</label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <select value={bank} onChange={(e) => setBank(e.target.value)} className={selectClasses}>
                  <option value="" disabled>Seleccione Banco...</option>
                  <option value="BCP">BCP</option>
                  <option value="Interbank">Interbank</option>
                  <option value="BBVA">BBVA</option>
                  <option value="Scotiabank">Scotiabank</option>
                  <option value="BanBif">BanBif</option>
                  <option value="Pichincha">Pichincha</option>
                  <option value="GNB">GNB</option>
                  <option value="Mibanco">Mibanco</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="space-y-2">
                <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className={selectClasses}>
                  <option value="" disabled>Seleccione Cuenta</option>
                  <option value="Corriente">Corriente</option>
                  <option value="Ahorros">Ahorros</option>
                </select>
              </div>

              <div className="space-y-2">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={selectClasses}>
                  <option value="" disabled>Moneda</option>
                  <option value="Soles">Soles</option>
                  <option value="Dolares">Dólares</option>
                </select>
              </div>

              <div className="space-y-2">
                <Input 
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Número de Cuenta"
                  className="bg-white"
                />
              </div>
            </div>
          </div>
          {error && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm relative mt-4" role="alert">
              <strong className="font-bold">Aviso: </strong>
              <span>{error}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
          <Button variant="outline" onClick={onBack} disabled={loading}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
          </Button>
          <Button onClick={onFinish} isLoading={loading} className="bg-brand-600 hover:bg-brand-700 text-white min-w-[180px]">
            {loading ? "Procesando..." : "Registrar Operación"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
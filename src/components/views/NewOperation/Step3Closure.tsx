import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropzone } from "@/components/ui/dropzone";
import { Toggle } from "@/components/ui/toggle";
import { DollarSign, Percent, ChevronLeft, FileText, X } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cierre y Envío</CardTitle>
          <p className="text-slate-500">Agregar Comentario a la operacion.</p>
          <div className="space-y-2 mt-2">
            <Input 
              placeholder="Comentario (opcional)"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Respaldos Adicionales */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Documentos Adicionales (Opcional)</label>
            <Dropzone 
              onDrop={(acceptedFiles) => setAdditionalDocs(prev => [...prev, ...acceptedFiles])}
              label="Contratos o Guías Generales" 
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
                <select 
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
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
                <select 
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <option value="" disabled>Seleccione Cuenta</option>
                  <option value="Corriente">Corriente</option>
                  <option value="Ahorros">Ahorros</option>
                </select>
              </div>

              <div className="space-y-2">
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm relative" role="alert">
              <strong className="font-bold">Error: </strong>
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
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropzone } from "@/components/ui/dropzone";
import { Toggle } from "@/components/ui/toggle";
import { EmailInput } from "@/components/ui/email-input";
import { Badge } from "@/components/ui/badge";
import { Percent, ChevronRight, ChevronLeft, AlertCircle, FileText, X } from "lucide-react";
import { Debtor } from "./types";

interface Step2Props {
  rate: string;
  setRate: (val: string) => void;
  commission: string;
  setCommission: (val: string) => void;
  bulkSend: boolean;
  setBulkSend: (val: boolean) => void;
  globalEmails: string[];
  setGlobalEmails: (val: string[]) => void;
  debtors: Debtor[];
  updateDebtorSustentos: (id: string, files: File[]) => void;
  removeDebtorSustento: (id: string, index: number) => void;
  updateDebtorEmails: (id: string, emails: string[]) => void;
  error: string | null;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Config({
  rate, setRate, commission, setCommission, bulkSend, setBulkSend,
  globalEmails, setGlobalEmails, debtors, updateDebtorSustentos,
  removeDebtorSustento, updateDebtorEmails, error, onNext, onBack
}: Step2Props) {
  return (
    <div className="space-y-6">
      {/* Condiciones Generales */}
      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle>Condiciones Generales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tasa Aplicada <span className="text-red-500">*</span></label>
            <Input 
              value={rate} 
              onChange={(e) => setRate(e.target.value)}
              icon={<Percent className="h-4 w-4" />}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Comisión Fija <span className="text-red-500">*</span></label>
            <Input 
              value={commission} 
              onChange={(e) => setCommission(e.target.value)}
              icon={<span className="text-xs font-bold">S/</span>}
              placeholder="0.00"
            />
          </div>
        </CardContent>
      </Card>

      {/* Gestión de Notificaciones */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestión de Notificaciones</CardTitle>
            <p className="text-sm text-slate-500">Configura a quién se enviarán los sustentos.</p>
          </div>
          <Toggle checked={bulkSend} onCheckedChange={setBulkSend} label="Envío en Conjunto" />
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence>
            {bulkSend && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-sky-50 p-4 rounded-xl border border-sky-200 mb-4 shadow-sm">
                  <label className="text-sm font-semibold text-sky-900 mb-2 block">Destinatarios Globales</label>
                  <EmailInput 
                    value={globalEmails} 
                    onChange={setGlobalEmails} 
                    placeholder="ingresa.correos@empresa.com"
                  />
                  <p className="text-xs text-sky-700 mt-2.5 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    Todos los sustentos se enviarán a esta lista de correos.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {debtors.map((debtor) => (
              <div key={debtor.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Info */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">{debtor.name}</h4>
                      <Badge variant="secondary">{debtor.xmlCount} Facturas</Badge>
                    </div>
                    <div className="space-y-2">
                      {debtor.documents.map((doc, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <FileText className="h-3 w-3 text-brand-500" />
                          <span>{doc.document_id} • S/ {doc.total_amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Dropzone & Email */}
                  <div className="space-y-4">
                    <Dropzone 
                      small 
                      onDrop={(acceptedFiles) => updateDebtorSustentos(debtor.id, acceptedFiles)}
                      label="Adjuntar Sustentos" 
                      className="h-24"
                    />
                    
                    {debtor.sustentos.length > 0 && (
                      <div className="text-xs text-slate-500 space-y-1.5 mt-3">
                        {debtor.sustentos.map((file, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 group">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="h-3.5 w-3.5 text-sky-500 flex-shrink-0" />
                              <span className="truncate font-medium">{file.name}</span>
                            </div>
                            <button
                              onClick={() => removeDebtorSustento(debtor.id, i)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors flex-shrink-0 ml-2"
                              title="Quitar sustento"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {!bulkSend ? (
                      <EmailInput 
                        value={debtor.emails} 
                        onChange={(emails) => updateDebtorEmails(debtor.id, emails)}
                        placeholder={`Correos para ${debtor.name}`}
                      />
                    ) : (
                      <div className="h-[44px] flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-400 italic">
                        Usando envío global
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mt-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t border-slate-100 mt-4">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
          </Button>
          <Button onClick={onNext}>
            Continuar <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
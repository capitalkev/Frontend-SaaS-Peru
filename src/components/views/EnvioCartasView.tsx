import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ChevronRight, ChevronLeft, FileSpreadsheet, Send, FileText, X, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import { EmailInput } from "@/components/ui/email-input";
import { cn } from "@/lib/utils";

// Tipado para la data simulada
interface DeudorCesion {
  id: string;
  ruc: string;
  nombre: string;
  correos: string[];
  pdfGenerado: string;
  montoTotal: number;
}

export function EnvioCartasView() {
  const [step, setStep] = React.useState(1);
  const [excelFile, setExcelFile] = React.useState<File | null>(null);
  
  // Estados de carga visual
  const [isExtracting, setIsExtracting] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false); // Para mostrar pantalla de éxito
  
  // Data simulada que aparecerá tras "procesar" el Excel
  const [deudores, setDeudores] = React.useState<DeudorCesion[]>([]);

  // PASO 1: Subir Excel visualmente
  const handleDropExcel = (files: File[]) => {
    if (files.length > 0) {
      setExcelFile(files[0]);
    }
  };

  const handleProcessExcel = () => {
    if (!excelFile) return;
    setIsExtracting(true);
    
    // Simulamos que el sistema lee el Excel y tarda 2 segundos en responder
    setTimeout(() => {
      setDeudores([
        { 
          id: "1", 
          ruc: "20512345678", 
          nombre: "Alicorp S.A.A.", 
          correos: ["tesoreria@alicorp.pe"], 
          pdfGenerado: "Carta_Cesion_Alicorp_001.pdf", 
          montoTotal: 120500.00 
        },
        { 
          id: "2", 
          ruc: "20100129211", 
          nombre: "Gloria S.A.", 
          correos: ["pagos@gloria.com.pe", "finanzas@gloria.com.pe"], 
          pdfGenerado: "Carta_Cesion_Gloria_002.pdf", 
          montoTotal: 85000.00 
        },
        { 
          id: "3", 
          ruc: "20263322496", 
          nombre: "Supermercados Peruanos S.A.", 
          correos: ["proveedores@spsa.pe"], 
          pdfGenerado: "Carta_Cesion_SPSA_003.pdf", 
          montoTotal: 45200.50 
        },
      ]);
      setIsExtracting(false);
      setStep(2);
    }, 2000);
  };

  // PASO 2: Visualizar y editar
  const updateCorreos = (id: string, nuevosCorreos: string[]) => {
    setDeudores(prev => prev.map(d => d.id === id ? { ...d, correos: nuevosCorreos } : d));
  };

  const handleNextToConfirm = () => {
    setStep(3);
  };

  // PASO 3: Confirmar y mostrar éxito
  const handleSend = () => {
    setIsSending(true);
    
    // Simulamos el tiempo de envío de correos (2.5 segundos)
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
    }, 2500);
  };

  const handleReset = () => {
    setStep(1);
    setExcelFile(null);
    setDeudores([]);
    setIsSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stepper (Barra de progreso visual) */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2 bg-[#f4f7fe] px-2">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                step >= s ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-200" : "bg-white border-slate-300 text-slate-400"
              )}>
                {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
              </div>
              <span className={cn("text-xs font-medium", step >= s ? "text-brand-700" : "text-slate-400")}>
                {s === 1 && "Carga Excel"}
                {s === 2 && "Validación"}
                {s === 3 && "Envío"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ================= PASO 1 ================= */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card>
              <CardHeader>
                <CardTitle>Cargar Base de Deudores</CardTitle>
                <p className="text-slate-500">Sube el archivo Excel con la información para generar automáticamente los PDFs de cesión.</p>
              </CardHeader>
              <CardContent>
                <Dropzone 
                  accept=".xlsx, .xls, .csv"
                  onDrop={handleDropExcel}
                  label="Arrastra tu archivo Excel aquí"
                  sublabel="Soporta formatos .xlsx o .csv"
                />
                
                {excelFile && (
                  <div className="mt-4 flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-100">
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
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <Button 
                    onClick={handleProcessExcel} 
                    disabled={!excelFile || isExtracting} 
                    isLoading={isExtracting}
                    className="bg-brand-600 hover:bg-brand-700 text-white"
                  >
                    {isExtracting ? "Analizando y Generando PDFs..." : "Procesar Archivo"} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ================= PASO 2 ================= */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card>
              <CardHeader>
                <CardTitle>Validación de Documentos y Correos</CardTitle>
                <p className="text-slate-500 text-sm">El sistema ha generado {deudores.length} PDFs exitosamente. Verifica los correos de destino antes de continuar.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {deudores.map((deudor) => (
                  <div key={deudor.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-brand-300 transition-colors">
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* Info del PDF Generado */}
                      <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-slate-900">{deudor.nombre}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">RUC: {deudor.ruc} • Monto Total: S/ {deudor.montoTotal.toLocaleString('es-PE', {minimumFractionDigits: 2})}</p>
                        
                        <div className="flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-50 p-2.5 rounded-lg border border-brand-100 w-fit">
                          <FileText className="h-4 w-4 text-brand-600" />
                          {deudor.pdfGenerado}
                        </div>
                      </div>

                      {/* Inputs de Correo */}
                      <div className="lg:w-1/2 flex flex-col justify-center space-y-2">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          Destinatarios <span className="text-red-500">*</span>
                        </label>
                        <EmailInput 
                          value={deudor.correos} 
                          onChange={(correos) => updateCorreos(deudor.id, correos)} 
                          placeholder="Añadir correo y presionar Enter..."
                        />
                        {deudor.correos.length === 0 && (
                          <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" /> Faltan destinatarios para este envío.
                          </p>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
                <Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="mr-2 h-4 w-4" /> Volver</Button>
                <Button onClick={handleNextToConfirm} className="bg-brand-600 hover:bg-brand-700">
                  Continuar <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* ================= PASO 3 ================= */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card>
              {!isSuccess ? (
                <>
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl">Confirmar Envío Masivo</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center text-center py-8">
                    <div className="h-24 w-24 bg-brand-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-brand-50/50">
                      <Send className="h-10 w-10 text-brand-600 ml-1" />
                    </div>
                    <p className="text-slate-600 max-w-md text-lg">
                      Estás a punto de enviar <strong className="text-slate-900 font-bold">{deudores.length} cartas de cesión</strong> adjuntas en formato PDF.
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      Los correos se enviarán de forma automática a los destinatarios configurados.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
                    <Button variant="outline" onClick={() => setStep(2)} disabled={isSending}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Volver
                    </Button>
                    <Button onClick={handleSend} isLoading={isSending} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[200px] text-base h-12">
                      {isSending ? "Enviando Correos..." : (
                        <><Send className="mr-2 h-5 w-5" /> Confirmar y Enviar</>
                      )}
                    </Button>
                  </CardFooter>
                </>
              ) : (
                /* PANTALLA DE ÉXITO */
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 flex flex-col items-center text-center">
                  <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Envío Completado!</h3>
                  <p className="text-slate-500 mb-8 max-w-md">
                    Se han enviado las {deudores.length} cartas de cesión correctamente a sus respectivos destinatarios.
                  </p>
                  <Button onClick={handleReset} variant="outline" className="border-slate-200">
                    Realizar otro envío
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

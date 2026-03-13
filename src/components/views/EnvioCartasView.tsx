import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ChevronRight, ChevronLeft, FileSpreadsheet, Send, FileText, X, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import { EmailInput } from "@/components/ui/email-input";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// --- TIPADOS ---
interface DeudorCesion {
  id: string;
  ruc: string;
  nombre: string;
  correos: string[];
  pdfGenerado: string;
  pdfBase64: string;
  montoTotal: number;
}

// --- UTILIDAD PARA FECHAS ---
// HTML date input usa YYYY-MM-DD, pero tu backend requiere DD-MM-YYYY
const formatToBackendDate = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

// --- COMPONENTE DE VISTA PREVIA HTML ---
const CartaCesionHtmlPreview: React.FC<{ deudor: DeudorCesion }> = ({ deudor }) => {
  const fechaActual = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });
  const ciudad = "San Isidro";

  return (
    <div className="bg-white p-6 sm:p-8 shadow-sm border border-slate-200 rounded-lg font-sans text-xs sm:text-sm text-slate-800 leading-relaxed max-w-[210mm] w-full mx-auto select-none">
      <div className="text-right mb-6 sm:mb-8">
        <p>{ciudad}, {fechaActual}</p>
      </div>
      <div className="mb-6">
        <p className="font-semibold text-slate-950">Señores</p>
        <p className="font-bold text-sm sm:text-base text-slate-950">{deudor.nombre}</p>
        <p className="font-semibold text-slate-950 mt-3">Presente.-</p>
      </div>
      <div className="mb-4">
        <p>Estimados señores:</p>
      </div>
      <div className="space-y-3 mb-6 text-justify">
        <p>
          Por medio de la presente, les informamos que las siguientes facturas han sido cedidas a nuestro aliado estratégico <span className="font-semibold text-slate-950">PUERTO X PERU S.A.C.</span>:
        </p>
      </div>
      <div className="mb-6 border border-slate-300 rounded-lg overflow-hidden">
        <table className="w-full text-left text-[11px] sm:text-xs">
          <thead className="bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="px-3 py-2 font-bold text-slate-700">Tipo de Documento</th>
              <th className="px-3 py-2 font-bold text-slate-700 text-right">Importe Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="px-3 py-2">Factura</td>
              <td className="px-3 py-2 font-medium text-slate-950 text-right">
                S/ {(deudor.montoTotal).toLocaleString('es-PE', {minimumFractionDigits: 2})}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="space-y-3 mb-8 text-justify">
        <p>
          Por lo antes indicado, les solicitamos que al vencimiento el pago sea efectuado a las respectivas cuentas bancarias del Banco de Crédito:
        </p>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <p className="font-semibold mb-1">Cuentas BCP:</p>
          <ul className="list-disc list-inside pl-4 text-slate-600 space-y-1">
            <li>Cta. Corriente Soles: 191-9283320-0-07</li>
            <li>Cta. Corriente Dólares: 191-7394480-1-25</li>
          </ul>
        </div>
        <p>Quedamos atentos a cualquier consulta adicional.</p>
      </div>
      <div className="mt-8 text-left max-w-sm">
        <p>Atentamente,</p>
        <div className="mt-12">
          <p className="text-slate-400 mb-1">______________________________</p>
          <p className="font-bold text-slate-950">Widad Naiza</p>
          <p className="text-xs text-slate-600">Ejecutiva de Cobranza</p>
        </div>
      </div>
    </div>
  );
};

// --- SUBCOMPONENTE PARA TARJETA EXPANDIBLE ---
const DeudorCard = ({ deudor, onUpdateCorreos }: { deudor: DeudorCesion, onUpdateCorreos: (id: string, c: string[]) => void }) => {
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

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
          
          <div className="flex items-center justify-between gap-4 mt-auto">
            <div className="flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-50 px-3 py-2 rounded-lg border border-brand-100 truncate flex-1">
              <FileText className="h-4 w-4 text-brand-600 shrink-0" />
              <span className="truncate">{deudor.pdfGenerado}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className="shrink-0 text-xs h-9"
            >
              {isPreviewOpen ? <><EyeOff className="w-4 h-4 mr-1.5 text-slate-500" /> Ocultar Carta</> : <><Eye className="w-4 h-4 mr-1.5 text-brand-600" /> Ver Carta</>}
            </Button>
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

      {/* ZONA INFERIOR: Vista Previa Colapsable */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-100 border-t border-slate-200"
          >
            <div className="p-6 md:p-8 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Vista Previa de la Carta Generada</span>
              <CartaCesionHtmlPreview deudor={deudor} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// --- COMPONENTE PRINCIPAL ---
export function EnvioCartasView() {
  const [step, setStep] = React.useState(1);
  const [excelFile, setExcelFile] = React.useState<File | null>(null);
  const [fechaIngreso, setFechaIngreso] = React.useState("");
  
  // Limitar el calendario hasta la fecha de hoy
  const maxDateToday = new Date().toISOString().split("T")[0];

  const [isExtracting, setIsExtracting] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [deudores, setDeudores] = React.useState<DeudorCesion[]>([]);

  const handleDropExcel = (files: File[]) => {
    if (files.length > 0) setExcelFile(files[0]);
  };

  const handleProcessExcel = async () => {
    if (!excelFile) return;
    if (!fechaIngreso.trim()) {
      alert("Por favor, selecciona la fecha desde la cual filtrar.");
      return;
    }

    setIsExtracting(true);
    try {
      // Formateamos "YYYY-MM-DD" -> "DD-MM-YYYY" para el backend
      const fechaParaBackend = formatToBackendDate(fechaIngreso);
      const response = await api.procesarExcelCesion(excelFile, fechaParaBackend);
      setDeudores(response.data);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar el documento. Verifica el formato o tus permisos de usuario.");
    } finally {
      setIsExtracting(false);
    }
  };

  const updateCorreos = (id: string, nuevosCorreos: string[]) => {
    setDeudores(prev => prev.map(d => d.id === id ? { ...d, correos: nuevosCorreos } : d));
  };

  const handleNextToConfirm = () => {
    const algunCorreoVacio = deudores.some(d => d.correos.length === 0);
    if (algunCorreoVacio) {
      const confirmar = window.confirm("Algunos deudores no tienen correos asignados. ¿Deseas continuar de todas formas?");
      if (!confirmar) return;
    }
    setStep(3);
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      const pdfsToUpload: File[] = [];
      const configuracionEnvios: any[] = [];

      for (const deudor of deudores) {
        const resBase64 = await fetch(`data:application/pdf;base64,${deudor.pdfBase64}`);
        const blob = await resBase64.blob();
        const file = new File([blob], deudor.pdfGenerado, { type: 'application/pdf' });
        
        pdfsToUpload.push(file);
        configuracionEnvios.push({
          filename: deudor.pdfGenerado,
          correos: deudor.correos
        });
      }

      const fechaParaBackend = formatToBackendDate(fechaIngreso);
      await api.enviarCartasCesion(pdfsToUpload, configuracionEnvios, fechaParaBackend);
      
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar las cartas. Revisa la consola para más detalles.");
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setExcelFile(null);
    setFechaIngreso("");
    setDeudores([]);
    setIsSuccess(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Stepper Superior */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative max-w-3xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2 bg-[#f4f7fe] px-4">
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
          <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl mx-auto">
            <Card>
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
                    onClick={handleProcessExcel} 
                    disabled={!excelFile || !fechaIngreso || isExtracting} 
                    isLoading={isExtracting}
                    className="bg-brand-600 hover:bg-brand-700 text-white min-w-[200px]"
                  >
                    {isExtracting ? "Analizando y Generando..." : "Procesar Archivo"} {!isExtracting && <ChevronRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ================= PASO 2 ================= */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="border-transparent shadow-none bg-transparent">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">Validación de Documentos y Correos</CardTitle>
                <p className="text-slate-500 text-sm">Se han generado <strong className="text-slate-800">{deudores.length} cartas de cesión</strong> exitosamente. Revisa la vista previa y asigna los correos destinatarios.</p>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                
                {/* Mapeo usando el nuevo componente DeudorCard expandible */}
                {deudores.map((deudor) => (
                  <DeudorCard key={deudor.id} deudor={deudor} onUpdateCorreos={updateCorreos} />
                ))}

              </CardContent>
              <CardFooter className="flex justify-between px-0 pt-6">
                <Button variant="outline" onClick={() => setStep(1)} className="bg-white"><ChevronLeft className="mr-2 h-4 w-4" /> Volver atrás</Button>
                <Button onClick={handleNextToConfirm} className="bg-brand-600 hover:bg-brand-700 shadow-brand-200 min-w-[150px]">
                  Confirmar y Continuar <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* ================= PASO 3 ================= */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto">
            <Card>
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
                      Estás a punto de procesar y enviar <strong className="text-slate-900 font-bold">{deudores.length} cartas de cesión</strong>.
                    </p>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-md w-full text-sm text-slate-600 text-left space-y-2 mt-4">
                      <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Los PDFs se enviarán por Gmail a los correos asignados.</p>
                      <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Se guardará un respaldo automático en Google Drive.</p>
                      <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> Carpeta en Drive: <span className="font-mono text-xs font-semibold bg-white px-1.5 py-0.5 border border-slate-200 rounded">Cartas de cesión - {formatToBackendDate(fechaIngreso)}</span></p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
                    <Button variant="outline" onClick={() => setStep(2)} disabled={isSending}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Volver
                    </Button>
                    <Button onClick={handleSend} isLoading={isSending} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[220px] text-base h-12 shadow-emerald-200 shadow-lg">
                      {isSending ? "Procesando..." : (
                        <><Send className="mr-2 h-5 w-5" /> Enviar y Respaldar</>
                      )}
                    </Button>
                  </CardFooter>
                </>
              ) : (
                /* PANTALLA DE ÉXITO */
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-16 flex flex-col items-center text-center">
                  <div className="h-28 w-28 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-14 w-14" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">¡Envío Completado!</h3>
                  <p className="text-slate-500 mb-8 max-w-md text-base">
                    Las {deudores.length} cartas de cesión han sido enviadas correctamente y se encuentran respaldadas en la nube.
                  </p>
                  <Button onClick={handleReset} variant="outline" className="border-slate-200 h-11 px-6">
                    Realizar un nuevo envío
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
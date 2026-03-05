import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropzone } from "@/components/ui/dropzone";
import { Toggle } from "@/components/ui/toggle";
import { EmailInput } from "@/components/ui/email-input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { processOperation, FrontendData, extractDebtors } from "@/lib/api";
import { 
  CheckCircle2, 
  FileText, 
  Percent, 
  DollarSign, 
  ChevronRight, 
  ChevronLeft, 
  Upload,
  AlertCircle
} from "lucide-react";
import { ExtractedDocument } from "@/lib/api";

interface Debtor {
  id: string;
  name: string;
  xmlCount: number;
  emails: string[];
  sustentos: File[];
  documents: ExtractedDocument[];
}

export function NewOperationView({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Step 1 State
  const [xmlFiles, setXmlFiles] = React.useState<File[]>([]);
  const [isExtracting, setIsExtracting] = React.useState(false);

  // Step 2 State
  const [rate, setRate] = React.useState("");
  const [commission, setCommission] = React.useState("");
  const [bulkSend, setBulkSend] = React.useState(false);
  const [globalEmails, setGlobalEmails] = React.useState<string[]>([]);
  const [clientName, setClientName] = React.useState("");
  const [clientRuc, setClientRuc] = React.useState("");
  
  // Los deudores ahora se inicializan como un array vacío.
  const [debtors, setDebtors] = React.useState<Debtor[]>([]);

  // Step 3 State
  const [comentario, setComentario] = React.useState("");
  const [additionalDocs, setAdditionalDocs] = React.useState<File[]>([]);
  const [requestAdvance, setRequestAdvance] = React.useState(false);
  const [advancePercent, setAdvancePercent] = React.useState("80");
  
  // Bank Account State
  const [bank, setBank] = React.useState("");
  const [accountType, setAccountType] = React.useState("");
  const [currency, setCurrency] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");

  const handleNext = () => {
    if (step === 2) {
      const totalXmls = xmlFiles.length;
      const totalSustentos = debtors.reduce((acc, d) => acc + d.sustentos.length, 0);
      if (totalXmls !== totalSustentos) {
        setError(`La cantidad de sustentos (${totalSustentos}) no coincide con la cantidad de XMLs (${totalXmls}).`);
        return;
      }
    }
    setError(null); // Limpiar errores si la validación pasa
    setStep((prev) => Math.min(prev + 1, 3));
  };
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFileDrop = async (acceptedFiles: File[]) => {
    const newFiles = [...xmlFiles, ...acceptedFiles];
    setXmlFiles(newFiles);
    setIsExtracting(true);
    setError(null);

    try {
      const extractedData = await extractDebtors(newFiles);
      if (extractedData.length > 0) {
        setClientName(extractedData[0].client_name);
        setClientRuc(extractedData[0].client_ruc);
      }
      // Agrupar por deudor
      const debtorMap = new Map();
      extractedData.forEach(doc => {
        const key = doc.debtor_ruc;
        if (!debtorMap.has(key)) {
          debtorMap.set(key, {
            id: key,
            name: doc.debtor_name,
            xmlCount: 1,
            emails: [],
            sustentos: [],
            documents: [doc], // puedes guardar los docs si quieres
          });
        } else {
          const debtor = debtorMap.get(key);
          debtor.xmlCount += 1;
          debtor.documents.push(doc);
        }
      });
      const newDebtors = Array.from(debtorMap.values());
      setDebtors(newDebtors);
      setTimeout(handleNext, 300); // Pequeño delay para que el usuario vea la carga
    } catch (err) {
      console.error("Error al extraer deudores:", err);
      setError(err instanceof Error ? err.message : "No se pudieron procesar los archivos XML.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    setError(null);

    const frontendData: FrontendData = {
      condiciones: {
        tasa: parseFloat(rate) || 0,
        comision: parseFloat(commission) || 0,
      },
      notificaciones: {
        nombre_cliente: clientName,
        ruc_cliente: clientRuc,
        correo_remitente: "kevin.tupac@capitalexpress.cl",
        envio_conjunto: bulkSend,
        emails_globales: globalEmails,
        deudores: debtors.map(d => ({ 
          id: d.id, 
          nombre: d.name, 
          emails: d.emails,
          documentos: d.documents,
          sustentos: d.sustentos.map(f => f.name)
        })),
      },
      cierre: {
        comentario: comentario,
        solicita_adelanto: requestAdvance,
        porcentaje_adelanto: requestAdvance ? parseFloat(advancePercent) || 0 : 0,
        cuenta_desembolso: {
          banco: bank,
          tipo_cuenta: accountType,
          moneda: currency,
          numero_cuenta: accountNumber,
        },
      },
    };

    const allSustentos = debtors.flatMap(d => d.sustentos);

    try {
      const result = await processOperation(frontendData, xmlFiles, allSustentos, additionalDocs);
      console.log("Operación registrada con éxito:", result);
      onFinish();
    } catch (err) {
      console.error("Error al registrar la operación:", err);
      setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  const updateDebtorEmails = (id: string, emails: string[]) => {
    setDebtors(debtors.map(d => d.id === id ? { ...d, emails } : d));
  };

  const updateDebtorSustentos = (id: string, newFiles: File[]) => {
    setDebtors(prevDebtors => 
      prevDebtors.map(d => 
        d.id === id 
          ? { ...d, sustentos: [...d.sustentos, ...newFiles] } 
          : d
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2 bg-[#f4f7fe] px-2">
              <div 
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                  step >= s 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" 
                    : "bg-white border-slate-300 text-slate-400"
                )}
              >
                {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
              </div>
              <span className={cn("text-xs font-medium", step >= s ? "text-indigo-700" : "text-slate-400")}>
                {s === 1 && "Carga XML"}
                {s === 2 && "Configuración"}
                {s === 3 && "Cierre"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Carga de Documentos</CardTitle>
                <p className="text-slate-500">Sube los archivos XML de tus facturas para comenzar.</p>
              </CardHeader>
              <CardContent>
                <Dropzone 
                  accept=".xml"
                  onDrop={handleFileDrop}
                  label="Arrastra tus archivos XML aquí"
                  sublabel="Soporta múltiples archivos. Máximo 10MB por archivo."
                />
                {isExtracting && (
                  <div className="mt-4 text-center text-sm text-indigo-600">
                    <p>Procesando archivos y extrayendo deudores...</p>
                  </div>
                )}
                {xmlFiles.length > 0 && !isExtracting && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Archivos Cargados:</h4>
                    <ul className="space-y-2">
                      {xmlFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FileText className="h-4 w-4 text-indigo-500" />
                            <span>{file.name}</span>
                          </div>
                          <span className="text-xs text-slate-500">{Math.round(file.size / 1024)} KB</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                 {error && !isExtracting && (
                  <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleNext} disabled={xmlFiles.length === 0 || isExtracting}>
                    {isExtracting ? "Procesando..." : "Continuar"} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Condiciones Generales */}
            <Card>
              <CardHeader>
                <CardTitle>Condiciones Generales</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tasa Aplicada</label>
                  <Input 
                    value={rate} 
                    onChange={(e) => setRate(e.target.value)}
                    icon={<Percent className="h-4 w-4" />}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Comisión Fija</label>
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
                <Toggle 
                  checked={bulkSend} 
                  onCheckedChange={setBulkSend} 
                  label="Envío en Conjunto" 
                />
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
                      <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 mb-4">
                        <label className="text-sm font-medium text-indigo-900 mb-2 block">Destinatarios Globales</label>
                        <EmailInput 
                          value={globalEmails} 
                          onChange={setGlobalEmails} 
                          placeholder="ingresa.correos@empresa.com"
                        />
                        <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
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
                                <FileText className="h-3 w-3 text-indigo-500" />
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
                            <div className="text-xs text-slate-500 space-y-1">
                              {debtor.sustentos.map((file, i) => (
                                <div key={i} className="flex items-center gap-1 truncate">
                                  <FileText className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{file.name}</span>
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
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
                </Button>
                <Button onClick={handleNext}>
                  Continuar <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Cierre y Envío</CardTitle>
                <p className="text-slate-500">Agregar Comentario a la operacion.</p>
                <div className="space-y-2">
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
                    <div className="mt-2 text-xs text-slate-500 space-y-1">
                      {additionalDocs.map((file, i) => (
                        <div key={i} className="flex items-center gap-1 truncate">
                          <FileText className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{file.name}</span>
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
                    {/* Banco */}
                    <div className="space-y-2">
                      <select 
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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

                    {/* Tipo de Cuenta */}
                    <div className="space-y-2">
                      <select 
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <option value="" disabled>Seleccione Cuenta</option>
                        <option value="Corriente">Corriente</option>
                        <option value="Ahorros">Ahorros</option>
                      </select>
                    </div>

                    {/* Moneda */}
                    <div className="space-y-2">
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <option value="" disabled>Moneda</option>
                        <option value="Soles">Soles</option>
                        <option value="Dolares">Dólares</option>
                      </select>
                    </div>

                    {/* Número de Cuenta */}
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
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack} disabled={loading}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Atrás
                </Button>
                <Button onClick={handleFinish} isLoading={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[180px]">
                  {loading ? "Procesando..." : "Registrar Operación"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

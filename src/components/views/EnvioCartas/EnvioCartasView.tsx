// src/components/views/EnvioCartas/EnvioCartasView.tsx
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

import { DeudorCesion } from "./types";
import { Step1Upload } from "./Step1Upload";
import { Step2Validate } from "./Step2Validate";
import { Step3Send } from "./Step3Send";

const formatToBackendDate = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

export function EnvioCartasView() {
  const [step, setStep] = React.useState(1);
  const [excelFile, setExcelFile] = React.useState<File | null>(null);
  const [fechaIngreso, setFechaIngreso] = React.useState("");

  const [isExtracting, setIsExtracting] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [deudores, setDeudores] = React.useState<DeudorCesion[]>([]);

  const handleProcessExcel = async () => {
    if (!excelFile) return;
    if (!fechaIngreso.trim()) {
      alert("Por favor, selecciona la fecha desde la cual filtrar.");
      return;
    }

    setIsExtracting(true);
    try {
      const fechaParaBackend = formatToBackendDate(fechaIngreso);
      const response = await api.procesarExcelCesion(excelFile, fechaParaBackend);
      const deudoresData: DeudorCesion[] = response.data;

      const deudoresConCorreos = await Promise.all(
        deudoresData.map(async (deudor) => {
          if (deudor.ruc && deudor.ruc !== "N/A") {
            try {
              const contactos = await api.getContactos(deudor.ruc);
              const emailsGuardados = contactos.map((c: any) => c.email);
              return { ...deudor, correos: emailsGuardados };
            } catch (err) {
              console.error(`Error cargando contactos para el RUC ${deudor.ruc}:`, err);
              return deudor;
            }
          }
          return deudor;
        })
      );

      setDeudores(deudoresConCorreos);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar el documento. Verifica el formato o tus permisos de usuario.");
    } finally {
      setIsExtracting(false);
    }
  };

  const updateCorreos = async (id: string, nuevosCorreos: string[]) => {
    const deudor = deudores.find(d => d.id === id);
    if (!deudor || !deudor.ruc || deudor.ruc === "N/A") return;

    const oldEmails = deudor.correos;
    const emailsToAdd = nuevosCorreos.filter(e => !oldEmails.includes(e));
    const emailsToRemove = oldEmails.filter(e => !nuevosCorreos.includes(e));

    setDeudores(prev => prev.map(d => d.id === id ? { ...d, correos: nuevosCorreos } : d));

    try {
      for (const email of emailsToAdd) {
        await api.addContacto(deudor.ruc, email);
      }
      for (const email of emailsToRemove) {
        await api.deleteContacto(deudor.ruc, email);
      }
    } catch (err) {
      console.error("Error sincronizando los contactos con el backend", err);
    }
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
          correos: deudor.correos,
          nombre_deudor: deudor.nombre
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
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Step1Upload 
              excelFile={excelFile} setExcelFile={setExcelFile}
              fechaIngreso={fechaIngreso} setFechaIngreso={setFechaIngreso}
              isExtracting={isExtracting} onProcessExcel={handleProcessExcel}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Step2Validate 
              deudores={deudores} updateCorreos={updateCorreos}
              onBack={() => setStep(1)} onConfirm={handleNextToConfirm}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Step3Send 
              deudoresCount={deudores.length}
              carpetaDriveNombre={`Cartas de cesión - ${formatToBackendDate(fechaIngreso)}`}
              isSending={isSending} isSuccess={isSuccess}
              onSend={handleSend} onBack={() => setStep(2)} onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
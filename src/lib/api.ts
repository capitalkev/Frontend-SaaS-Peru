
// Definimos la estructura de los datos que esperamos del backend
export interface ExtractedDocument {
  document_id: string;
  issue_date: string;
  due_date: string;
  currency: string;
  total_amount: number;
  net_amount: number;
  debtor_name: string;
  debtor_ruc: string;
  client_name: string;
  client_ruc: string;
  valid: boolean;
  source_filename: string;
}

export async function extractDebtors(files: File[]): Promise<ExtractedDocument[]> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append("xml_files", file);
  });

  const response = await fetch("http://127.0.0.1:8000/robot/extraer-deudores", {
    method: "POST",
    body: formData,
  });


  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
  }

  // Devolvemos el JSON de la respuesta
  return response.json();
}

export interface FrontendData {
    condiciones: {
      tasa: number;
      comision: number;
    };
    notificaciones: {
      nombre_cliente: string;
      ruc_cliente: string;
      correo_remitente: string;
      envio_conjunto: boolean;
      emails_globales: string[];
      deudores: { 
        id: string; 
        nombre: string; 
        emails: string[];
        documentos: ExtractedDocument[];
        sustentos: string[]; 
      }[];
    };
    cierre: {
      comentario: string;
      solicita_adelanto: boolean;
      porcentaje_adelanto: number;
      cuenta_desembolso: {
        banco: string;
        tipo_cuenta: string;
        moneda: string;
        numero_cuenta: string;
      };
    };
  }
  
  export async function processOperation(
    frontendData: FrontendData,
    xmlFiles: File[],
    sustentos: File[],
    additionalDocs: File[]
  ): Promise<any> {
    const formData = new FormData();
  
    formData.append('data_frontend', JSON.stringify(frontendData));
  
    // 2. Adjuntar los archivos XML
    xmlFiles.forEach(file => {
      formData.append('xml_files', file);
    });
  
    // 3. Adjuntar los archivos de sustento (PDFs)
    sustentos.forEach(file => {
      formData.append('pdf_files', file);
    });
  
    // 4. Adjuntar los documentos adicionales/respaldo
    additionalDocs.forEach(file => {
      formData.append('respaldo_files', file);
    });
  
    const response = await fetch("http://127.0.0.1:8000/robot/procesar-completa", {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
    }
  
    return response.json();
  }

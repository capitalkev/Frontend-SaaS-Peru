import { auth } from '@/config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://robot-backend-api-598125168090.southamerica-west1.run.app";

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
  error?: string;
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

async function getAuthHeaders(isFormData = false): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay usuario autenticado en Firebase");
  
  const token = await user.getIdToken();
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${token}`
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

export async function syncUser(firebaseToken: string, nombre: string) {
  const formData = new FormData();
  formData.append("firebase_token", firebaseToken);
  if (nombre) formData.append("nombre", nombre);

  const response = await fetch(`${API_BASE_URL}/auth/sync`, {
    method: "POST",
    body: formData, 
  });
  if (!response.ok) throw new Error("Fallo al sincronizar usuario");
  return response.json();
}

export async function getMe() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/auth/me`, { 
    method: "GET",
    headers 
  });
  if (!response.ok) throw new Error("No autorizado");
  return response.json();
}

// --- Endpoints de Negocio ---

export async function extractDebtors(
  files: File[],
): Promise<ExtractedDocument[]> {
  const headers = await getAuthHeaders(true); 
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("xml_files", file);
  });

  const response = await fetch(`${API_BASE_URL}/robot/extraer-deudores`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function processOperation(
  frontendData: FrontendData,
  xmlFiles: File[],
  sustentos: File[],
  additionalDocs: File[],
): Promise<any> {
  const headers = await getAuthHeaders(true);
  const formData = new FormData();
  formData.append("data_frontend", JSON.stringify(frontendData));

  xmlFiles.forEach((file) => formData.append("xml_files", file));
  sustentos.forEach((file) => formData.append("pdf_files", file));
  additionalDocs.forEach((file) => formData.append("respaldo_files", file));

  const response = await fetch(`${API_BASE_URL}/robot/procesar-completa`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Obtiene todas las operaciones asociadas a un correo electrónico.
 * @param gmail Correo del usuario
 */
export async function getOperations(gmail: string): Promise<any> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/operaciones/${gmail}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener operaciones: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Obtiene el detalle de las facturas de una operación específica.
 * @param idOperacion ID único de la operación
 */
export async function getFacturasByOperation(
  idOperacion: string,
): Promise<any> {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/operaciones/facturas/${idOperacion}`,
    {
      method: "GET",
      headers,
    },
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener facturas: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  console.log(data);
  return data;
}

export async function getContactos(
  ruc_deudor: string,
): Promise<{ email: string }[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/contactos/${ruc_deudor}`, {
    method: "GET",
    headers,
  });
  
  if (!response.ok) return []; // Retornamos array vacío si no hay contactos o hay error 404
  return response.json();
}

export async function addContacto(
  ruc_deudor: string,
  email: string,
): Promise<any> {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/contactos/${ruc_deudor}/${email}`,
    {
      method: "POST",
      headers,
    },
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al agregar contacto: ${response.status} - ${errorText}`);
  }
  return response.json();
}

export async function deleteContacto(
  ruc_deudor: string,
  email: string,
): Promise<any> {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/contactos/${ruc_deudor}/${email}`,
    {
      method: "DELETE",
      headers,
    },
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al eliminar contacto: ${response.status} - ${errorText}`);
  }
  return response.json();
}

// Exportación unificada para facilitar el uso en componentes
export const api = {
  syncUser,
  getMe,
  extractDebtors,
  processOperation,
  getOperations,
  getFacturasByOperation,
  getContactos,
  addContacto,
  deleteContacto,
};

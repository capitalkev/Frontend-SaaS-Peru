import { useState, useEffect, useMemo } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { SUNAT_API_URL } from './constants';
import { ClientOption, UserOption, SunatMetrics, Invoice } from './types';

// --- Helper para hacer fetch con Auth ---
async function fetchWithAuth(url: string, firebaseUser: FirebaseUser) {
  const token = await firebaseUser.getIdToken();
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error(`Error ${response.status} del servidor.`);
  return response.json();
}

// --- Hook de Usuarios ---
export function useSunatUsers(firebaseUser: FirebaseUser | null) {
  const [users, setUsers] = useState<UserOption[]>([]);

  useEffect(() => {
    if (!firebaseUser) return;
    fetchWithAuth(`${SUNAT_API_URL}/api/usuarios/no-admin`, firebaseUser)
      .then(data => setUsers(data.map((u: any) => ({ email: u.email, nombre: u.nombre, rol: u.rol }))))
      .catch(err => console.error("Error fetching users:", err));
  }, [firebaseUser]);

  return { users };
}

// --- Hook de Clientes ---
export function useSunatClients(firebaseUser: FirebaseUser | null, selectedEmails: string[], allUsersLength: number) {
  const [clients, setClients] = useState<ClientOption[]>([]);

  useEffect(() => {
    if (!firebaseUser) return;
    let url = `${SUNAT_API_URL}/api/ventas/empresas`;
    
    const shouldFilter = selectedEmails.length > 0 && selectedEmails.length <= allUsersLength;
    if (shouldFilter) {
      url += `?${selectedEmails.map(e => `usuario_emails=${e}`).join('&')}`;
    }

    fetchWithAuth(url, firebaseUser)
      .then(data => setClients(data.map((e: any) => ({ id: e.ruc, name: e.razon_social, ruc: e.ruc }))))
      .catch(err => console.error("Error fetching clients:", err));
  }, [firebaseUser, selectedEmails, allUsersLength]);

  return { clients };
}

// --- Hook Principal de Datos ---
export function useSunatData(
  firebaseUser: FirebaseUser | null,
  dateFilter: { type: string; start?: string; end?: string },
  selectedClientIds: string[],
  selectedCurrencies: string[],
  selectedUserEmails: string[],
  currentPage: number,
  sortBy: string,
  clientsLength: number,
  usersLength: number,
  viewMode: string,
  refreshTrigger: number
) {
  const [ventas, setVentas] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<SunatMetrics>({
    PEN: { totalFacturado: 0, montoGanado: 0, montoDisponible: 0, cantidad: 0, winPercentage: 0 },
    USD: { totalFacturado: 0, montoGanado: 0, montoDisponible: 0, cantidad: 0, winPercentage: 0 },
  });
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total_items: 0, has_next: false, has_previous: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular fechas basadas en el filtro
  const { startDate, endDate, periodLabel } = useMemo(() => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);
    let label = "Mes en curso";

    if (dateFilter.type === "5days") { start.setDate(today.getDate() - 5); label = "Últimos 5 días"; }
    else if (dateFilter.type === "15days") { start.setDate(today.getDate() - 15); label = "Últimos 15 días"; }
    else if (dateFilter.type === "30days") { start.setDate(today.getDate() - 30); label = "Últimos 30 días"; }
    else if (dateFilter.type === "custom") {
      start = new Date(dateFilter.start!); end = new Date(dateFilter.end!);
      label = `Del ${dateFilter.start} al ${dateFilter.end}`;
    } else {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      label = start.toLocaleString("es-ES", { month: "long", year: "numeric" }).replace(/^\w/, c => c.toUpperCase());
    }

    const formatDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { startDate: formatDate(start), endDate: formatDate(end), periodLabel: label };
  }, [dateFilter]);

  // Construir parámetros
  const buildParams = (isMetrics = false) => {
    const params = new URLSearchParams({ fecha_desde: startDate, fecha_hasta: endDate });
    if (!isMetrics) {
      params.append('page', String(currentPage));
      params.append('page_size', viewMode === "grouped" ? "100" : "20");
      params.append('sort_by', sortBy);
    }
    selectedCurrencies.forEach(c => params.append("moneda", c));
    if (selectedClientIds.length > 0 && selectedClientIds.length < clientsLength) {
      selectedClientIds.forEach(ruc => params.append("rucs_empresa", ruc));
    }
    if (selectedUserEmails.length > 0 && selectedUserEmails.length <= usersLength) {
      selectedUserEmails.forEach(email => params.append("usuario_emails", email));
    }
    return params.toString();
  };

  // Cargar Métricas y Ventas
  useEffect(() => {
    if (!firebaseUser) return;
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const [metricsData, salesData] = await Promise.all([
          fetchWithAuth(`${SUNAT_API_URL}/api/metricas/resumen?${buildParams(true)}`, firebaseUser),
          fetchWithAuth(`${SUNAT_API_URL}/api/ventas?${buildParams(false)}`, firebaseUser)
        ]);

        const calcMetrics = (data: any) => {
          const res = { PEN: data.PEN || {}, USD: data.USD || {} };
          res.PEN.winPercentage = res.PEN.totalFacturado > 0 ? (res.PEN.montoGanado / res.PEN.totalFacturado) * 100 : 0;
          res.USD.winPercentage = res.USD.totalFacturado > 0 ? (res.USD.montoGanado / res.USD.totalFacturado) * 100 : 0;
          return res as SunatMetrics;
        };

        setMetrics(calcMetrics(metricsData));
        setVentas(salesData.items || []);
        setPagination(salesData.pagination);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [firebaseUser, startDate, endDate, currentPage, viewMode, sortBy, selectedClientIds, selectedCurrencies, selectedUserEmails, refreshTrigger]);

  return { ventas, metrics, pagination, loading, error, periodLabel };
}
/**
 * Application Constants
 */

// URL del backend (desde variable de entorno)
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Dominios de email permitidos
export const ALLOWED_EMAIL_DOMAINS = [
  'capitalexpress.cl',
  'capitalexpress.pe'
];

// Configuración de tokens
export const TOKEN_CONFIG = {
  // Refrescar token cada 50 minutos (expira en 60)
  REFRESH_INTERVAL_MS: 50 * 60 * 1000,
  // Tiempo de vida del token (1 hora)
  TTL_MS: 60 * 60 * 1000
};

// Roles disponibles
export const ROLES = {
  ADMIN: 'admin',
  ROL1: 'rol1',    // Facturas
  ROL2: 'rol2'     // Verificaciones
};

// Rutas de la aplicación
export const ROUTES = {
  LOGIN: '/',
  FACTURAS: '/facturas',
  VERIFICACIONES: '/verificaciones',
  ADMIN: '/admin'
};

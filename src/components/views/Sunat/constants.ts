export const SUNAT_API_URL = 'https://crm-sunat-backend-598125168090.southamerica-west1.run.app';

export const INVOICE_STATUSES = [
  'Sin gestión',
  'Gestionando',
  'Ganada',
  'Perdida'
] as const;

export const LOSS_REASONS = [
  'Por Tasa',
  'Por Riesgo',
  'Deudor no califica',
  'Cliente no interesado',
  'Competencia',
  'Otro'
] as const;

export const CURRENCIES = [
  { code: 'PEN', name: 'Soles (PEN)', symbol: 'S/' },
  { code: 'USD', name: 'Dólares (USD)', symbol: '$' }
] as const;
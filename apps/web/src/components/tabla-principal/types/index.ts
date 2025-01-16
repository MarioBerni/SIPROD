// Re-exportar los tipos generados
export * from './generated';

// Interfaces
export interface TablaPrincipal {
  id?: string;
  departamento?: string;
  unidad?: string;
  tipoOrden?: string;
  nroOrden?: string;
  tipoOperativo?: string;
  tiempoOperativo?: string;
  nombreOperativo?: string;
  fechaInicio?: string | Date;
  horaInicio?: string | Date;
  horaFin?: string | Date;
  fechaFin?: string | Date;
  observacionesOrden?: string;
  seccional: number[];
  barrios: string[];
  moviles?: number;
  ppssEnMovil?: number;
  ssoo?: number;
  motos?: number;
  motosBitripuladas?: number;
  hipos?: number;
  canes?: number;
  pieTierra?: number;
  drones?: number;
  antidisturbioApostado?: number;
  antidisturbioAlerta?: number;
  geoApostado?: number;
  geoAlerta?: number;
  totalPpss?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdById?: string;
}

// Tipos de respuesta API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Tipo específico para respuestas de TablaPrincipal
export type TablaPrincipalResponse = ApiResponse<TablaPrincipal>;
export type TablaPrincipalListResponse = ApiResponse<PaginatedResponse<TablaPrincipal>>;

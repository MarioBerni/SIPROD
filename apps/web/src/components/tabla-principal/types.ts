// Enums
export enum Departamento {
  ARTIGAS = 'ARTIGAS',
  CANELONES = 'CANELONES',
  CERRO_LARGO = 'CERRO_LARGO',
  COLONIA = 'COLONIA',
  DURAZNO = 'DURAZNO',
  FLORES = 'FLORES',
  FLORIDA = 'FLORIDA',
  LAVALLEJA = 'LAVALLEJA',
  MALDONADO = 'MALDONADO',
  MONTEVIDEO = 'MONTEVIDEO',
  PAYSANDU = 'PAYSANDU',
  RIO_NEGRO = 'RIO_NEGRO',
  RIVERA = 'RIVERA',
  ROCHA = 'ROCHA',
  SALTO = 'SALTO',
  SAN_JOSE = 'SAN_JOSE',
  SORIANO = 'SORIANO',
  TACUAREMBO = 'TACUAREMBO',
  TREINTA_Y_TRES = 'TREINTA_Y_TRES'
}

export enum Unidad {
  DIRECCION_I = 'DIRECCION_I',
  DIRECCION_II = 'DIRECCION_II',
  GEO = 'GEO',
  REGIONAL_ESTE = 'REGIONAL_ESTE',
  REGIONAL_NORTE = 'REGIONAL_NORTE'
}

export enum TipoOrden {
  O_OP = 'O_OP',
  CIR = 'CIR',
  COM = 'COM',
  ORD = 'ORD',
  SERV = 'SERV',
  REG = 'REG'
}

export enum TipoOperativo {
  OPERATIVO = 'OPERATIVO',
  PATRULLAJE = 'PATRULLAJE',
  APOYO = 'APOYO',
  GRUPO_CHOQUE_APOSTADO = 'GRUPO_CHOQUE_APOSTADO',
  GRUPO_CHOQUE_ALERTA = 'GRUPO_CHOQUE_ALERTA',
  EQUIPO_CHOQUE_APOSTADO = 'EQUIPO_CHOQUE_APOSTADO',
  EQUIPO_CHOQUE_ALERTA = 'EQUIPO_CHOQUE_ALERTA',
  GAT = 'GAT',
  GRUPO_GEO_APOSTADO = 'GRUPO_GEO_APOSTADO',
  GRUPO_GEO_ALERTA = 'GRUPO_GEO_ALERTA',
  EQUIPO_GEO_APOSTADO = 'EQUIPO_GEO_APOSTADO',
  EQUIPO_GEO_ALERTA = 'EQUIPO_GEO_ALERTA',
  PERIMETRAL_ALLANAMIENTO = 'PERIMETRAL_ALLANAMIENTO',
  INCURSION_ALLANAMIENTO = 'INCURSION_ALLANAMIENTO',
  AUF = 'AUF',
  FUBB = 'FUBB',
  ESPECTACULOS_VARIOS = 'ESPECTACULOS_VARIOS',
  OTROS = 'OTROS'
}

export enum TiempoOperativo {
  PATRULLAJE = 'PATRULLAJE',
  PERM_ESTATICO = 'PERM_ESTATICO',
  TRANSITORIO = 'TRANSITORIO'
}

// Interfaces
export interface TablaPrincipal {
  id: string;
  departamento: Departamento;
  unidad: Unidad;
  tipoOrden: TipoOrden;
  nroOrden: string;
  tipoOperativo: TipoOperativo;
  tiempoOperativo: TiempoOperativo;
  nombreOperativo: string;
  fechaInicio?: Date;
  horaInicio?: Date;
  horaFin?: Date;
  fechaFin?: Date;
  observacionesOrden?: string;
  seccional: number[];
  mapa: string[];
  puntosControl: string[];
  recorridos: string[];
  barrios: string[];
  moviles: number;
  ppssEnMovil: number;
  ssoo: number;
  motos: number;
  motosBitripuladas: number;
  hipos: number;
  canes: number;
  pieTierra: number;
  drones: number;
  antidisturbioApostado: number;
  antidisturbioAlerta: number;
  geoApostado: number;
  geoAlerta: number;
  totalPpss: number;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

// Tipos de respuesta API
export interface ApiResponse<T> {
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

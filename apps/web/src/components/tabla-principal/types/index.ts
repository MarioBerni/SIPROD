export enum Departamento {
  MONTEVIDEO = 'MONTEVIDEO',
  CANELONES = 'CANELONES',
  MALDONADO = 'MALDONADO',
  ROCHA = 'ROCHA',
  TREINTA_Y_TRES = 'TREINTA_Y_TRES',
  CERRO_LARGO = 'CERRO_LARGO',
  RIVERA = 'RIVERA',
  ARTIGAS = 'ARTIGAS',
  SALTO = 'SALTO',
  PAYSANDU = 'PAYSANDU',
  RIO_NEGRO = 'RIO_NEGRO',
  SORIANO = 'SORIANO',
  COLONIA = 'COLONIA',
  SAN_JOSE = 'SAN_JOSE',
  FLORES = 'FLORES',
  FLORIDA = 'FLORIDA',
  LAVALLEJA = 'LAVALLEJA',
  TACUAREMBO = 'TACUAREMBO',
  DURAZNO = 'DURAZNO'
}

export enum Unidad {
  UNIDAD_1 = 'UNIDAD_1',
  UNIDAD_2 = 'UNIDAD_2',
  UNIDAD_3 = 'UNIDAD_3',
  UNIDAD_4 = 'UNIDAD_4'
}

export enum TipoOrden {
  ORDEN_SERVICIO = 'ORDEN_SERVICIO',
  ORDEN_OPERACIONES = 'ORDEN_OPERACIONES'
}

export enum TipoOperativo {
  SATURACION = 'SATURACION',
  RASTRILLO = 'RASTRILLO',
  ALLANAMIENTO = 'ALLANAMIENTO',
  PATRULLAJE = 'PATRULLAJE',
  CONTROL = 'CONTROL'
}

export enum TiempoOperativo {
  PERMANENTE = 'PERMANENTE',
  TRANSITORIO = 'TRANSITORIO'
}

export interface TablaPrincipal {
  id?: string;
  departamento: Departamento;
  unidad: string;
  tipoOrden: string;
  nroOrden: string;
  tipoOperativo: string;
  tiempoOperativo: string;
  nombreOperativo: string;
  fechaInicio: Date;
  horaInicio: Date;
  fechaFin: Date;
  horaFin: Date;
  seccional: number[];
  mapa: string[];
  puntosControl: string[];
  recorridos: string[];
  barrios: string[];
  objetivos: string;
  resultados: string;
  observaciones: string;
  moviles: number;
  motos: number;
  efectivos: number;
  geoApostado: number;
  geoMovil: number;
  dnic: number;
  uae: number;
  otras: number;
  totalPpss: number;
  createdAt?: string;
  updatedAt?: string;
  createdById?: string;
  updatedById?: string;
}

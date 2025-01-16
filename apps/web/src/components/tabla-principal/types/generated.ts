// Este archivo es generado automáticamente. No modificar manualmente.

// Utilidades de conversión para enums
export const convertToEnumValue = (str: string): string => {
  if (!str) return '';
  // Normalizar el valor eliminando tildes y puntos extras
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
    .toUpperCase()
    .replace(/\s+/g, '_') // Reemplazar espacios con _
    .replace(/\.+/g, '.') // Reducir múltiples puntos a uno solo
    .replace(/\.$/, ''); // Eliminar punto final si existe
};

export const convertToLabel = (enumValue: string): string => {
  return enumValue
    .split(/[_.]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export enum Rol {
  ADMINISTRADOR = 'ADMINISTRADOR',
  SUPERVISOR = 'SUPERVISOR',
  OPERADOR = 'OPERADOR',
}

export const RolLabel: Record<keyof typeof Rol, string> = {
  ADMINISTRADOR: 'Administrador',
  SUPERVISOR: 'Supervisor',
  OPERADOR: 'Operador',
} as const;

export const convertToRol = (str: string): Rol => {
  const enumValue = convertToEnumValue(str);
  return enumValue as Rol;
};

export enum Grado {
  CTE_MAYOR = 'CTE_MAYOR',
  CTE = 'CTE',
  MAY = 'MAY',
  CAP = 'CAP',
  TTE_1RO = 'TTE_1RO',
  TTE = 'TTE',
  ALF = 'ALF',
  SGTO_1RO = 'SGTO_1RO',
  SGTO = 'SGTO',
  CABO_1RO = 'CABO_1RO',
  CABO_2DO = 'CABO_2DO',
  CABO = 'CABO',
  AG_1RA = 'AG_1RA',
  AG_2DA = 'AG_2DA',
  CADETE = 'CADETE',
}

export const GradoLabel: Record<keyof typeof Grado, string> = {
  CTE_MAYOR: 'Cte Mayor',
  CTE: 'Cte',
  MAY: 'May',
  CAP: 'Cap',
  TTE_1RO: 'Tte 1ro',
  TTE: 'Tte',
  ALF: 'Alf',
  SGTO_1RO: 'Sgto 1ro',
  SGTO: 'Sgto',
  CABO_1RO: 'Cabo 1ro',
  CABO_2DO: 'Cabo 2do',
  CABO: 'Cabo',
  AG_1RA: 'Ag 1ra',
  AG_2DA: 'Ag 2da',
  CADETE: 'Cadete',
} as const;

export const convertToGrado = (str: string): Grado => {
  const enumValue = convertToEnumValue(str);
  return enumValue as Grado;
};

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
  PAYSANDU = 'PAYSANDÚ',
  RIO_NEGRO = 'RÍO_NEGRO',
  RIVERA = 'RIVERA',
  ROCHA = 'ROCHA',
  SALTO = 'SALTO',
  SAN_JOSE = 'SAN_JOSÉ',
  SORIANO = 'SORIANO',
  TACUAREMBO = 'TACUAREMBÓ',
  TREINTA_Y_TRES = 'TREINTA_Y_TRES',
}

export const DepartamentoLabel: Record<keyof typeof Departamento, string> = {
  ARTIGAS: 'Artigas',
  CANELONES: 'Canelones',
  CERRO_LARGO: 'Cerro Largo',
  COLONIA: 'Colonia',
  DURAZNO: 'Durazno',
  FLORES: 'Flores',
  FLORIDA: 'Florida',
  LAVALLEJA: 'Lavalleja',
  MALDONADO: 'Maldonado',
  MONTEVIDEO: 'Montevideo',
  PAYSANDU: 'Paysandú',
  RIO_NEGRO: 'Río Negro',
  RIVERA: 'Rivera',
  ROCHA: 'Rocha',
  SALTO: 'Salto',
  SAN_JOSE: 'San José',
  SORIANO: 'Soriano',
  TACUAREMBO: 'Tacuarembó',
  TREINTA_Y_TRES: 'Treinta y Tres',
} as const;

export const convertToDepartamento = (str: string): Departamento => {
  const enumValue = convertToEnumValue(str);
  return enumValue as Departamento;
};

export enum Unidad {
  DIRECCION_I = 'DIRECCION_I',
  DIRECCION_II = 'DIRECCION_II',
  GEO = 'GEO',
  REGIONAL_ESTE = 'REGIONAL_ESTE',
  REGIONAL_NORTE = 'REGIONAL_NORTE',
  DIRECCION_V = 'DIRECCION_V',
  OTRAS = 'OTRAS'
}

export const UnidadLabel: Record<keyof typeof Unidad, string> = {
  DIRECCION_I: 'Dirección I',
  DIRECCION_II: 'Dirección II',
  GEO: 'GEO',
  REGIONAL_ESTE: 'Regional Este',
  REGIONAL_NORTE: 'Regional Norte',
  DIRECCION_V: 'Dirección V',
  OTRAS: 'Otras'
} as const;

export const convertToUnidad = (str: string): Unidad => {
  const enumValue = convertToEnumValue(str);
  return enumValue as Unidad;
};

export enum TipoOrden {
  O_OP = 'O_OP',
  CIR = 'CIR',
  COM = 'COM',
  ORD_SERV = 'ORD_SERV'
}

export const TipoOrdenLabel: Record<keyof typeof TipoOrden, string> = {
  O_OP: 'O. Op.',
  CIR: 'Cir.',
  COM: 'Com.',
  ORD_SERV: 'Ord. Serv.'
} as const;

export const convertToTipoOrden = (str: string): TipoOrden => {
  const enumValue = convertToEnumValue(str);
  return enumValue as TipoOrden;
};

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
  INCURSION_ALLANAMIENTO = 'INCURSIÓN_ALLANAMIENTO',
  AUF = 'AUF',
  FUBB = 'FUBB',
  ESPECTACULOS_VARIOS = 'ESPECTACULOS_VARIOS',
  OTROS = 'OTROS',
}

export const TipoOperativoLabel: Record<keyof typeof TipoOperativo, string> = {
  OPERATIVO: 'Operativo',
  PATRULLAJE: 'Patrullaje',
  APOYO: 'Apoyo',
  GRUPO_CHOQUE_APOSTADO: 'Grupo choque apostado',
  GRUPO_CHOQUE_ALERTA: 'Grupo choque alerta',
  EQUIPO_CHOQUE_APOSTADO: 'Equipo choque apostado',
  EQUIPO_CHOQUE_ALERTA: 'Equipo choque alerta',
  GAT: 'GAT',
  GRUPO_GEO_APOSTADO: 'Grupo GEO apostado',
  GRUPO_GEO_ALERTA: 'Grupo GEO alerta',
  EQUIPO_GEO_APOSTADO: 'Equipo GEO apostado',
  EQUIPO_GEO_ALERTA: 'Equipo GEO alerta',
  PERIMETRAL_ALLANAMIENTO: 'Perimetral allanamiento',
  INCURSION_ALLANAMIENTO: 'Incursión allanamiento',
  AUF: 'AUF',
  FUBB: 'FUBB',
  ESPECTACULOS_VARIOS: 'Espectaculos varios',
  OTROS: 'Otros',
} as const;

export const convertToTipoOperativo = (str: string): TipoOperativo => {
  const enumValue = convertToEnumValue(str);
  return enumValue as TipoOperativo;
};

export enum TiempoOperativo {
  PATRULLAJE = 'PATRULLAJE',
  PERM_ESTATICO = 'PERM._ESTATICO',
  TRANSITORIO = 'TRANSITORIO',
}

export const TiempoOperativoLabel: Record<keyof typeof TiempoOperativo, string> = {
  PATRULLAJE: 'Patrullaje',
  PERM_ESTATICO: 'Perm. estatico',
  TRANSITORIO: 'Transitorio',
} as const;

export const convertToTiempoOperativo = (str: string): TiempoOperativo => {
  const enumValue = convertToEnumValue(str);
  return enumValue as TiempoOperativo;
};

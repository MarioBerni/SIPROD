// Este archivo es generado automáticamente. NO EDITAR MANUALMENTE.

export enum Rol {
  ADMINISTRADOR = 'ADMINISTRADOR',
  SUPERVISOR = 'SUPERVISOR',
  OPERADOR = 'OPERADOR',
  COMANDO_DIRECCION_I = 'COMANDO_DIRECCION_I',
  COMANDO_DIRECCION_II = 'COMANDO_DIRECCION_II',
  COMANDO_GEO = 'COMANDO_GEO',
  COMANDO_DNGR = 'COMANDO_DNGR',
}

export const RolLabel: Record<Rol, string> = {
  [Rol.ADMINISTRADOR]: 'ADMINISTRADOR',
  [Rol.SUPERVISOR]: 'SUPERVISOR',
  [Rol.OPERADOR]: 'OPERADOR',
  [Rol.COMANDO_DIRECCION_I]: 'COMANDO DIRECCION I',
  [Rol.COMANDO_DIRECCION_II]: 'COMANDO DIRECCION II',
  [Rol.COMANDO_GEO]: 'COMANDO GEO',
  [Rol.COMANDO_DNGR]: 'COMANDO DNGR',
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

export const GradoLabel: Record<Grado, string> = {
  [Grado.CTE_MAYOR]: 'CTE MAYOR',
  [Grado.CTE]: 'CTE',
  [Grado.MAY]: 'MAY',
  [Grado.CAP]: 'CAP',
  [Grado.TTE_1RO]: 'TTE 1RO',
  [Grado.TTE]: 'TTE',
  [Grado.ALF]: 'ALF',
  [Grado.SGTO_1RO]: 'SGTO 1RO',
  [Grado.SGTO]: 'SGTO',
  [Grado.CABO_1RO]: 'CABO 1RO',
  [Grado.CABO_2DO]: 'CABO 2DO',
  [Grado.CABO]: 'CABO',
  [Grado.AG_1RA]: 'AG 1RA',
  [Grado.AG_2DA]: 'AG 2DA',
  [Grado.CADETE]: 'CADETE',
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
  PAYSANDU = 'PAYSANDU',
  RIO_NEGRO = 'RIO_NEGRO',
  RIVERA = 'RIVERA',
  ROCHA = 'ROCHA',
  SALTO = 'SALTO',
  SAN_JOSE = 'SAN_JOSE',
  SORIANO = 'SORIANO',
  TACUAREMBO = 'TACUAREMBO',
  TREINTA_Y_TRES = 'TREINTA_Y_TRES',
}

export const DepartamentoLabel: Record<Departamento, string> = {
  [Departamento.ARTIGAS]: 'Artigas',
  [Departamento.CANELONES]: 'Canelones',
  [Departamento.CERRO_LARGO]: 'Cerro Largo',
  [Departamento.COLONIA]: 'Colonia',
  [Departamento.DURAZNO]: 'Durazno',
  [Departamento.FLORES]: 'Flores',
  [Departamento.FLORIDA]: 'Florida',
  [Departamento.LAVALLEJA]: 'Lavalleja',
  [Departamento.MALDONADO]: 'Maldonado',
  [Departamento.MONTEVIDEO]: 'Montevideo',
  [Departamento.PAYSANDU]: 'Paysandú',
  [Departamento.RIO_NEGRO]: 'Río Negro',
  [Departamento.RIVERA]: 'Rivera',
  [Departamento.ROCHA]: 'Rocha',
  [Departamento.SALTO]: 'Salto',
  [Departamento.SAN_JOSE]: 'San José',
  [Departamento.SORIANO]: 'Soriano',
  [Departamento.TACUAREMBO]: 'Tacuarembó',
  [Departamento.TREINTA_Y_TRES]: 'Treinta y Tres',
};

export enum Unidad {
  DIRECCION_I = 'DIRECCION_I',
  DIRECCION_II = 'DIRECCION_II',
  GEO = 'GEO',
  REGIONAL_ESTE = 'REGIONAL_ESTE',
  REGIONAL_NORTE = 'REGIONAL_NORTE',
  DIRECCION_V = 'DIRECCION_V',
  OTRAS = 'OTRAS',
}

export const UnidadLabel: Record<Unidad, string> = {
  [Unidad.DIRECCION_I]: 'Dirección I',
  [Unidad.DIRECCION_II]: 'Dirección II',
  [Unidad.GEO]: 'GEO',
  [Unidad.REGIONAL_ESTE]: 'Regional Este',
  [Unidad.REGIONAL_NORTE]: 'Regional Norte',
  [Unidad.DIRECCION_V]: 'Dirección V',
  [Unidad.OTRAS]: 'Otras',
};

export enum TipoOrden {
  O_OP = 'O_OP',
  CIR = 'CIR',
  COM = 'COM',
  ORD_SERV = 'ORD_SERV',
}

export const TipoOrdenLabel: Record<TipoOrden, string> = {
  [TipoOrden.O_OP]: 'O. Op.',
  [TipoOrden.CIR]: 'Cir.',
  [TipoOrden.COM]: 'Com.',
  [TipoOrden.ORD_SERV]: 'Ord. Serv.',
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
  INCURSION_ALLANAMIENTO = 'INCURSION_ALLANAMIENTO',
  AUF = 'AUF',
  FUBB = 'FUBB',
  ESPECTACULOS_VARIOS = 'ESPECTACULOS_VARIOS',
  OTROS = 'OTROS',
}

export const TipoOperativoLabel: Record<TipoOperativo, string> = {
  [TipoOperativo.OPERATIVO]: 'Operativo',
  [TipoOperativo.PATRULLAJE]: 'Patrullaje',
  [TipoOperativo.APOYO]: 'Apoyo',
  [TipoOperativo.GRUPO_CHOQUE_APOSTADO]: 'Grupo choque apostado',
  [TipoOperativo.GRUPO_CHOQUE_ALERTA]: 'Grupo choque alerta',
  [TipoOperativo.EQUIPO_CHOQUE_APOSTADO]: 'Equipo choque apostado',
  [TipoOperativo.EQUIPO_CHOQUE_ALERTA]: 'Equipo choque alerta',
  [TipoOperativo.GAT]: 'GAT',
  [TipoOperativo.GRUPO_GEO_APOSTADO]: 'Grupo GEO apostado',
  [TipoOperativo.GRUPO_GEO_ALERTA]: 'Grupo GEO alerta',
  [TipoOperativo.EQUIPO_GEO_APOSTADO]: 'Equipo GEO apostado',
  [TipoOperativo.EQUIPO_GEO_ALERTA]: 'Equipo GEO alerta',
  [TipoOperativo.PERIMETRAL_ALLANAMIENTO]: 'Perimetral allanamiento',
  [TipoOperativo.INCURSION_ALLANAMIENTO]: 'Incursión allanamiento',
  [TipoOperativo.AUF]: 'AUF',
  [TipoOperativo.FUBB]: 'FUBB',
  [TipoOperativo.ESPECTACULOS_VARIOS]: 'Espectaculos varios',
  [TipoOperativo.OTROS]: 'Otros',
};

export enum TiempoOperativo {
  PATRULLAJE = 'PATRULLAJE',
  PERM_ESTATICO = 'PERM_ESTATICO',
  TRANSITORIO = 'TRANSITORIO',
}

export const TiempoOperativoLabel: Record<TiempoOperativo, string> = {
  [TiempoOperativo.PATRULLAJE]: 'Patrullaje',
  [TiempoOperativo.PERM_ESTATICO]: 'Perm. estatico',
  [TiempoOperativo.TRANSITORIO]: 'Transitorio',
};


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
  CADETE = 'CADETE'
}

export enum Rol {
  ADMINISTRADOR = 'ADMINISTRADOR',
  SUPERVISOR = 'SUPERVISOR',
  OPERADOR = 'OPERADOR',
  COMANDO_DIRECCION_I = 'COMANDO_DIRECCION_I',
  COMANDO_DIRECCION_II = 'COMANDO_DIRECCION_II',
  COMANDO_GEO = 'COMANDO_GEO',
  COMANDO_DNGR = 'COMANDO_DNGR'
}

export interface User {
  id: string;
  createdAt: string;
  ultimaFechaAcceso: string | null;
  contrasenaActual: string;
  nuevaContrasena?: string;
  grado: Grado;
  nombre: string;
  rol: Rol;
  cargo: string;
  correo: string;
  terminosCondiciones: boolean;
  desplieguesCargados: number;
  activo: boolean;
  updatedAt: string;
}

export interface UserFormData {
  nombre: string;
  correo: string;
  contrasenaActual: string;
  nuevaContrasena?: string;
  grado: Grado;
  rol: Rol;
  cargo: string;
  terminosCondiciones?: boolean;
  activo?: boolean;
}

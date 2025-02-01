import { Grado, Rol } from './types';

export function formatGrado(grado: Grado): string {
  const gradoMap: Record<Grado, string> = {
    CTE_MAYOR: 'Comandante Mayor',
    CTE: 'Comandante',
    MAY: 'Mayor',
    CAP: 'Capitán',
    TTE_1RO: 'Teniente 1°',
    TTE: 'Teniente',
    ALF: 'Alférez',
    SGTO_1RO: 'Sargento 1°',
    SGTO: 'Sargento',
    CABO_1RO: 'Cabo 1°',
    CABO_2DO: 'Cabo 2°',
    CABO: 'Cabo',
    AG_1RA: 'Agente 1ra',
    AG_2DA: 'Agente 2da',
    CADETE: 'Cadete'
  };
  return gradoMap[grado] || grado;
}

export function formatRol(rol: Rol): string {
  const rolMap: Record<Rol, string> = {
    ADMINISTRADOR: 'Administrador',
    SUPERVISOR: 'Supervisor',
    OPERADOR: 'Operador',
    COMANDO_DIRECCION_I: 'Comando Dirección I',
    COMANDO_DIRECCION_II: 'Comando Dirección II',
    COMANDO_GEO: 'Comando GEO',
    COMANDO_DNGR: 'Comando DNGR'
  };
  return rolMap[rol] || rol;
}

export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Error desconocido';
}

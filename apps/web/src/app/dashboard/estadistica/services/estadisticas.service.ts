import axios from 'axios';
import { Zona, DepartamentosPorZona } from '../types/zona';
import { Departamento, TiempoOperativo, Unidad } from '@prisma/client';

export interface EstadisticasFiltros {
  zona: Zona[];
  unidad: Unidad[];
  tiempoOperativo: TiempoOperativo[];
  departamento?: Departamento;
  fechaInicio?: Date;
  fechaFin?: Date;
  mostrarSeccionales: boolean;
  mostrarBarrios: boolean;
}

export interface Detalle {
  tipoOperativo: string | null;
  nombreOperativo: string | null;
  horaInicio: string;
  horaFin: string;
  totalPpss: number;
  moviles: number;
  motos: number;
  hipos: number;
}

export interface DetalleRegistro {
  nombreOperativo: string | null;
  moviles: number | null;
  motos: number | null;
  hipos: number | null;
  totalPpss: number | null;
  seccional?: number[];
  barrios?: string[];
  tiempoOperativo: TiempoOperativo;
  unidad: Unidad;
  departamento: Departamento;
}

export interface EstadisticaDetallada {
  resumen: {
    valor: number | string;
    totalPpss: number;
  };
  detalles: DetalleRegistro[];
}

export interface EstadisticaPorHora {
  hora: number;
  totalPpss: number;
  totalMoviles: number;
  totalMotos: number;
  totalHipos: number;
  detalles: Detalle[];
}

export interface EstadisticasPorSeccional extends EstadisticaDetallada {
  resumen: {
    valor: number;
    totalPpss: number;
  };
}

export interface EstadisticasPorBarrio extends EstadisticaDetallada {
  resumen: {
    valor: string;
    totalPpss: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const prepararParametrosFiltro = (filtros: Partial<EstadisticasFiltros>) => {
  // Asegurarnos de que los arrays estén inicializados
  const filtrosCompletos: EstadisticasFiltros = {
    zona: [],
    unidad: [],
    tiempoOperativo: [],
    mostrarSeccionales: false,
    mostrarBarrios: false,
    ...filtros
  };

  const params: Record<string, string | string[]> = {};

  if (filtrosCompletos.zona?.length) {
    const departamentos = filtrosCompletos.zona.flatMap(zona => DepartamentosPorZona[zona]);
    params.departamentos = departamentos;
  }

  if (filtrosCompletos.unidad?.length) {
    params.unidad = filtrosCompletos.unidad;
  }

  if (filtrosCompletos.tiempoOperativo?.length) {
    params.tiempoOperativo = filtrosCompletos.tiempoOperativo;
  }

  if (filtrosCompletos.fechaInicio) {
    params.fechaInicio = filtrosCompletos.fechaInicio.toISOString();
  }

  if (filtrosCompletos.fechaFin) {
    params.fechaFin = filtrosCompletos.fechaFin.toISOString();
  }

  console.log('Parámetros preparados:', params);
  return params;
};

export const obtenerEstadisticasPorHorario = async (filtros: Partial<EstadisticasFiltros> = {}): Promise<EstadisticaPorHora[]> => {
  try {
    const params = prepararParametrosFiltro(filtros);

    console.log('Enviando parámetros:', params);

    const response = await axios.get<EstadisticaPorHora[]>(`${API_URL}/estadisticas/horario`, { 
      params,
      paramsSerializer: {
        serialize: (params) => {
          const searchParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach(v => searchParams.append(key, v));
            } else {
              searchParams.append(key, value);
            }
          });
          return searchParams.toString();
        }
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error en obtenerEstadisticasPorHorario:', error);
    throw error;
  }
};

export const obtenerResumenEstadisticas = async (filtros: EstadisticasFiltros) => {
  try {
    const response = await axios.get(`${API_URL}/estadisticas/resumen`, {
      params: {
        ...filtros,
        fechaInicio: filtros.fechaInicio?.toISOString(),
        fechaFin: filtros.fechaFin?.toISOString(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en obtenerResumenEstadisticas:', error);
    throw error;
  }
};

export const obtenerEstadisticasPorSeccional = async (filtros: Partial<EstadisticasFiltros> = {}): Promise<EstadisticasPorSeccional[]> => {
  try {
    const params = prepararParametrosFiltro(filtros);

    const response = await axios.get<EstadisticasPorSeccional[]>(`${API_URL}/tabla-principal/estadisticas/seccional`, {
      params,
      paramsSerializer: {
        serialize: (params) => {
          const searchParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach(v => searchParams.append(key, v));
            } else {
              searchParams.append(key, String(value));
            }
          });
          return searchParams.toString();
        }
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en obtenerEstadisticasPorSeccional:', error);
    throw error;
  }
};

export const obtenerEstadisticasPorBarrio = async (filtros: Partial<EstadisticasFiltros> = {}): Promise<EstadisticasPorBarrio[]> => {
  try {
    const params = prepararParametrosFiltro(filtros);

    const response = await axios.get<EstadisticasPorBarrio[]>(`${API_URL}/tabla-principal/estadisticas/barrio`, {
      params,
      paramsSerializer: {
        serialize: (params) => {
          const searchParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach(v => searchParams.append(key, v));
            } else {
              searchParams.append(key, String(value));
            }
          });
          return searchParams.toString();
        }
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en obtenerEstadisticasPorBarrio:', error);
    throw error;
  }
};

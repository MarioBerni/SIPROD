import { api } from '@/lib/fetch';
import { Departamento, TiempoOperativo, Unidad } from '@prisma/client';
import { EstadisticasFiltros } from '../types/filtros';

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

export interface EstadisticaPorHora {
  hora: number;
  totalPpss: number;
  totalMoviles: number;
  totalMotos: number;
  totalHipos: number;
  detalles: Detalle[];
}

interface FiltrosQueryParams {
  zona?: string[];
  unidad?: string[];
  tiempoOperativo?: string[];
  departamento?: string;
  [key: string]: string | string[] | undefined;
}

const prepararParametrosFiltro = (filtros: Partial<EstadisticasFiltros>): FiltrosQueryParams => {
  const params: FiltrosQueryParams = {};

  if (filtros.zona?.length) {
    params.zona = filtros.zona;
  }
  if (filtros.unidad?.length) {
    params.unidad = filtros.unidad;
  }
  if (filtros.tiempoOperativo?.length) {
    params.tiempoOperativo = filtros.tiempoOperativo;
  }
  if (filtros.departamento) {
    params.departamento = filtros.departamento;
  }

  return params;
};

export const obtenerResumenEstadisticas = async (filtros: EstadisticasFiltros) => {
  try {
    const params = prepararParametrosFiltro(filtros);
    return await api.get('/estadisticas/resumen', { params });
  } catch (error) {
    console.error('Error en obtenerResumenEstadisticas:', error);
    throw error;
  }
};

export const obtenerEstadisticasPorBarrio = async (
  filtros: Partial<EstadisticasFiltros> = {}
): Promise<EstadisticasPorBarrio[]> => {
  try {
    const params = prepararParametrosFiltro(filtros);
    return await api.get<EstadisticasPorBarrio[]>('/estadisticas/barrio', { params });
  } catch (error) {
    console.error('Error en obtenerEstadisticasPorBarrio:', error);
    throw error;
  }
};

export const obtenerEstadisticasPorSeccional = async (
  filtros: Partial<EstadisticasFiltros> = {}
): Promise<EstadisticasPorSeccional[]> => {
  try {
    const params = prepararParametrosFiltro(filtros);
    return await api.get<EstadisticasPorSeccional[]>('/estadisticas/seccional', { params });
  } catch (error) {
    console.error('Error en obtenerEstadisticasPorSeccional:', error);
    throw error;
  }
};

export const obtenerEstadisticasPorHorario = async (
  filtros: Partial<EstadisticasFiltros> = {}
): Promise<EstadisticaPorHora[]> => {
  try {
    const params = prepararParametrosFiltro(filtros);
    return await api.get<EstadisticaPorHora[]>('/estadisticas/horario', { params });
  } catch (error) {
    console.error('Error en obtenerEstadisticasPorHorario:', error);
    throw error;
  }
};

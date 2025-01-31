import { Zona } from './zona';
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

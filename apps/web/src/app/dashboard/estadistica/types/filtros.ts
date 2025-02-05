import { Zona } from './zona';
import { Departamento, TiempoOperativo, Unidad } from '@prisma/client';

export interface EstadisticasFiltros {
  zona: Zona[];
  unidad: Unidad[];
  tiempoOperativo: TiempoOperativo[];
  departamento?: Departamento;
  mostrarSeccionales: boolean;
  mostrarBarrios: boolean;
}

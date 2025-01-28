import { PDFTableRow } from './types/table.types';

export interface CustomTable {
  id: string;
  title: string;
  tiempoOperativo: string[]; // Cambiado a array para selección múltiple
  selectedOperativos: string[];
}

export interface FilterFormState {
  organizarPor: string;
  turnos: string[];
  unidades: string[];
  tiempoOperativo: string[];
  nombreOperativo: string[];
  customTables: CustomTable[];
  incluirInforme: boolean;
  customGroups: Record<string, string[]>;
  groupTitles: Record<string, string>;
}

export type Filters = FilterFormState;

export type PDFTableData = Record<string, PDFTableRow[]>;

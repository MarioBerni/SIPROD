import { PDFTableRow } from './types/table.types';

export interface CustomTable {
  id: string;
  title: string;
  selectedOperativos: string[];
}

export interface FilterFormState {
  organizarPor: string;
  turnos: string[];
  unidades: string[];
  tiemposOperativos: string[];
  nombresOperativos: string[];
  customTables: CustomTable[];
  incluirInforme: boolean;
  customGroups: Record<string, string[]>;
  groupTitles: Record<string, string>;
}

export type Filters = FilterFormState;

export type PDFTableData = Record<string, PDFTableRow[]>;

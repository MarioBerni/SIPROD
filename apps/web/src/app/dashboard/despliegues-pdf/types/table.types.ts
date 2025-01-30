import { UserOptions } from 'jspdf-autotable';

// Extender el tipo jsPDF para incluir autoTable y lastAutoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => void;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

export interface TableCell {
  cell: {
    styles: {
      halign: string;
    };
    x: number;
    y: number;
    width: number;
    height: number;
  };
  column: {
    index: number;
  };
  row: {
    index: number;
  };
  section: string;
}

export type Color = [number, number, number];

export interface LineWidth {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface CellStyle {
  fillColor?: Color;
  textColor?: number;
  fontStyle?: 'bold' | 'normal' | 'italic';
  cellPadding?: number;
  lineWidth?: number | LineWidth;
  lineColor?: Color;
  fontSize?: number;
}

export interface PDFTableRow {
  nombreOperativo: string;
  moviles: number;
  ssoo: number;
  motos: number;
  hipos: number;
  pieTierra: number;
  totalPpss: number;
  horaInicio: string;
  horaFin: string;
  seccional: string;
  barrios: string[];
  tipoOrden?: string;
  nroOrden?: string;
  unidad: string;
}

export interface TableTotals {
  unidad: string;
  moviles: number;
  ssoo: number;
  motos: number;
  hipos: number;
  pieTierra: number;
  totalPpss: number;
}

export type FormattedTableRow = (string | { 
  content: string; 
  styles: CellStyle;
})[];

export type FormattedTableData = FormattedTableRow[];

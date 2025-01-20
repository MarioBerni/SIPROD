import { UserOptions } from 'jspdf-autotable';

// Extender el tipo jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => void;
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

export interface TableTotals {
  unidad: string;
  moviles: number;
  ssoo: number;
  motos: number;
  hipos: number;
  pieTierra: number;
  totalPpss: number;
}

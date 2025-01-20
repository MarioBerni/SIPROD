import { Styles } from 'jspdf-autotable';

export const IMAGE_PATHS = [
  '/images/movil.jpeg',
  '/images/ssoo.jpeg',
  '/images/motos.jpeg',
  '/images/hipos.jpeg',
  '/images/pieTierra.jpeg',
  '/images/ppssTotal.jpeg'
] as const;

export const TABLE_STYLES = {
  DEFAULT: {
    fontSize: 8,
    cellPadding: 1,
    overflow: 'linebreak' as const,
    halign: 'center' as const,
    valign: 'middle' as const,
    lineWidth: 0.1,
    minCellHeight: 10,
    cellWidth: 'auto' as const
  } satisfies Partial<Styles>,
  TOTAL_CELL: {
    fillColor: [41, 128, 185] as [number, number, number],
    textColor: 255,
    fontStyle: 'bold' as const,
    lineWidth: { top: 0.1, right: 0, bottom: 0, left: 0 },
    fontSize: 10
  } satisfies Partial<Styles>,
  EMPTY_CELL: {
    fillColor: [255, 255, 255] as [number, number, number],
    lineWidth: { top: 0.1, right: 0, bottom: 0, left: 0 },
    fontSize: 10
  } satisfies Partial<Styles>
} as const;

export const COLUMN_WIDTHS = {
  NOMBRE_OPERATIVO: 60,
  STANDARD: 13,
  HORA: 15,
  SECCIONAL: 20
} as const;

export const IMAGE_DIMENSIONS = {
  width: 8,
  height: 8
} as const;

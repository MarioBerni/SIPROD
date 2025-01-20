import { jsPDF } from 'jspdf';
import { PDFTableRow } from '../../types';
import { TABLE_STYLES, COLUMN_WIDTHS, IMAGE_DIMENSIONS, IMAGE_PATHS } from '../../constants/table.constants';
import { createTableHeaders } from './headerTable';

export interface TableTotals {
  unidad: string;
  moviles: number;
  ssoo: number;
  motos: number;
  hipos: number;
  pieTierra: number;
  totalPpss: number;
}

/**
 * Calcula los totales de los datos de la tabla
 */
const calculateTotals = (data: PDFTableRow[]): Omit<TableTotals, 'unidad'> => {
  return data.reduce((acc, row) => ({
    moviles: acc.moviles + (Number(row.moviles) || 0),
    ssoo: acc.ssoo + (Number(row.ssoo) || 0),
    motos: acc.motos + (Number(row.motos) || 0),
    hipos: acc.hipos + (Number(row.hipos) || 0),
    pieTierra: acc.pieTierra + (Number(row.pieTierra) || 0),
    totalPpss: acc.totalPpss + (Number(row.totalPpss) || 0)
  }), {
    moviles: 0, ssoo: 0, motos: 0, hipos: 0, pieTierra: 0, totalPpss: 0
  });
};

/**
 * Prepara los datos para la tabla
 */
const prepareTableData = (data: PDFTableRow[], totales: Omit<TableTotals, 'unidad'>) => {
  return [
    ...data.map(registro => [
      registro.nombreOperativo,
      registro.moviles.toString(),
      registro.ssoo.toString(),
      registro.motos.toString(),
      registro.hipos.toString(),
      registro.pieTierra.toString(),
      registro.totalPpss.toString(),
      registro.horaInicio,
      registro.horaFin,
      registro.seccional
    ]),
    [
      { content: 'TOTAL', styles: TABLE_STYLES.TOTAL_CELL },
      { content: totales.moviles.toString(), styles: TABLE_STYLES.TOTAL_CELL },
      { content: totales.ssoo.toString(), styles: TABLE_STYLES.TOTAL_CELL },
      { content: totales.motos.toString(), styles: TABLE_STYLES.TOTAL_CELL },
      { content: totales.hipos.toString(), styles: TABLE_STYLES.TOTAL_CELL },
      { content: totales.pieTierra.toString(), styles: TABLE_STYLES.TOTAL_CELL },
      { content: totales.totalPpss.toString(), styles: TABLE_STYLES.TOTAL_CELL },
      { content: '', styles: TABLE_STYLES.EMPTY_CELL },
      { content: '', styles: TABLE_STYLES.EMPTY_CELL },
      { content: '', styles: TABLE_STYLES.EMPTY_CELL }
    ]
  ];
};

/**
 * Agrega los datos de la tabla al PDF
 */
export const addTableData = (doc: jsPDF, data: PDFTableRow[], startY: number, titulo: string): TableTotals => {
  // Calcular dimensiones de la tabla
  const tableWidth = COLUMN_WIDTHS.NOMBRE_OPERATIVO + 
    (COLUMN_WIDTHS.STANDARD * 6) + 
    (COLUMN_WIDTHS.HORA * 2) + 
    COLUMN_WIDTHS.SECCIONAL;
  const pageWidth = doc.internal.pageSize.width;
  const safeMargin = Math.max((pageWidth - tableWidth) / 2, 10);

  // Calcular totales
  const totales = calculateTotals(data);

  // Preparar datos de la tabla
  const headers = createTableHeaders();
  const tableData = prepareTableData(data, totales);

  // Configurar y dibujar la tabla
  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: startY - 2,
    theme: 'striped',
    margin: { left: safeMargin, right: safeMargin },
    styles: TABLE_STYLES.DEFAULT,
    columnStyles: {
      0: { halign: 'left' as const, cellWidth: COLUMN_WIDTHS.NOMBRE_OPERATIVO },
      1: { cellWidth: COLUMN_WIDTHS.STANDARD },
      2: { cellWidth: COLUMN_WIDTHS.STANDARD },
      3: { cellWidth: COLUMN_WIDTHS.STANDARD },
      4: { cellWidth: COLUMN_WIDTHS.STANDARD },
      5: { cellWidth: COLUMN_WIDTHS.STANDARD },
      6: { cellWidth: COLUMN_WIDTHS.STANDARD },
      7: { cellWidth: COLUMN_WIDTHS.HORA },
      8: { cellWidth: COLUMN_WIDTHS.HORA },
      9: { cellWidth: COLUMN_WIDTHS.SECCIONAL }
    },
    didDrawCell: function(data) {
      // Solo agregar imágenes si estamos en la fila de encabezado y tenemos una columna válida
      if (data?.section === 'head' && 
          data.column?.index !== undefined && 
          data.column.index >= 1 && 
          data.column.index <= 6 && 
          data.cell) {
        
        const imageIndex = data.column.index - 1;
        
        // Verificar que el índice esté dentro del rango de imágenes
        if (imageIndex >= 0 && imageIndex < IMAGE_PATHS.length) {
          const imagePath = IMAGE_PATHS[imageIndex];
          
          // Solo proceder si tenemos coordenadas válidas
          if (typeof data.cell.x === 'number' && 
              typeof data.cell.y === 'number' && 
              typeof data.cell.width === 'number' && 
              typeof data.cell.height === 'number') {
            
            const xPos = data.cell.x + (data.cell.width - IMAGE_DIMENSIONS.width) / 2;
            const yPos = data.cell.y + (data.cell.height - IMAGE_DIMENSIONS.height) / 2;
            
            try {
              doc.addImage(
                imagePath,
                'JPEG',
                xPos,
                yPos,
                IMAGE_DIMENSIONS.width,
                IMAGE_DIMENSIONS.height
              );
            } catch (error) {
              console.warn(`Error al agregar imagen ${imagePath}:`, error);
            }
          }
        }
      }
    }
  });

  return {
    unidad: titulo,
    ...totales
  };
};

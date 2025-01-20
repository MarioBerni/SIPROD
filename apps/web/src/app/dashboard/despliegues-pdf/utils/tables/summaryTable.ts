import { jsPDF } from 'jspdf';
import { TABLE_STYLES, COLUMN_WIDTHS, IMAGE_DIMENSIONS, IMAGE_PATHS } from '../../constants/table.constants';
import type { TableTotals } from './dataTable';

/**
 * Calcula los totales finales de todas las tablas
 */
const calculateFinalTotals = (tableTotals: TableTotals[]): TableTotals => {
  return tableTotals.reduce((acc, total) => ({
    unidad: 'TOTAL',
    moviles: acc.moviles + total.moviles,
    ssoo: acc.ssoo + total.ssoo,
    motos: acc.motos + total.motos,
    hipos: acc.hipos + total.hipos,
    pieTierra: acc.pieTierra + total.pieTierra,
    totalPpss: acc.totalPpss + total.totalPpss,
  }), {
    unidad: 'TOTAL',
    moviles: 0, ssoo: 0, motos: 0, hipos: 0, pieTierra: 0, totalPpss: 0,
  });
};

/**
 * Prepara los datos para la tabla resumen
 */
const prepareSummaryData = (tableTotals: TableTotals[], finalTotals: TableTotals) => {
  return [
    ...tableTotals.map(total => [
      total.unidad || 'Sin título',
      total.moviles.toString(),
      total.ssoo.toString(),
      total.motos.toString(),
      total.hipos.toString(),
      total.pieTierra.toString(),
      total.totalPpss.toString(),
    ]),
    [
      { content: finalTotals.unidad, styles: TABLE_STYLES.TOTAL_CELL },
      { content: finalTotals.moviles.toString(), styles: TABLE_STYLES.TOTAL_CELL },
      { content: finalTotals.ssoo.toString(), styles: TABLE_STYLES.TOTAL_CELL },
      { content: finalTotals.motos.toString(), styles: TABLE_STYLES.TOTAL_CELL },
      { content: finalTotals.hipos.toString(), styles: TABLE_STYLES.TOTAL_CELL },
      { content: finalTotals.pieTierra.toString(), styles: TABLE_STYLES.TOTAL_CELL },
      { content: finalTotals.totalPpss.toString(), styles: TABLE_STYLES.TOTAL_CELL }
    ]
  ];
};

/**
 * Agrega la tabla resumen al PDF
 */
export const addSummaryTable = (doc: jsPDF, tableTotals: TableTotals[], startY: number): void => {
  const pageWidth = doc.internal.pageSize.width;
  const tableWidth = COLUMN_WIDTHS.NOMBRE_OPERATIVO + (COLUMN_WIDTHS.STANDARD * 6);
  const safeMargin = Math.max((pageWidth - tableWidth) / 2, 10); // Margen para centrar la tabla

  // Calcular totales finales
  const finalTotals = calculateFinalTotals(tableTotals);

  // Preparar encabezados
  const headers = [
    { content: 'Unidades' },
    { content: '', styles: { cellPadding: 2 } },
    { content: '', styles: { cellPadding: 2 } },
    { content: '', styles: { cellPadding: 2 } },
    { content: '', styles: { cellPadding: 2 } },
    { content: '', styles: { cellPadding: 2 } },
    { content: '', styles: { cellPadding: 2 } }
  ];

  // Preparar datos de la tabla
  const tableData = prepareSummaryData(tableTotals, finalTotals);

  // Ajustar fuente y dibujar título
  const titleText = 'RESUMEN';
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const titleWidth = doc.getTextWidth(titleText);

  // Dibuja el texto exactamente en startY
  doc.text(titleText, (pageWidth - titleWidth) / 2, startY);

  // Configurar y dibujar la tabla
  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: startY + 6, // Espacio después del título
    theme: 'striped',
    margin: { left: safeMargin, right: safeMargin, top: 15, bottom: 15 }, // Usar safeMargin para centrar
    styles: TABLE_STYLES.DEFAULT,
    columnStyles: {
      0: { halign: 'left' as const, cellWidth: COLUMN_WIDTHS.NOMBRE_OPERATIVO },
      1: { cellWidth: COLUMN_WIDTHS.STANDARD },
      2: { cellWidth: COLUMN_WIDTHS.STANDARD },
      3: { cellWidth: COLUMN_WIDTHS.STANDARD },
      4: { cellWidth: COLUMN_WIDTHS.STANDARD },
      5: { cellWidth: COLUMN_WIDTHS.STANDARD },
      6: { cellWidth: COLUMN_WIDTHS.STANDARD }
    },
    didDrawCell: function(data) {
      if (data?.section === 'head' && 
          data.column?.index !== undefined && 
          data.column.index >= 1 && 
          data.column.index <= 6 && 
          data.cell) {
        
        const imageIndex = data.column.index - 1;
        
        if (imageIndex >= 0 && imageIndex < IMAGE_PATHS.length) {
          const imagePath = IMAGE_PATHS[imageIndex];
          
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
};

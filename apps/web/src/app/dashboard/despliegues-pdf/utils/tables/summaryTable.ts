import { jsPDF } from 'jspdf';
import { TABLE_STYLES, COLUMN_WIDTHS, IMAGE_DIMENSIONS, IMAGE_PATHS } from '../../constants/table.constants';
import { SPACING, PAGINATION, PAGE_MARGINS } from '../../constants/pdf.constants';
import type { TableTotals } from './dataTable';
import { FormattedTableData } from '../../types/table.types';

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
const prepareSummaryData = (tableTotals: TableTotals[], finalTotals: Omit<TableTotals, 'unidad'>): FormattedTableData => {
  return [
    ...tableTotals.map(registro => [
      registro.unidad,
      registro.moviles.toString(),
      registro.ssoo.toString(),
      registro.motos.toString(),
      registro.hipos.toString(),
      registro.pieTierra.toString(),
      registro.totalPpss.toString()
    ]),
    [
      { content: 'TOTAL', styles: TABLE_STYLES.TOTAL_CELL },
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
 * Calcula cuántas filas caben en una página
 */
const calculateRowsPerPage = (doc: jsPDF, startY: number): number => {
  const pageHeight = doc.internal.pageSize.height;
  const availableHeight = pageHeight - startY - SPACING.footerHeight - PAGINATION.safetyMargin;
  return Math.floor(availableHeight / TABLE_STYLES.DEFAULT.minCellHeight);
};

/**
 * Divide los datos en chunks que caben en una página
 */
const splitDataIntoPages = (data: FormattedTableData, rowsPerPage: number): FormattedTableData[] => {
  const pages: FormattedTableData[] = [];
  for (let i = 0; i < data.length; i += rowsPerPage) {
    pages.push(data.slice(i, i + rowsPerPage));
  }
  return pages;
};

/**
 * Agrega la tabla resumen al PDF
 */
export const addSummaryTable = (doc: jsPDF, tableTotals: TableTotals[], startY: number): void => {
  // Calcular dimensiones de la tabla
  const tableWidth = COLUMN_WIDTHS.NOMBRE_OPERATIVO + (COLUMN_WIDTHS.STANDARD * 6);
  const pageWidth = doc.internal.pageSize.width;
  const safeMargin = Math.max((pageWidth - tableWidth) / 2, 10);

  // Calcular totales finales
  const finalTotals = calculateFinalTotals(tableTotals);

  // Preparar datos de la tabla
  const tableData = prepareSummaryData(tableTotals, finalTotals);

  // Calcular cuántas filas caben por página
  const rowsPerPage = calculateRowsPerPage(doc, startY);

  // Dividir los datos en páginas
  const dataPages = splitDataIntoPages(tableData, rowsPerPage);

  // Variable para rastrear la posición Y actual
  let currentY = startY;

  // Ajustar fuente y dibujar título
  const titleText = 'RESUMEN';
  
  // Guardar el estado actual
  const currentFontSize = doc.getFontSize();
  const currentTextColor = doc.getTextColor();
  const currentFont = doc.getFont();

  // Configurar estilo del título
  doc.setFontSize(TABLE_STYLES.TITLE.fontSize);
  doc.setTextColor(TABLE_STYLES.TITLE.textColor);
  doc.setFont(currentFont.fontName, TABLE_STYLES.TITLE.fontStyle);
  
  const titleWidth = doc.getTextWidth(titleText);
  doc.text(titleText, (pageWidth - titleWidth) / 2, startY);

  // Restaurar estado original
  doc.setFontSize(currentFontSize);
  doc.setTextColor(currentTextColor);
  doc.setFont(currentFont.fontName);
  
  // Dibujar cada página de la tabla
  for (let i = 0; i < dataPages.length; i++) {
    const pageData = dataPages[i];

    // Si no es la primera página, agregar una nueva y actualizar currentY
    if (i > 0) {
      doc.addPage();
      currentY = PAGE_MARGINS.top + SPACING.afterHeader;
    }

    // Preparar encabezados
    const headers = [
      [
        { content: 'Unidades', styles: TABLE_STYLES.HEADER_TEXT },
        { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
        { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
        { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
        { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
        { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
        { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } }
      ]
    ];

    // Configurar y dibujar la tabla para esta página
    doc.autoTable({
      head: headers,
      body: pageData,
      startY: currentY + 6, // Espacio después del título
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

    // Actualizar currentY para la siguiente iteración si es necesario
    if (i < dataPages.length - 1) {
      const table = doc.lastAutoTable;
      if (table) {
        currentY = table.finalY + SPACING.afterTable;
      }
    }
  }
};

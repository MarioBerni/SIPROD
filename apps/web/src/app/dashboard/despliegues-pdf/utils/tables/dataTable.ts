import { jsPDF } from 'jspdf';
import { PDFTableRow, FormattedTableData } from '../../types/table.types';
import { TABLE_STYLES, COLUMN_WIDTHS, IMAGE_DIMENSIONS, IMAGE_PATHS } from '../../constants/table.constants';
import { SPACING, PAGE_MARGINS } from '../../constants/pdf.constants';
import { formatOperativeName } from '../textUtils';
import { sortByOrderFrequency } from '../sortUtils';
import { CellHookData, UserOptions } from 'jspdf-autotable';

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
 * Prepara los datos de la tabla con el formato correcto
 */
const prepareTableData = (data: PDFTableRow[]): FormattedTableData => {
  console.log('\nPreparando datos de tabla');
  console.log('Datos antes de ordenar:', data.map((row: PDFTableRow) => ({
    nombreOperativo: row.nombreOperativo,
    tipoOrden: row.tipoOrden,
    nroOrden: row.nroOrden
  })));
  
  // Aplicar ordenación por frecuencia después de otras ordenaciones
  const sortedData = sortByOrderFrequency(data);
  
  return sortedData.map(row => [
    formatOperativeName(row.nombreOperativo),
    row.moviles.toString(),
    row.ssoo.toString(),
    row.motos.toString(),
    row.hipos.toString(),
    row.pieTierra.toString(),
    row.totalPpss.toString(),
    row.horaInicio,
    row.horaFin,
    row.seccional
  ]);
};


/**
 * Calcula el espacio disponible en la página actual
 */
const calculateAvailableSpace = (doc: jsPDF, currentY: number): number => {
  const pageHeight = doc.internal.pageSize.height;
  return pageHeight - currentY - SPACING.footerHeight - PAGE_MARGINS.bottom;
};

/**
 * Determina cuántas filas pueden caber en el espacio disponible
 */
const calculateFittingRows = (
  availableSpace: number,
  rowHeight: number,
  includeHeader: boolean = true,
  includeTotals: boolean = false,
  minRows: number = 2
): number => {
  const headerSpace = includeHeader ? (rowHeight * 1.2) : 0;
  const totalsSpace = includeTotals ? rowHeight : 0;
  const spaceForRows = availableSpace - headerSpace - totalsSpace;
  
  // Si no hay suficiente espacio ni para el encabezado, retornar 0
  if (spaceForRows <= 0) {
    return 0;
  }
  
  // Calcular número máximo de filas que caben
  const maxRows = Math.floor(spaceForRows / rowHeight);
  
  // Si no caben al menos las filas mínimas, retornar 0 para forzar nueva página
  if (maxRows < minRows) {
    return 0;
  }
  
  return maxRows;
};

/**
 * Agrega los datos de la tabla al PDF
 */
export const addTableData = (doc: jsPDF, data: PDFTableRow[], startY: number, titulo: string): TableTotals => {
  const rowHeight = TABLE_STYLES.DEFAULT.minCellHeight || 10;
  const tableWidth = COLUMN_WIDTHS.NOMBRE_OPERATIVO + 
    (COLUMN_WIDTHS.STANDARD * 6) + 
    (COLUMN_WIDTHS.HORA * 2) + 
    COLUMN_WIDTHS.SECCIONAL;
  const pageWidth = doc.internal.pageSize.width;
  const safeMargin = Math.max((pageWidth - tableWidth) / 2, PAGE_MARGINS.left);

  // Calcular totales y preparar datos
  const totales = calculateTotals(data);
  const tableData = prepareTableData(data);
  
  let currentY = startY;
  let remainingData = [...tableData];
  let isFirstChunk = true;

  while (remainingData.length > 0) {
    // Calcular espacio disponible
    const availableSpace = calculateAvailableSpace(doc, currentY);
    
    // Determinar si este será el último chunk
    const isLastChunk = remainingData.length <= calculateFittingRows(availableSpace, rowHeight, isFirstChunk, true);
    
    // Calcular cuántas filas caben en este chunk
    const fittingRows = calculateFittingRows(
      availableSpace,
      rowHeight,
      isFirstChunk,
      isLastChunk,
      2
    );

    // Si no hay espacio suficiente, crear nueva página
    if (fittingRows === 0) {
      doc.addPage();
      currentY = PAGE_MARGINS.top + SPACING.afterHeader;
      continue;
    }

    // Extraer datos para este chunk
    const chunkData = remainingData.slice(0, fittingRows);
    remainingData = remainingData.slice(fittingRows);

    // Configurar la tabla para este chunk
    const tableConfig: UserOptions = {
      startY: currentY,
      theme: 'striped' as const,
      margin: { left: safeMargin, right: safeMargin },
      styles: {
        ...TABLE_STYLES.DEFAULT,
        minCellHeight: rowHeight
      },
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
      // Solo incluir encabezado en el primer chunk
      head: isFirstChunk ? [
        [
          { content: 'Operativo', styles: TABLE_STYLES.HEADER_TEXT },
          { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
          { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
          { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
          { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
          { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
          { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
          { content: 'Hora Inicio', styles: TABLE_STYLES.HEADER_TEXT },
          { content: 'Hora Fin', styles: TABLE_STYLES.HEADER_TEXT },
          { content: 'Seccional', styles: TABLE_STYLES.HEADER_TEXT }
        ]
      ] : [],
      // Incluir totales solo en el último chunk
      body: isLastChunk ? 
        [...chunkData, [
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
        ]] : chunkData,
      didDrawCell: function(data: CellHookData) {
        // Agregar íconos solo en el encabezado del primer chunk
        if (isFirstChunk && data?.section === 'head' && 
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
    };

    // Dibujar la tabla
    doc.autoTable(tableConfig);

    // Actualizar estado para la siguiente iteración
    const table = doc.lastAutoTable;
    if (table) {
      currentY = table.finalY + (remainingData.length > 0 ? SPACING.afterTable : 0);
      isFirstChunk = false;
    }
  }

  return {
    unidad: titulo,
    ...totales
  };
};

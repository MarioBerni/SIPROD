import { ExtendedJsPDF } from '../types/pdf.types';
import { PDFTableRow, TableTotals } from '../types/table.types';
import { PAGE_MARGINS, SPACING, UNIT_TITLES } from '../constants/pdf.constants';
import { addTableData } from './tableUtils';
import { COLUMN_WIDTHS, IMAGE_DIMENSIONS, IMAGE_PATHS, TABLE_STYLES } from '../constants/table.constants';
import { jsPDF } from 'jspdf';
import { CellDef, UserOptions, Styles } from 'jspdf-autotable';
import { formatOperativeName } from './textUtils';
import { sortByOrderFrequency } from './sortUtils';

/**
 * Verifica si hay espacio suficiente para el título y al menos una parte de la tabla
 */
const hasSpaceForTitleAndTable = (
  doc: ExtendedJsPDF,
  currentY: number,
  rowCount: number,
  minRows: number = 2
): boolean => {
  const rowHeight = TABLE_STYLES.DEFAULT.minCellHeight || 10;
  const titleSpace = SPACING.beforeTitle + doc.getFontSize() / doc.internal.scaleFactor + SPACING.afterTitle;
  const headerHeight = rowHeight * 1.2; // Altura del encabezado de la tabla
  const minTableSpace = (minRows * rowHeight) + headerHeight;
  const totalSpaceNeeded = titleSpace + minTableSpace;

  const pageHeight = doc.internal.pageSize.height;
  const availableSpace = pageHeight - currentY - SPACING.footerHeight - PAGE_MARGINS.bottom;

  return availableSpace >= totalSpaceNeeded;
};

/**
 * Procesa una unidad individual y agrega su tabla al PDF
 */
export const processUnit = (
  doc: ExtendedJsPDF,
  unidad: string,
  datos: PDFTableRow[],
  currentY: number,
  pageWidth: number,
): { newY: number; totals: TableTotals } => {
  // Verificar si hay espacio suficiente para título y tabla
  if (!hasSpaceForTitleAndTable(doc, currentY, datos.length)) {
    doc.addPage();
    currentY = PAGE_MARGINS.top + SPACING.afterHeader;
  }

  // Agregar título de la unidad centrado
  currentY += SPACING.beforeTitle;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 51, 51);
  const titulo = UNIT_TITLES[unidad] || unidad;
  const titleWidth = doc.getStringUnitWidth(titulo) * doc.getFontSize() / doc.internal.scaleFactor;
  const titleX = (pageWidth - titleWidth) / 2;
  doc.text(titulo, titleX, currentY);
  currentY += SPACING.afterTitle;

  // Agregar la tabla de datos y obtener sus totales
  const totals = addTableData(doc, datos, currentY, titulo);
  const newY = (doc.previousAutoTable?.finalY || currentY) + SPACING.afterTable;

  return { newY, totals };
};

/**
 * Procesa un barrio individual y agrega su tabla al PDF
 */
export const processBarrio = (
  doc: ExtendedJsPDF,
  barrio: string,
  datos: PDFTableRow[],
  currentY: number,
  pageWidth: number,
): { newY: number; totals: TableTotals } => {
  // Verificar si hay espacio suficiente para título y tabla
  if (!hasSpaceForTitleAndTable(doc, currentY, datos.length)) {
    doc.addPage();
    currentY = PAGE_MARGINS.top + SPACING.afterHeader;
  }

  // Agregar título del barrio centrado
  currentY += SPACING.beforeTitle;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 51, 51);
  const titulo = barrio || "Sin barrio asignado";
  const titleWidth = doc.getStringUnitWidth(titulo) * doc.getFontSize() / doc.internal.scaleFactor;
  const titleX = (pageWidth - titleWidth) / 2;
  doc.text(titulo, titleX, currentY);
  currentY += SPACING.afterTitle;

  // Ordenar datos por totalPpss de mayor a menor
  const sortedData = [...datos].sort((a, b) => b.totalPpss - a.totalPpss);

  // Agregar la tabla de datos y obtener sus totales
  const totals = addTableData(doc, sortedData, currentY, titulo);
  const newY = (doc.previousAutoTable?.finalY || currentY) + SPACING.afterTable;

  return { newY, totals };
};

/**
 * Procesa los registros sin barrios asignados
 */
export const processUnassignedBarrios = (
  doc: ExtendedJsPDF,
  data: PDFTableRow[],
  currentY: number,
  pageWidth: number,
): { newY: number; totals: TableTotals } => {
  // Verificar si hay espacio suficiente para título y tabla
  if (!hasSpaceForTitleAndTable(doc, currentY, data.length)) {
    doc.addPage();
    currentY = PAGE_MARGINS.top + SPACING.afterHeader;
  }

  // Agregar título centrado
  currentY += SPACING.beforeTitle;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 51, 51);
  const titulo = "Sin barrios designados";
  const titleWidth = doc.getStringUnitWidth(titulo) * doc.getFontSize() / doc.internal.scaleFactor;
  const titleX = (pageWidth - titleWidth) / 2;
  doc.text(titulo, titleX, currentY);
  currentY += SPACING.afterTitle;

  // Agregar la tabla de datos y obtener sus totales
  const totals = addTableData(doc, data, currentY, titulo);
  const newY = (doc.previousAutoTable?.finalY || currentY) + SPACING.afterTable;

  return { newY, totals };
};

/**
 * Procesa una tabla personalizada y la agrega al PDF
 */
export const processCustomTable = (
  doc: ExtendedJsPDF,
  title: string,
  data: PDFTableRow[],
  currentY: number,
  pageWidth: number,
): { newY: number; totals: TableTotals } => {
  // Agrupar datos por unidad
  const dataByUnit = data.reduce((acc, row) => {
    const unit = row.unidad || 'Sin Unidad';
    if (!acc[unit]) {
      acc[unit] = [];
    }
    acc[unit].push(row);
    return acc;
  }, {} as Record<string, PDFTableRow[]>);

  // Verificar espacio y agregar nueva página si es necesario
  const estimatedTableHeight = (data.length + Object.keys(dataByUnit).length + 1) * 10 + 
                             SPACING.beforeTitle + SPACING.afterTitle;
  if (currentY + estimatedTableHeight > doc.internal.pageSize.height - PAGE_MARGINS.bottom) {
    doc.addPage();
    currentY = PAGE_MARGINS.top + SPACING.afterHeader;
  }

  // Agregar título principal de la tabla personalizada
  currentY += SPACING.beforeTitle;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 51, 51);
  const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
  const titleX = (pageWidth - titleWidth) / 2;
  doc.text(title, titleX, currentY);
  currentY += SPACING.afterTitle;

  const combinedTotals: TableTotals = {
    unidad: title,
    moviles: 0,
    ssoo: 0,
    motos: 0,
    hipos: 0,
    pieTierra: 0,
    totalPpss: 0
  };

  // Preparar todos los datos con subtítulos de unidad
  const allTableData: (string[] | CellDef[])[] = [];
  const headers: CellDef[] = [
    { content: 'Operativo', styles: TABLE_STYLES.HEADER_TEXT },
    { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
    { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
    { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
    { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
    { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
    { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 3 } },
    { content: 'Hora\ninicio', styles: TABLE_STYLES.HEADER_TEXT },
    { content: 'Hora\nfin', styles: TABLE_STYLES.HEADER_TEXT },
    { content: 'Secc.', styles: TABLE_STYLES.HEADER_TEXT }
  ];

  // Procesar cada unidad y agregar sus datos
  for (const [unit, unitData] of Object.entries(dataByUnit)) {
    const unitTitle = UNIT_TITLES[unit] || unit;
    
    // Agregar subtítulo de unidad como una fila especial
    allTableData.push([{
      content: unitTitle,
      colSpan: 10,
      styles: {
        textColor: [51, 51, 51],
        fontStyle: 'bold',
        fontSize: 10,
        cellPadding: 5,
        halign: 'center',
        fillColor: [255, 255, 255],
        valign: 'middle'
      } as Partial<Styles>
    }]);

    // Agregar datos de la unidad
    console.log(`\nOrdenando datos para unidad: ${unit}`);
    console.log('Datos antes de ordenar:', unitData.map((row: PDFTableRow) => ({
      nombreOperativo: row.nombreOperativo,
      tipoOrden: row.tipoOrden,
      nroOrden: row.nroOrden
    })));
    
    const sortedUnitData = sortByOrderFrequency(unitData);
    sortedUnitData.forEach(row => {
      allTableData.push([
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
    });

    // Acumular totales
    const unitTotals = {
      moviles: unitData.reduce((sum, row) => sum + (Number(row.moviles) || 0), 0),
      ssoo: unitData.reduce((sum, row) => sum + (Number(row.ssoo) || 0), 0),
      motos: unitData.reduce((sum, row) => sum + (Number(row.motos) || 0), 0),
      hipos: unitData.reduce((sum, row) => sum + (Number(row.hipos) || 0), 0),
      pieTierra: unitData.reduce((sum, row) => sum + (Number(row.pieTierra) || 0), 0),
      totalPpss: unitData.reduce((sum, row) => sum + (Number(row.totalPpss) || 0), 0)
    };

    combinedTotals.moviles += unitTotals.moviles;
    combinedTotals.ssoo += unitTotals.ssoo;
    combinedTotals.motos += unitTotals.motos;
    combinedTotals.hipos += unitTotals.hipos;
    combinedTotals.pieTierra += unitTotals.pieTierra;
    combinedTotals.totalPpss += unitTotals.totalPpss;
  }

  // Agregar fila de totales generales
  allTableData.push([
    { content: 'TOTAL', styles: TABLE_STYLES.TOTAL_CELL },
    { content: combinedTotals.moviles.toString(), styles: TABLE_STYLES.TOTAL_CELL },
    { content: combinedTotals.ssoo.toString(), styles: TABLE_STYLES.TOTAL_CELL },
    { content: combinedTotals.motos.toString(), styles: TABLE_STYLES.TOTAL_CELL },
    { content: combinedTotals.hipos.toString(), styles: TABLE_STYLES.TOTAL_CELL },
    { content: combinedTotals.pieTierra.toString(), styles: TABLE_STYLES.TOTAL_CELL },
    { content: combinedTotals.totalPpss.toString(), styles: TABLE_STYLES.TOTAL_CELL },
    { content: '', styles: TABLE_STYLES.EMPTY_CELL },
    { content: '', styles: TABLE_STYLES.EMPTY_CELL },
    { content: '', styles: TABLE_STYLES.EMPTY_CELL }
  ]);

  // Extender el tipo jsPDF para incluir autoTable
  interface ExtendedJsPDFWithAutoTable extends jsPDF {
    autoTable: (options: UserOptions) => void;
    previousAutoTable?: {
      finalY: number;
    };
  }

  // Calcular dimensiones de la tabla para centrado
  const tableWidth = COLUMN_WIDTHS.NOMBRE_OPERATIVO + 
    (COLUMN_WIDTHS.STANDARD * 6) + 
    (COLUMN_WIDTHS.HORA * 2) + 
    COLUMN_WIDTHS.SECCIONAL;
  const docWidth = doc.internal.pageSize.width;
  const safeMargin = Math.max((docWidth - tableWidth) / 2, 10);

  // Generar la tabla completa con un solo encabezado
  (doc as ExtendedJsPDFWithAutoTable).autoTable({
    head: [headers],
    body: allTableData,
    startY: currentY - 2,
    theme: 'striped',
    margin: { left: safeMargin, right: safeMargin },
    styles: TABLE_STYLES.DEFAULT,
    columnStyles: {
      0: { cellWidth: COLUMN_WIDTHS.NOMBRE_OPERATIVO },
      7: { cellWidth: COLUMN_WIDTHS.HORA },
      8: { cellWidth: COLUMN_WIDTHS.HORA },
      9: { cellWidth: COLUMN_WIDTHS.SECCIONAL }
    },
    didDrawCell: function (data) {
      if (data.section === 'head' && data.column.index > 0 && data.column.index < 7) {
        const { x, y } = data.cell;
        const imageIndex = data.column.index - 1;
        doc.addImage(
          IMAGE_PATHS[imageIndex],
          'JPEG',
          x + (data.cell.width - IMAGE_DIMENSIONS.width) / 2,
          y + (data.cell.height - IMAGE_DIMENSIONS.height) / 2,
          IMAGE_DIMENSIONS.width,
          IMAGE_DIMENSIONS.height
        );
      }
    }
  });

  const newY = (doc.previousAutoTable?.finalY || currentY) + SPACING.afterTable;
  return { newY, totals: combinedTotals };
};

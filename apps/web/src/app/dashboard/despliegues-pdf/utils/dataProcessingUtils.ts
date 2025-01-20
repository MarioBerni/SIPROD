import { ExtendedJsPDF } from '../types/pdf.types';
import { PDFTableRow } from '../types';
import { PAGE_MARGINS, SPACING, UNIT_TITLES } from '../constants/pdf.constants';
import { addTableData } from './tableUtils';
import { TableTotals } from './tableUtils';
import { COLUMN_WIDTHS, IMAGE_DIMENSIONS, IMAGE_PATHS, TABLE_STYLES } from '../constants/table.constants';
import { jsPDF } from 'jspdf';
import { CellDef, UserOptions, Styles } from 'jspdf-autotable';

/**
 * Procesa una unidad individual y agrega su tabla al PDF
 */
export const processUnit = (
  doc: ExtendedJsPDF,
  unidad: string,
  datos: PDFTableRow[],
  currentY: number,
  pageWidth: number,
  pageHeight: number
): { newY: number; totals: TableTotals } => {
  // Verificar si hay espacio suficiente para la tabla
  const estimatedTableHeight = (datos.length + 1) * 10 + SPACING.beforeTitle + SPACING.afterTitle;
  if (currentY + estimatedTableHeight > pageHeight - PAGE_MARGINS.bottom) {
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
 * Procesa una tabla personalizada y la agrega al PDF
 */
export const processCustomTable = (
  doc: ExtendedJsPDF,
  title: string,
  data: PDFTableRow[],
  currentY: number,
  pageWidth: number,
  pageHeight: number
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
  if (currentY + estimatedTableHeight > pageHeight - PAGE_MARGINS.bottom) {
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
    { content: 'Nombre Operativo' },
    { content: '', styles: { cellPadding: 2 } },
    { content: '', styles: { cellPadding: 2 } },
    { content: '', styles: { cellPadding: 2 } },
    { content: '', styles: { cellPadding: 2 } },
    { content: '', styles: { cellPadding: 2 } },
    { content: '', styles: { cellPadding: 2 } },
    { content: 'Hora\ninicio' },
    { content: 'Hora\nfin' },
    { content: 'Secc.' }
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
    unitData.forEach(row => {
      allTableData.push([
        row.nombreOperativo,
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
    startY: currentY,
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
      // Solo agregar imágenes en el encabezado
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

  const newY = (doc.previousAutoTable?.finalY || currentY) + SPACING.afterTable;
  return { newY, totals: combinedTotals };
};

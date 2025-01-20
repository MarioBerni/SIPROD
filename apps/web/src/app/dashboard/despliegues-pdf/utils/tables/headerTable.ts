import { jsPDF } from 'jspdf';
import { TABLE_STYLES, COLUMN_WIDTHS, IMAGE_DIMENSIONS, IMAGE_PATHS } from '../../constants/table.constants';

/**
 * Crea los encabezados de la tabla
 */
export const createTableHeaders = () => {
  return [
    { content: 'Nombre Operativo', styles: TABLE_STYLES.HEADER_TEXT },
    { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 2 } },
    { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 2 } },
    { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 2 } },
    { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 2 } },
    { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 2 } },
    { content: '', styles: { ...TABLE_STYLES.HEADER_ICON, cellPadding: 2 } },
    { content: 'Hora\ninicio', styles: TABLE_STYLES.HEADER_TEXT },
    { content: 'Hora\nfin', styles: TABLE_STYLES.HEADER_TEXT },
    { content: 'Secc.', styles: TABLE_STYLES.HEADER_TEXT }
  ];
};

/**
 * Agrega el encabezado de la tabla al PDF
 */
export const addTableHeader = (doc: jsPDF, startY: number): void => {
  const tableHeight = 6 * 8;
  
  if (startY + tableHeight > doc.internal.pageSize.getHeight() - 20) {
    doc.addPage();
    startY = 40;
  }

  const headers = createTableHeaders();
  const exampleData = [
    ['OPERATIVO II - ZONA - BARRIO MARCONI BARRIO MARCONI BARRIO MARCONI', '2', '4', '2', '2', '2', '12', '07:00', '19:00', '12, 14'],
    ['OPERATIVO DELTA', '3', '2', '1', '4', '2', '8', '08:30', '20:30', '15, 16'],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '']
  ];

  doc.autoTable({
    head: [headers],
    body: exampleData,
    startY: startY - 2,
    theme: 'striped',
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
    },
    margin: { top: 15, right: 10, bottom: 15, left: 10 }
  });
};

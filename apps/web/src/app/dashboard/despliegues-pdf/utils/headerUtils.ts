import { jsPDF } from 'jspdf';
import { margins, images, monthNames } from './constants';
import { drawDividerLine } from './pdfHelpers';

export const getMonthName = (monthIndex: number): string => {
  return monthNames[monthIndex];
};

export const addHeader = (doc: jsPDF): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  try {
    // Añadir el logo como imagen
    doc.addImage(images.logo, 'WEBP', margins.left, margins.top - 6, 15, 15);

    // Configurar fuente para el título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    // Texto central (título y subtítulo)
    const centerX = pageWidth / 2;
    doc.text('Dirección Nacional Guardia Republicana', centerX, margins.top + 1, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Estado Mayor Policial', centerX, margins.top + 5, { align: 'center' });

    // Fecha y hora actual
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()} de ${getMonthName(
      currentDate.getMonth()
    )} de ${currentDate.getFullYear()}`;
    const formattedTime = currentDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    // Fecha y hora (lado derecho)
    doc.setFontSize(9);
    doc.text(formattedDate, pageWidth - margins.right, margins.top + 1, { align: 'right' });
    doc.text(formattedTime, pageWidth - margins.right, margins.top + 5, { align: 'right' });

    // Agregar línea divisoria debajo del encabezado
    drawDividerLine(doc, margins.top + 12);

  } catch (error) {
    console.error('Error al cargar el logo:', error);
    const centerX = pageWidth / 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Dirección Nacional Guardia Republicana', centerX, margins.top + 1, { align: 'center' });
  }
};

export const addFooter = (doc: jsPDF): void => {
  const pageHeight = doc.internal.pageSize.getHeight();

  try {
    // Calcular posición vertical del pie de página
    const footerY = pageHeight - margins.bottom;
    const logoY = footerY - 8;

    // Configurar fuente para el pie de página
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(102, 102, 102);

    // Añadir logo y texto alineado a la izquierda
    const logoSize = 10;
    doc.addImage(images.siprodLogo, 'PNG', margins.left, logoY, logoSize, logoSize);

    // Texto del pie de página
    doc.setFont('helvetica', 'bold');
    doc.text('S.I.P.R.O.D.', margins.left + logoSize + 5, logoY + 4, { align: 'left' });
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Información de Patrullajes y Recursos Operativos Digitales', 
             margins.left + logoSize + 5, logoY + 8, { align: 'left' });

  } catch (error) {
    console.error('Error al cargar el logo de SIPROD:', error);
    const footerY = pageHeight - margins.bottom;
    const textY = footerY - 6;
    
    drawDividerLine(doc, textY - 2);

    doc.setFont('helvetica', 'bold');
    doc.text('S.I.P.R.O.D.', margins.left, textY, { align: 'left' });
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Información de Patrullajes y Recursos Operativos Digitales', 
             margins.left, textY + 4, { align: 'left' });
  }
};

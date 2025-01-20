import { jsPDF } from 'jspdf';
import { ExtendedJsPDF } from '../types/pdf.types';
import { addHeader, addFooter } from './headerUtils';

/**
 * Agrega encabezado y pie de página al documento
 */
export const addHeaderAndFooter = (document: ExtendedJsPDF): void => {
  // Guardar el estado actual
  const currentFontSize = document.getFontSize();
  const currentTextColor = document.getTextColor();
  const currentFont = document.getFont();

  // Agregar encabezado y pie de página
  addHeader(document);
  addFooter(document);

  // Restaurar el estado
  document.setFontSize(currentFontSize);
  document.setTextColor(currentTextColor);
  document.setFont(currentFont.fontName);
};

/**
 * Configura el evento de nueva página para agregar encabezado y pie de página automáticamente
 */
export const setupPageEvent = (doc: ExtendedJsPDF): void => {
  const originalAddPage = doc.addPage.bind(doc);
  doc.addPage = function(this: ExtendedJsPDF, format?: string | [number, number]): jsPDF {
    // Agregar la nueva página
    const result = originalAddPage.call(this, format);
    
    // Solo agregar encabezado y pie de página si no es la primera página
    if (this.getNumberOfPages() > 1) {
      addHeaderAndFooter(this);
    }
    
    return result;
  };
};

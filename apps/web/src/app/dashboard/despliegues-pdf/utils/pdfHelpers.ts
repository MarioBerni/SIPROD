import { jsPDF } from 'jspdf';
import { colors, margins } from './constants';

export const drawDividerLine = (doc: jsPDF, y: number): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setDrawColor(parseInt(colors.dividerLine.slice(1, 3), 16),
                   parseInt(colors.dividerLine.slice(3, 5), 16),
                   parseInt(colors.dividerLine.slice(5, 7), 16));
  doc.setLineWidth(0.2);
  doc.line(margins.left, y, pageWidth - margins.right, y);
};

export const calculateColumnWidths = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth() - margins.left - margins.right;
  return {
    time: pageWidth * 0.07,
    secc: pageWidth * 0.08,
    name: pageWidth * 0.30,
    image: (pageWidth - (pageWidth * 0.07 * 2) - (pageWidth * 0.08) - (pageWidth * 0.30)) / 6
  };
};

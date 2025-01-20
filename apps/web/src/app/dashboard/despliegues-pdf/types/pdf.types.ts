import { jsPDF } from 'jspdf';

export interface ExtendedJsPDF extends jsPDF {
  previousAutoTable?: {
    finalY: number;
  };
  addPage: (format?: string | [number, number] | undefined) => jsPDF;
}

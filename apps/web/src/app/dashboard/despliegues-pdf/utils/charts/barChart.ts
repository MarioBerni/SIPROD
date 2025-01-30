import { jsPDF } from 'jspdf';
import { SPACING } from '../../constants/pdf.constants';
import { TABLE_STYLES } from '../../constants/table.constants';

interface BarChartData {
  label: string;
  value: number;
}

interface BarChartOptions {
  title?: string;
  width?: number;
  height?: number;
  maxBars?: number;
  orientation?: 'vertical' | 'horizontal';
}

const defaultOptions: Required<BarChartOptions> = {
  title: '',
  width: 180,
  height: 100,
  maxBars: 15, // Máximo de barras para mantener la legibilidad
  orientation: 'vertical'
};

// Estilos consistentes con el diseño del PDF
const CHART_STYLES = {
  TITLE: {
    ...TABLE_STYLES.TITLE,
    fontSize: 14
  },
  AXIS: {
    lineWidth: 0.5,
    color: [51, 51, 51] as [number, number, number]
  },
  BARS: {
    primary: TABLE_STYLES.HEADER_TEXT.fillColor as [number, number, number],
    border: [31, 118, 175] as [number, number, number]
  },
  LABELS: {
    fontSize: TABLE_STYLES.DEFAULT.fontSize,
    color: [51, 51, 51] as [number, number, number]
  },
  VALUES: {
    fontSize: 8,
    color: [255, 255, 255] as [number, number, number]
  },
  GRID: {
    color: [200, 200, 200] as [number, number, number],
    lineWidth: 0.1
  }
};

/**
 * Agrega una gráfica de barras al PDF
 */
export const addBarChart = (
  doc: jsPDF,
  data: BarChartData[],
  startY: number,
  options: BarChartOptions = {}
): number => {
  const opt = { ...defaultOptions, ...options };
  const pageWidth = doc.internal.pageSize.width;
  const chartX = (pageWidth - opt.width) / 2;

  // Ordenar datos de mayor a menor
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Limitar el número de barras si es necesario
  const limitedData = sortedData.slice(0, opt.maxBars);

  // Calcular dimensiones
  const margin = { 
    top: 15, 
    right: opt.orientation === 'horizontal' ? 35 : 20, 
    bottom: opt.orientation === 'horizontal' ? 20 : 35, 
    left: opt.orientation === 'horizontal' ? 60 : 30 
  };
  
  const maxLabelWidth = Math.max(...limitedData.map(d => {
    doc.setFontSize(CHART_STYLES.LABELS.fontSize);
    return doc.getStringUnitWidth(d.label) * doc.getFontSize() / doc.internal.scaleFactor;
  }));

  // Ajustar margen izquierdo para etiquetas horizontales
  if (opt.orientation === 'horizontal') {
    margin.left = Math.max(margin.left, maxLabelWidth + 10);
  }

  const barSpacing = 3;
  const availableWidth = opt.width - (margin.left + margin.right);
  const availableHeight = opt.height - (margin.top + margin.bottom);
  
  const isHorizontal = opt.orientation === 'horizontal';
  const barThickness = ((isHorizontal ? availableHeight : availableWidth) / limitedData.length) - barSpacing;
  
  const maxValue = Math.max(...limitedData.map(d => d.value));

  // Dibujar título si existe
  let currentY = startY;
  if (opt.title) {
    doc.setFontSize(CHART_STYLES.TITLE.fontSize);
    doc.setFont('helvetica', CHART_STYLES.TITLE.fontStyle);
    doc.setTextColor(0);
    const titleWidth = doc.getStringUnitWidth(opt.title) * doc.getFontSize() / doc.internal.scaleFactor;
    doc.text(opt.title, (pageWidth - titleWidth) / 2, currentY);
    currentY += SPACING.afterTitle;
  }

  // Dibujar grilla
  const gridLines = 5;
  doc.setDrawColor(...CHART_STYLES.GRID.color);
  doc.setLineWidth(CHART_STYLES.GRID.lineWidth);
  
  for (let i = 0; i <= gridLines; i++) {
    const value = Math.round((maxValue * i) / gridLines);
    const pos = (i / gridLines) * (isHorizontal ? availableWidth : availableHeight);
    
    if (isHorizontal) {
      const x = chartX + margin.left + pos;
      doc.line(x, currentY + margin.top, x, currentY + opt.height - margin.bottom);
      
      // Valores en el eje X
      doc.setFontSize(CHART_STYLES.LABELS.fontSize);
      doc.setTextColor(...CHART_STYLES.LABELS.color);
      doc.text(
        value.toString(),
        x,
        currentY + opt.height - margin.bottom + 10,
        { align: 'center' }
      );
    } else {
      const y = currentY + margin.top + (availableHeight * (1 - i / gridLines));
      doc.line(
        chartX + margin.left,
        y,
        chartX + opt.width - margin.right,
        y
      );
      
      // Valores en el eje Y
      doc.setFontSize(CHART_STYLES.LABELS.fontSize);
      doc.setTextColor(...CHART_STYLES.LABELS.color);
      doc.text(
        value.toString(),
        chartX + margin.left - 5,
        y,
        { align: 'right' }
      );
    }
  }

  // Dibujar ejes
  doc.setDrawColor(...CHART_STYLES.AXIS.color);
  doc.setLineWidth(CHART_STYLES.AXIS.lineWidth);
  
  // Eje vertical
  doc.line(
    chartX + margin.left,
    currentY + margin.top,
    chartX + margin.left,
    currentY + opt.height - margin.bottom
  );
  
  // Eje horizontal
  doc.line(
    chartX + margin.left,
    currentY + opt.height - margin.bottom,
    chartX + opt.width - margin.right,
    currentY + opt.height - margin.bottom
  );

  // Dibujar barras y etiquetas
  limitedData.forEach((item, index) => {
    const value = item.value;
    const normalizedValue = value / maxValue;
    
    let x, y, width, height;
    
    if (isHorizontal) {
      width = normalizedValue * availableWidth;
      height = barThickness;
      x = chartX + margin.left;
      y = currentY + margin.top + (index * (barThickness + barSpacing));
    } else {
      width = barThickness;
      height = normalizedValue * availableHeight;
      x = chartX + margin.left + (index * (barThickness + barSpacing));
      y = currentY + opt.height - margin.bottom - height;
    }

    // Dibujar barra con borde
    doc.setFillColor(...CHART_STYLES.BARS.primary);
    doc.setDrawColor(...CHART_STYLES.BARS.border);
    doc.setLineWidth(0.1);
    
    if (isHorizontal) {
      doc.roundedRect(x, y, width, height, 1, 1, 'FD');
    } else {
      doc.roundedRect(x, y, width, height, 1, 1, 'FD');
    }

    // Valor
    doc.setFontSize(CHART_STYLES.VALUES.fontSize);
    const valueText = value.toString();
    const valueWidth = doc.getStringUnitWidth(valueText) * doc.getFontSize() / doc.internal.scaleFactor;
    
    if (isHorizontal) {
      const hasSpace = width > valueWidth + 4;
      doc.setTextColor(...(hasSpace ? CHART_STYLES.VALUES.color : CHART_STYLES.LABELS.color));
      doc.text(
        valueText,
        hasSpace ? x + width - 2 : x + width + 2,
        y + (height / 2),
        { align: hasSpace ? 'right' : 'left', baseline: 'middle' }
      );
    } else {
      const hasSpace = height > 15;
      doc.setTextColor(...(hasSpace ? CHART_STYLES.VALUES.color : CHART_STYLES.LABELS.color));
      doc.text(
        valueText,
        x + (width / 2),
        hasSpace ? y + height / 2 : y - 2,
        { align: 'center' }
      );
    }

    // Etiqueta
    doc.setFontSize(CHART_STYLES.LABELS.fontSize);
    doc.setTextColor(...CHART_STYLES.LABELS.color);
    const label = item.label;
    
    if (isHorizontal) {
      // Para gráficas horizontales, alinear las etiquetas a la izquierda
      doc.text(
        label,
        chartX + margin.left - 5,
        y + (height / 2),
        { align: 'right', baseline: 'middle' }
      );
    } else {
      // Para gráficas verticales, rotar las etiquetas
      const labelWidth = doc.getStringUnitWidth(label) * doc.getFontSize() / doc.internal.scaleFactor;
      doc.text(
        label,
        x + (width - labelWidth) / 2,
        currentY + opt.height - margin.bottom + 15,
        { angle: 45 }
      );
    }
  });

  return currentY + opt.height + SPACING.afterTable;
};

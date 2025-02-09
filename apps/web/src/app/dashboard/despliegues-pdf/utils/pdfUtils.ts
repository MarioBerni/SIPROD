import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { tablaPrincipalApi } from '@/lib/api';
import { FilterFormState } from '../types';
import { ExtendedJsPDF } from '../types/pdf.types';
import { PAGE_MARGINS, SPACING } from '../constants/pdf.constants';
import { addHeaderAndFooter, setupPageEvent } from './documentUtils';
import { processUnit, processCustomTable, processBarrio, processUnassignedBarrios } from './dataProcessingUtils';
import { addSummaryTable, TableTotals } from './tableUtils';
import { PDFTableRow } from '../types/table.types';
import { addBarChart } from './charts/barChart';

/**
 * Genera un PDF con el informe de despliegue
 * @param filters Filtros aplicados
 * @returns Promise que se resuelve cuando el PDF se ha generado
 */
export const generateSimplePDF = async (filters: FilterFormState): Promise<void> => {
  console.log('Iniciando generación de PDF con filtros:', filters);
  console.log('Valor de organizarPor:', filters.organizarPor);
  console.log('¿Es igual a "Grupos Operativos"?:', filters.organizarPor === 'Grupos Operativos');
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  }) as ExtendedJsPDF;

  // Definir dimensiones de página
  const pageWidth = doc.internal.pageSize.getWidth();

  try {
    // Configurar eventos de página
    setupPageEvent(doc);

    // Obtener datos filtrados
    console.log('Solicitando datos filtrados con filtros:', {
      unidades: filters.unidades,
      tiempoOperativo: filters.tiempoOperativo,
      nombreOperativo: filters.nombreOperativo
    });

    const datosFiltrados = await tablaPrincipalApi.getFilteredDataForPDF({
      unidades: filters.unidades,
      tiempoOperativo: filters.tiempoOperativo,
      nombreOperativo: filters.nombreOperativo
    });
    console.log('Datos filtrados recibidos:', datosFiltrados);

    // Iniciar desde el margen superior de la primera página
    addHeaderAndFooter(doc);
    let currentY = PAGE_MARGINS.top + SPACING.afterHeader;

    // Agregar descripción si existe
    if (filters.descripcion && filters.descripcion.trim() !== '') {
      currentY += 5; // Espacio para la descripción
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Descripción del Informe:', PAGE_MARGINS.left, currentY);
      currentY += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      // Dividir la descripción en líneas para que quepa en el ancho de la página
      const maxWidth = pageWidth - PAGE_MARGINS.left - PAGE_MARGINS.right;
      const lines = doc.splitTextToSize(filters.descripcion.trim(), maxWidth);
      
      doc.text(lines, PAGE_MARGINS.left, currentY);
      currentY += (lines.length * 4) + 1;
    }

    const allTotals: TableTotals[] = [];

    if (filters.organizarPor === 'Barrios') {
      console.log('Procesando datos por barrios');
      const datosPorBarrio: Record<string, PDFTableRow[]> = {};
      const datosNoAsignados: PDFTableRow[] = [];
      
      Object.entries(datosFiltrados).forEach(([, datos]) => {
        datos.forEach(dato => {
          if (dato.barrios && Array.isArray(dato.barrios) && dato.barrios.length > 0) {
            // Si tiene barrios asignados, procesar cada barrio
            dato.barrios.forEach(barrio => {
              if (barrio && barrio.trim()) {
                if (!datosPorBarrio[barrio]) {
                  datosPorBarrio[barrio] = [];
                }
                datosPorBarrio[barrio].push(dato);
              }
            });
          } else {
            // Si no tiene barrios asignados, agregar a la lista de no asignados
            datosNoAsignados.push(dato);
          }
        });
      });

      // Calcular el total de PPSS por barrio y ordenar
      const barriosConTotales = Object.entries(datosPorBarrio).map(([barrio, datos]) => {
        const totalPpss = datos.reduce((acc, dato) => acc + (Number(dato.totalPpss) || 0), 0);
        return { barrio, datos, totalPpss };
      }).sort((a, b) => b.totalPpss - a.totalPpss); // Ordenar de mayor a menor

      // Procesar cada barrio en orden de totalPpss
      for (const { barrio, datos } of barriosConTotales) {
        try {
          console.log(`Procesando barrio: ${barrio} con ${datos.length} registros y totalPpss: ${datos.reduce((acc, d) => acc + (Number(d.totalPpss) || 0), 0)}`);
          const { newY, totals } = await processBarrio(doc, barrio, datos, currentY, pageWidth);
          currentY = newY;
          allTotals.push(totals);
        } catch (error) {
          console.error(`Error procesando barrio ${barrio}:`, error);
          throw error;
        }
      }

      // Procesar registros sin barrios asignados al final
      if (datosNoAsignados.length > 0) {
        try {
          console.log(`Procesando registros sin barrios asignados: ${datosNoAsignados.length} registros`);
          const { newY, totals } = await processUnassignedBarrios(doc, datosNoAsignados, currentY, pageWidth);
          currentY = newY;
          allTotals.push(totals);
        } catch (error) {
          console.error('Error procesando registros sin barrios:', error);
          throw error;
        }
      }

    } else if (filters.organizarPor === 'Grupos Operativos') {
      console.log('Saltando procesamiento por unidades - ES Grupos Operativos');
    } else {
      console.log('Entrando al procesamiento por unidades - NO es Grupos Operativos');
      if (Object.keys(datosFiltrados).length > 0) {
        console.log('Procesando datos por unidad. Unidades encontradas:', Object.keys(datosFiltrados));
        
        for (const [unidad, datos] of Object.entries(datosFiltrados)) {
          try {
            console.log(`Procesando unidad: ${unidad} con ${datos.length} registros`);
            const { newY, totals } = processUnit(doc, unidad, datos, currentY, pageWidth);
            currentY = newY;
            allTotals.push(totals);
          } catch (error) {
            console.error(`Error procesando unidad ${unidad}:`, error);
            throw error;
          }
        }
      }
    }

    // Procesar tablas personalizadas
    if (filters.customTables && filters.customTables.length > 0) {
      console.log('Procesando tablas personalizadas:', filters.customTables);
      
      for (const customTable of filters.customTables) {
        try {
          if (!customTable.selectedOperativos.length) {
            console.log(`Saltando tabla ${customTable.title} - sin operativos seleccionados`);
            continue;
          }

          console.log(`Obteniendo datos para tabla personalizada: ${customTable.title}`);
          const customTableData = await tablaPrincipalApi.getFilteredDataForPDF({
            selectedOperativos: customTable.selectedOperativos
          });

          // Combinar los datos manteniendo la información de unidad
          const combinedData = Object.entries(customTableData).flatMap(([unidad, rows]) => 
            rows.map(row => ({ ...row, unidad }))
          );

          if (combinedData.length > 0) {
            console.log(`Procesando tabla personalizada: ${customTable.title} con ${combinedData.length} registros`);
            const { newY, totals } = processCustomTable(doc, customTable.title, combinedData, currentY, pageWidth);
            currentY = newY;
            allTotals.push(totals);
          } else {
            console.log(`No hay datos para procesar en la tabla ${customTable.title}`);
          }
        } catch (error) {
          console.error(`Error procesando tabla personalizada ${customTable.title}:`, error);
          throw error;
        }
      }
    } else {
      console.log('No hay tablas personalizadas para procesar');
    }

    // Siempre agregar la tabla resumen al final
    if (allTotals.length > 0) {
      console.log('Agregando tabla resumen con totales:', allTotals);
      doc.addPage();
      let currentY = 40; // Usar un punto de inicio uniforme para la tabla resumen
      
      // Agregar la tabla resumen
      addSummaryTable(doc, allTotals, currentY, filters.organizarPor);

      // Si estamos organizando por barrios, agregar la gráfica después de la tabla resumen
      if (filters.organizarPor === 'Barrios') {
        // Preparar datos para la gráfica
        const datosGrafica = allTotals.map(total => ({
          label: total.unidad,
          value: total.totalPpss
        })).sort((a, b) => b.value - a.value);

        // Agregar la gráfica en una nueva página horizontal
        doc.addPage('l'); // 'l' para landscape (horizontal)
        currentY = 40;
        addBarChart(doc, datosGrafica, currentY, {
          title: 'Total de Personal por Barrio',
          width: 250, // Más ancho para aprovechar la orientación horizontal
          height: 150,
          orientation: 'horizontal'
        });
      }
    } else {
      console.log('No hay totales para agregar a la tabla resumen');
    }

    // Guardar el PDF con fecha y hora
    const now = new Date();
    const fecha = now.toLocaleDateString('es-UY', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');
    const hora = now.toLocaleTimeString('es-UY', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }).replace(':', '');
    
    const fileName = `Despliegue DNGR ${fecha}_${hora}_SIPROD.pdf`;
    doc.save(fileName);
    console.log('PDF generado exitosamente:', fileName);

  } catch (error) {
    console.error('Error generando el PDF:', error);
    throw error;
  }
};

// Re-exportar todas las utilidades para mantener la API pública
export * from './headerUtils';
export * from './tableUtils';
export * from './documentUtils';
export * from './dataProcessingUtils';
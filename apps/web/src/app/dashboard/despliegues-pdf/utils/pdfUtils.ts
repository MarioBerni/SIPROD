import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { tablaPrincipalApi } from '@/lib/api';
import { FilterFormState } from '../types';
import { ExtendedJsPDF } from '../types/pdf.types';
import { PAGE_MARGINS, SPACING } from '../constants/pdf.constants';
import { addHeaderAndFooter, setupPageEvent } from './documentUtils';
import { processUnit, processCustomTable } from './dataProcessingUtils';
import { addSummaryTable, TableTotals } from './tableUtils';

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
    format: 'a4',
    putOnlyUsedFonts: true,
  }) as ExtendedJsPDF;

  // Definir dimensiones de página
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

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

    // Array para almacenar los totales de cada tabla
    const tableTotals: TableTotals[] = [];

    // Solo procesar datos por unidad si no está seleccionado "Grupos Operativos"
    console.log('Verificando condición de organización:', {
      organizarPor: filters.organizarPor,
      condicion: filters.organizarPor !== 'Grupos Operativos',
      longitud: filters.organizarPor?.length,
      tipo: typeof filters.organizarPor
    });

    if (filters.organizarPor !== 'Grupos Operativos') {
      console.log('Entrando al procesamiento por unidades - NO es Grupos Operativos');
      if (Object.keys(datosFiltrados).length > 0) {
        console.log('Procesando datos por unidad. Unidades encontradas:', Object.keys(datosFiltrados));
        
        for (const [unidad, datos] of Object.entries(datosFiltrados)) {
          try {
            console.log(`Procesando unidad: ${unidad} con ${datos.length} registros`);
            const { newY, totals } = processUnit(doc, unidad, datos, currentY, pageWidth, pageHeight);
            currentY = newY;
            tableTotals.push(totals);
          } catch (error) {
            console.error(`Error procesando unidad ${unidad}:`, error);
            throw error;
          }
        }
      }
    } else {
      console.log('Saltando procesamiento por unidades - ES Grupos Operativos');
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
            const { newY, totals } = processCustomTable(doc, customTable.title, combinedData, currentY, pageWidth, pageHeight);
            currentY = newY;
            tableTotals.push(totals);
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
    if (tableTotals.length > 0) {
      console.log('Agregando tabla resumen con totales:', tableTotals);
      doc.addPage();
      const yInicial = 40; // Usar un punto de inicio uniforme para la tabla resumen
      addSummaryTable(doc, tableTotals, yInicial);
    } else {
      console.log('No hay totales para agregar a la tabla resumen');
    }

    // Eliminar la primera página que está vacía
    removeFirstPage(doc);

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

/**
 * Elimina la primera página del PDF
 */
const removeFirstPage = (doc: ExtendedJsPDF): void => {
  if (doc.getNumberOfPages() > 1) {
    doc.deletePage(1);
  }
};

// Re-exportar todas las utilidades para mantener la API pública
export * from './headerUtils';
export * from './tableUtils';
export * from './documentUtils';
export * from './dataProcessingUtils';
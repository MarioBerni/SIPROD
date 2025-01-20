import { PDFTableRow } from '../types/table.types';

interface OrderCount {
  tipoOrden: string;
  nroOrden: string;
  count: number;
}

/**
 * Cuenta la frecuencia de cada combinación de tipoOrden y nroOrden
 */
const countOrders = (data: PDFTableRow[]): OrderCount[] => {
  console.log('=== Iniciando conteo de órdenes ===');
  console.log('Datos recibidos:', data.length, 'registros');
  
  const counts = new Map<string, number>();
  
  data.forEach(row => {
    if (row.tipoOrden && row.nroOrden) {
      const key = `${row.tipoOrden}-${row.nroOrden}`;
      const newCount = (counts.get(key) || 0) + 1;
      counts.set(key, newCount);
      console.log(`Combinación encontrada: ${key}, nueva cuenta: ${newCount}`);
    } else {
      console.log('Registro sin tipoOrden o nroOrden:', row.nombreOperativo);
    }
  });

  const result = Array.from(counts.entries()).map(([key, count]) => {
    const [tipoOrden, nroOrden] = key.split('-');
    return { tipoOrden, nroOrden, count };
  });

  console.log('Conteos finales:', result);
  return result;
};

/**
 * Ordena los registros por frecuencia de tipoOrden y nroOrden
 * Esta función debe aplicarse después de otras ordenaciones
 */
export const sortByOrderFrequency = (data: PDFTableRow[]): PDFTableRow[] => {
  console.log('\n=== Iniciando ordenación por frecuencia ===');
  
  // Si no hay datos o los campos de orden no están presentes, devolver los datos sin cambios
  if (!data.length) {
    console.log('No hay datos para ordenar');
    return data;
  }

  // Verificar si los campos de orden están presentes
  const hasSortFields = data.some(row => row.tipoOrden && row.nroOrden);
  if (!hasSortFields) {
    console.log('No se encontraron campos de orden en los datos');
    return data;
  }

  // Contar frecuencias
  const orderCounts = countOrders(data);
  
  // Ordenar por frecuencia (de mayor a menor)
  const sortedCounts = orderCounts.sort((a, b) => b.count - a.count);
  console.log('Orden de prioridad por frecuencia:', 
    sortedCounts.map(item => `${item.tipoOrden}-${item.nroOrden}(${item.count})`));
  
  // Crear un mapa de prioridades basado en la frecuencia
  const priorityMap = new Map<string, number>();
  sortedCounts.forEach((item, index) => {
    const key = `${item.tipoOrden}-${item.nroOrden}`;
    priorityMap.set(key, index);
    console.log(`Prioridad asignada: ${key} -> ${index}`);
  });

  // Ordenar los datos usando el mapa de prioridades
  const result = [...data].sort((a, b) => {
    if (!a.tipoOrden || !a.nroOrden || !b.tipoOrden || !b.nroOrden) {
      return 0;
    }
    
    const keyA = `${a.tipoOrden}-${a.nroOrden}`;
    const keyB = `${b.tipoOrden}-${b.nroOrden}`;
    const priorityA = priorityMap.get(keyA) ?? Number.MAX_VALUE;
    const priorityB = priorityMap.get(keyB) ?? Number.MAX_VALUE;
    
    return priorityA - priorityB;
  });

  console.log('Orden final de registros:', 
    result.map(row => `${row.nombreOperativo} (${row.tipoOrden}-${row.nroOrden})`));
  console.log('=== Fin de ordenación ===\n');

  return result;
};

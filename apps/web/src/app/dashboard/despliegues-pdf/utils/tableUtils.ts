import 'jspdf-autotable';

// Re-exportar todo desde los módulos específicos
export * from './tables/headerTable';
export * from './tables/dataTable';
export * from './tables/summaryTable';

// Tipos exportados
export type { TableTotals } from './tables/dataTable';
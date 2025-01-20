// Mapa de títulos para las unidades
export const UNIT_TITLES: Record<string, string> = {
  'DIRECCION_I': 'Dirección I - Zona Metropolitana',
  'DIRECCION_II': 'Dirección II - Unidades Especiales',
  'GEO': 'GEO - Grupo Especial de Operaciones',
  'REGIONAL_ESTE': 'Regional Este',
  'REGIONAL_NORTE': 'Regional Norte',
  'DIRECCION_V': 'Dirección V',
  'OTRAS': 'Otras'
} as const;

// Constantes para los márgenes y espaciado
export const PAGE_MARGINS = {
  top: 25,    // Reducido para dar un aspecto más compacto
  bottom: 25, // Reducido para dar un aspecto más compacto
  left: 10,   // Ajustado para mejorar uso de espacio
  right: 10   // Ajustado para mejorar uso de espacio
} as const;

// Constantes para espaciado entre elementos
export const SPACING = {
  afterHeader: 8,    // Reducido para un espaciado más compacto
  beforeTable: 6,    // Reducido para menor separación antes de las tablas
  afterTable: 10,    // Reducido para menor separación después de las tablas
  beforeTitle: 8,    // Ajustado para menor separación antes de los títulos
  afterTitle: 6      // Ajustado para menor separación después de los títulos
} as const;

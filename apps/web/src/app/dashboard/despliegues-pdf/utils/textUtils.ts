import { TipoOperativoLabel } from '@/components/tabla-principal/types/generated';

/**
 * Formatea el nombre del operativo usando el label correspondiente
 */
export const formatOperativeName = (nombreOperativo: string): string => {
  // Si el nombre coincide exactamente con alguna clave de TipoOperativoLabel
  if (nombreOperativo in TipoOperativoLabel) {
    return TipoOperativoLabel[nombreOperativo as keyof typeof TipoOperativoLabel];
  }

  // Si el nombre es una combinación de tipo y nombre personalizado
  for (const [key, label] of Object.entries(TipoOperativoLabel)) {
    if (nombreOperativo.startsWith(key)) {
      const customName = nombreOperativo.slice(key.length).trim();
      return customName ? `${label} - ${customName}` : label;
    }
  }

  // Si no coincide con ningún patrón, devolver el nombre original
  return nombreOperativo;
};

/**
 * Genera un color hexadecimal basado en una cadena de texto.
 * El mismo texto siempre generará el mismo color.
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Aseguramos que los colores sean lo suficientemente saturados y brillantes
  const hue = Math.abs(hash) % 360; // 0-360 grados
  const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
  const lightness = 45 + (Math.abs(hash) % 10); // 45-55%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

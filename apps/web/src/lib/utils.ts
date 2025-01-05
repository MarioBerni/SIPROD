import { css, SerializedStyles } from '@emotion/react';

export const cn = (...styles: (string | undefined | null | false)[]) => {
  return styles.filter(Boolean).join(' ');
};

export const combineStyles = (...styles: SerializedStyles[]) => css`
  ${styles.join(' ')}
`;

// Función de ayuda para crear estilos condicionales
export const conditionalStyle = (condition: boolean, style: string) => 
  condition ? style : '';

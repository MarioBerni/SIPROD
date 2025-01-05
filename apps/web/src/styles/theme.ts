// Tema personalizado para SIPROD
export const theme = {
  colors: {
    // Colores principales
    primary: {
      DEFAULT: '#1a3b6e', // Azul institucional oscuro
      light: '#234c8d',
      dark: '#112845',
    },
    secondary: {
      DEFAULT: '#2c3e50', // Gris azulado profesional
      light: '#34495e',
      dark: '#243342',
    },
    // Estados y acciones
    success: {
      DEFAULT: '#2d5a27', // Verde institucional
      light: '#367d30',
      dark: '#1e3d1a',
    },
    warning: {
      DEFAULT: '#8b4513', // Marrón alerta
      light: '#a0522d',
      dark: '#723a0f',
    },
    danger: {
      DEFAULT: '#7b1818', // Rojo institucional
      light: '#8f1d1d',
      dark: '#671313',
    },
    // Grises neutros
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  // Espaciado consistente
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  // Bordes y sombras
  border: {
    radius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
    },
  },
  // Tipografía
  typography: {
    family: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    size: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
  },
}

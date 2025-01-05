import { createTheme, alpha } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Colores institucionales
const primaryMain = '#1a3b6e'; // Azul institucional
const secondaryMain = '#2c3e50'; // Gris azulado profesional

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryMain,
      light: '#234c8d',
      dark: '#112845',
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryMain,
      light: '#34495e',
      dark: '#243342',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2d5a27', // Verde institucional
      light: '#367d30',
      dark: '#1e3d1a',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#8b4513', // Marrón alerta
      light: '#a0522d',
      dark: '#723a0f',
      contrastText: '#ffffff',
    },
    error: {
      main: '#7b1818', // Rojo institucional
      light: '#8f1d1d',
      dark: '#671313',
      contrastText: '#ffffff',
    },
    info: {
      main: primaryMain,
      light: '#234c8d',
      dark: '#112845',
      contrastText: '#ffffff',
    },
    grey: {
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
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: primaryMain,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: primaryMain,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: primaryMain,
          color: '#ffffff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: alpha(primaryMain, 0.2),
            },
            '&:hover fieldset': {
              borderColor: alpha(primaryMain, 0.3),
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(primaryMain, 0.05),
          '& .MuiTableCell-root': {
            color: primaryMain,
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: alpha(primaryMain, 0.1),
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha('#ffffff', 0.12),
        },
      },
    },
  },
});

export default theme;
